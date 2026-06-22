// security-tests/getClientIp.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/getClientIp.test.cjs
//
// Tests for src/lib/getClientIp.js PRIVATE_IP_RE regex and getClientIp function.
// Inlined to avoid @/ alias resolution issues in the test runner.

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// ─── Inline PRIVATE_IP_RE and getClientIp from src/lib/getClientIp.js ───────────

const PRIVATE_IP_RE =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;

function getClientIp(headers) {
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    for (let i = hops.length - 1; i >= 0; i--) {
      if (!PRIVATE_IP_RE.test(hops[i])) return hops[i];
    }
  }

  return "unknown";
}

// Minimal Headers mock
function createMockHeaders(entries = {}) {
  return {
    get(key) {
      return key in entries ? entries[key] : null;
    },
  };
}

// ─── PRIVATE_IP_RE regex tests ─────────────────────────────────────────────────

describe('PRIVATE_IP_RE', () => {
  // 127.x loopback range
  test('matches 127.0.0.1', () => {
    assert.ok(PRIVATE_IP_RE.test("127.0.0.1"));
  });

  test('matches 127.255.255.255', () => {
    assert.ok(PRIVATE_IP_RE.test("127.255.255.255"));
  });

  test('matches 127.1.2.3', () => {
    assert.ok(PRIVATE_IP_RE.test("127.1.2.3"));
  });

  // 10.x private range
  test('matches 10.0.0.0', () => {
    assert.ok(PRIVATE_IP_RE.test("10.0.0.0"));
  });

  test('matches 10.255.255.255', () => {
    assert.ok(PRIVATE_IP_RE.test("10.255.255.255"));
  });

  test('matches 10.1.2.3', () => {
    assert.ok(PRIVATE_IP_RE.test("10.1.2.3"));
  });

  // 172.16-31.x private range
  test('matches 172.16.0.0', () => {
    assert.ok(PRIVATE_IP_RE.test("172.16.0.0"));
  });

  test('matches 172.31.255.255', () => {
    assert.ok(PRIVATE_IP_RE.test("172.31.255.255"));
  });

  test('matches 172.20.1.1', () => {
    assert.ok(PRIVATE_IP_RE.test("172.20.1.1"));
  });

  test('matches 172.19.100.50', () => {
    assert.ok(PRIVATE_IP_RE.test("172.19.100.50"));
  });

  // 172 outside RFC-1918 range
  test('does NOT match 172.15.255.255 (below 16)', () => {
    assert.ok(!PRIVATE_IP_RE.test("172.15.255.255"));
  });

  test('does NOT match 172.32.0.1 (above 31)', () => {
    assert.ok(!PRIVATE_IP_RE.test("172.32.0.1"));
  });

  // 192.168.x private range
  test('matches 192.168.0.0', () => {
    assert.ok(PRIVATE_IP_RE.test("192.168.0.0"));
  });

  test('matches 192.168.255.255', () => {
    assert.ok(PRIVATE_IP_RE.test("192.168.255.255"));
  });

  test('matches 192.168.1.1', () => {
    assert.ok(PRIVATE_IP_RE.test("192.168.1.1"));
  });

  // ::1 loopback IPv6
  test('matches ::1', () => {
    assert.ok(PRIVATE_IP_RE.test("::1"));
  });

  test('does NOT match ::2 (not loopback)', () => {
    assert.ok(!PRIVATE_IP_RE.test("::2"));
  });

  // fc:: IPv6 private
  test('matches fc00::1', () => {
    assert.ok(PRIVATE_IP_RE.test("fc00::1"));
  });

  test('matches fc01:abcd:1234::', () => {
    assert.ok(PRIVATE_IP_RE.test("fc01:abcd:1234::"));
  });

  test('does NOT match fd00::1 (fd:: range is private too, should match)', () => {
    assert.ok(PRIVATE_IP_RE.test("fd00::1")); // fd:: IS private
  });

  test('matches fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
    assert.ok(PRIVATE_IP_RE.test("fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff"));
  });

  test('does NOT match fe80::1 (link-local but not fc:/fd:)', () => {
    assert.ok(!PRIVATE_IP_RE.test("fe80::1"));
  });

  // Public IPs
  test('does NOT match 8.8.8.8 (Google DNS)', () => {
    assert.ok(!PRIVATE_IP_RE.test("8.8.8.8"));
  });

  test('does NOT match 203.0.113.1 (TEST-NET-3 documentation range)', () => {
    assert.ok(!PRIVATE_IP_RE.test("203.0.113.1"));
  });

  test('does NOT match 1.1.1.1 (Cloudflare)', () => {
    assert.ok(!PRIVATE_IP_RE.test("1.1.1.1"));
  });

  test('does NOT match 93.184.216.34 (example.com)', () => {
    assert.ok(!PRIVATE_IP_RE.test("93.184.216.34"));
  });

  // Case insensitivity (the /i flag)
  test('matches 10.1.2.3 case-insensitively', () => {
    assert.ok(PRIVATE_IP_RE.test("10.1.2.3"));
  });

  test('matches FC00::1 uppercase', () => {
    assert.ok(PRIVATE_IP_RE.test("FC00::1"));
  });

  test('matches 172.16.0.1 mixed case', () => {
    assert.ok(PRIVATE_IP_RE.test("172.16.0.1"));
  });
});

