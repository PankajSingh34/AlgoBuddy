// __tests__/getClientIp.test.js
//
// Run with:  npx jest __tests__/getClientIp.test.js --colors=false
//
// Tests the getClientIp utility in src/lib/getClientIp.js.

import { getClientIp } from "../src/lib/getClientIp.js";

function makeHeaders(entries = {}) {
  const get = (key) =>
    Object.prototype.hasOwnProperty.call(entries, key) ? entries[key] : null;
  return { get };
}

describe("getClientIp", () => {
  // ── x-real-ip takes priority ────────────────────────────────────
  test("returns x-real-ip when present", () => {
    const headers = makeHeaders({ "x-real-ip": "203.0.113.50" });
    expect(getClientIp(headers)).toBe("203.0.113.50");
  });

  test("trims whitespace from x-real-ip", () => {
    const headers = makeHeaders({ "x-real-ip": "  203.0.113.50  " });
    expect(getClientIp(headers)).toBe("203.0.113.50");
  });

  test("x-real-ip takes priority over x-forwarded-for", () => {
    const headers = makeHeaders({
      "x-real-ip": "203.0.113.50",
      "x-forwarded-for": "10.0.0.1, 172.16.0.1, 192.168.1.1",
    });
    expect(getClientIp(headers)).toBe("203.0.113.50");
  });

  // ── x-forwarded-for: rightmost non-private IP ───────────────────
  test("returns rightmost non-private IP from x-forwarded-for", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 172.16.0.1, 192.168.1.1, 203.0.113.50",
    });
    expect(getClientIp(headers)).toBe("203.0.113.50");
  });

  test("single non-private IP in x-forwarded-for is returned", () => {
    const headers = makeHeaders({ "x-forwarded-for": "198.51.100.42" });
    expect(getClientIp(headers)).toBe("198.51.100.42");
  });

  test("skips private IPs in x-forwarded-for from right to left", () => {
    // 192.168.x is private, 10.x is private, 172.16-31.x is private
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.5.6, 172.20.0.1, 203.0.113.99",
    });
    expect(getClientIp(headers)).toBe("203.0.113.99");
  });

  test("x-forwarded-for with whitespace-only elements is handled", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "  10.0.0.1  ,  ,  198.51.100.1  ",
    });
    // Empty/whitespace-only entries are filtered; 198.51.100.1 is non-private
    expect(getClientIp(headers)).toBe("198.51.100.1");
  });

  // ── Private IP ranges are correctly filtered ───────────────────
  test("10.x.x.x range is treated as private and skipped", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.255.255.255, 203.0.113.1",
    });
    expect(getClientIp(headers)).toBe("203.0.113.1");
  });

  test("172.16-31.x.x range is treated as private and skipped", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "172.16.0.1, 172.31.255.255, 198.51.100.1",
    });
    expect(getClientIp(headers)).toBe("198.51.100.1");
  });

  test("172.15.x.x and 172.32.x.x are NOT private (outside 16-31)", () => {
    const headers = makeHeaders({ "x-forwarded-for": "172.15.0.1" });
    expect(getClientIp(headers)).toBe("172.15.0.1");
  });

  test("192.168.x.x range is treated as private and skipped", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "192.168.0.1, 192.168.255.255, 198.51.100.1",
    });
    expect(getClientIp(headers)).toBe("198.51.100.1");
  });

  test("127.x.x.x (loopback) is treated as private and skipped", () => {
    const headers = makeHeaders({ "x-forwarded-for": "127.0.0.1, 203.0.113.1" });
    expect(getClientIp(headers)).toBe("203.0.113.1");
  });

  test("::1 (IPv6 loopback) is treated as private and skipped", () => {
    const headers = makeHeaders({ "x-forwarded-for": "::1, 203.0.113.1" });
    expect(getClientIp(headers)).toBe("203.0.113.1");
  });

  test("fc00::/7 IPv6 private range is treated as private and skipped", () => {
    const headers = makeHeaders({ "x-forwarded-for": "fc00::1, fd00::1, 203.0.113.1" });
    expect(getClientIp(headers)).toBe("203.0.113.1");
  });

  // ── Fallback behavior ───────────────────────────────────────────
  test("returns unknown when all x-forwarded-for hops are private", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.1.1, 172.16.0.1",
    });
    expect(getClientIp(headers)).toBe("unknown");
  });

  test("returns unknown when neither x-real-ip nor x-forwarded-for are present", () => {
    const headers = makeHeaders({});
    expect(getClientIp(headers)).toBe("unknown");
  });

  test("x-forwarded-for with only whitespace returns unknown", () => {
    const headers = makeHeaders({ "x-forwarded-for": "   ,  " });
    expect(getClientIp(headers)).toBe("unknown");
  });

  // ── IPv6 public addresses ──────────────────────────────────────
  test("returns public IPv6 address from x-forwarded-for", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 2001:db8::1",
    });
    expect(getClientIp(headers)).toBe("2001:db8::1");
  });
});
