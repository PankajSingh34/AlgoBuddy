// __tests__/rateLimit.test.js
//
// Run with:  npx jest __tests__/rateLimit.test.js
//
// Tests the sliding-window logic in lib/rateLimit/rateLimit.js.
// No network, no Supabase, no Next.js needed — pure unit tests.

const { checkRateLimit, resetKey, resetAll } = require("../lib/rateLimit/rateLimit");

describe("checkRateLimit — sliding window", () => {
  const KEY = "test-user-123";
  const MAX = 5;
  const WINDOW = 60; // seconds

  beforeEach(() => {
    resetAll(); // start every test with a clean slate
  });

  // ── Basic allow / deny ────────────────────────────────────────────
  test("allows requests up to the limit", () => {
    for (let i = 0; i < MAX; i++) {
      const result = checkRateLimit(KEY, MAX, WINDOW);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(MAX - (i + 1));
    }
  });

  test("denies the request that exceeds the limit", () => {
    for (let i = 0; i < MAX; i++) checkRateLimit(KEY, MAX, WINDOW);
    const result = checkRateLimit(KEY, MAX, WINDOW);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  test("retryAfter is a positive number of seconds when denied", () => {
    for (let i = 0; i <= MAX; i++) checkRateLimit(KEY, MAX, WINDOW);
    const { retryAfter } = checkRateLimit(KEY, MAX, WINDOW);
    expect(typeof retryAfter).toBe("number");
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(WINDOW);
  });

  // ── Key isolation ─────────────────────────────────────────────────
  test("different keys have independent counters", () => {
    const KEY_A = "user-a";
    const KEY_B = "user-b";
    for (let i = 0; i < MAX; i++) checkRateLimit(KEY_A, MAX, WINDOW);

    // Key A is exhausted but Key B is still fresh
    expect(checkRateLimit(KEY_A, MAX, WINDOW).allowed).toBe(false);
    expect(checkRateLimit(KEY_B, MAX, WINDOW).allowed).toBe(true);
  });

  // ── Sliding window: old timestamps expire ─────────────────────────
  test("allows new requests after the window expires", () => {
    // Use a very short window (1 second) and fake Date.now
    const TINY_WINDOW = 1; // second
    const realDateNow = Date.now.bind(global.Date);

    // Fill the bucket at t=0
    const t0 = 1_700_000_000_000;
    global.Date.now = jest.fn().mockReturnValue(t0);
    for (let i = 0; i < MAX; i++) checkRateLimit(KEY, MAX, TINY_WINDOW);
    expect(checkRateLimit(KEY, MAX, TINY_WINDOW).allowed).toBe(false);

    // Advance clock past the window
    global.Date.now = jest.fn().mockReturnValue(t0 + TINY_WINDOW * 1000 + 100);
    const result = checkRateLimit(KEY, MAX, TINY_WINDOW);
    expect(result.allowed).toBe(true);

    global.Date.now = realDateNow;
  });

  // ── resetKey ──────────────────────────────────────────────────────
  test("resetKey clears only the specified key", () => {
    const KEY_C = "user-c";
    const KEY_D = "user-d";

    for (let i = 0; i < MAX; i++) checkRateLimit(KEY_C, MAX, WINDOW);
    for (let i = 0; i < MAX; i++) checkRateLimit(KEY_D, MAX, WINDOW);

    resetKey(KEY_C);

    expect(checkRateLimit(KEY_C, MAX, WINDOW).allowed).toBe(true); // reset
    expect(checkRateLimit(KEY_D, MAX, WINDOW).allowed).toBe(false); // still exhausted
  });

  // ── Remaining counter ─────────────────────────────────────────────
  test("remaining decrements correctly with each request", () => {
    for (let i = 0; i < MAX; i++) {
      const { remaining } = checkRateLimit(KEY, MAX, WINDOW);
      expect(remaining).toBe(MAX - i - 1);
    }
  });

  // ── Zero retryAfter when allowed ──────────────────────────────────
  test("retryAfter is 0 when the request is allowed", () => {
    const { retryAfter } = checkRateLimit(KEY, MAX, WINDOW);
    expect(retryAfter).toBe(0);
  });
});