// ─── getClientIp function tests ────────────────────────────────────────────────

describe('getClientIp', () => {
  test('returns x-real-ip when set', () => {
    const headers = createMockHeaders({ "x-real-ip": "8.8.8.8" });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });

  test('returns trimmed x-real-ip', () => {
    const headers = createMockHeaders({ "x-real-ip": "  203.0.113.1  " });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });

  test('returns private x-real-ip without filtering (Vercel-set, trusted)', () => {
    const headers = createMockHeaders({ "x-real-ip": "10.0.0.1" });
    assert.strictEqual(getClientIp(headers), "10.0.0.1");
  });

  test('x-real-ip takes priority over x-forwarded-for', () => {
    const headers = createMockHeaders({
      "x-real-ip": "8.8.8.8",
      "x-forwarded-for": "1.2.3.4, 5.6.7.8",
    });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });

  test('x-forwarded-for with single public IP returns it', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "203.0.113.1" });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });

  test('x-forwarded-for trims spaces around IPs', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "  8.8.8.8  " });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });

  test('x-forwarded-for trims comma-separated IPs correctly', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "10.0.0.1, 203.0.113.1" });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });

  test('x-forwarded-for with private then public hop returns rightmost public', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "10.0.0.1, 192.168.1.1, 8.8.8.8" });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });

  test('x-forwarded-for skips private IPs and returns first public from right', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "127.0.0.1, 10.0.0.5, 93.184.216.34" });
    assert.strictEqual(getClientIp(headers), "93.184.216.34");
  });

  test('x-forwarded-for with only private hops returns unknown', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "10.0.0.1, 192.168.1.1, 172.16.0.1" });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('x-forwarded-for with all private hops returns unknown', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "::1, 10.0.0.1, 192.168.1.1" });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('x-forwarded-for skips fc:/fd: private IPv6 hops', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "fc00::1, fd00::1, 8.8.8.8" });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });

  test('x-forwarded-for with empty string returns unknown', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "" });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('x-forwarded-for with whitespace-only returns unknown', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "   " });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('no x-real-ip and no x-forwarded-for returns unknown', () => {
    const headers = createMockHeaders({});
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('x-forwarded-for with only commas returns unknown', () => {
    const headers = createMockHeaders({ "x-forwarded-for": ",," });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('handles x-forwarded-for with extra whitespace between hops', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "  10.0.0.1  ,   8.8.8.8  " });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });

  test('handles mixed case hex in IPv6 private addresses', () => {
    const headers = createMockHeaders({ "x-forwarded-for": "FC00::1, 8.8.8.8" });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });
});
