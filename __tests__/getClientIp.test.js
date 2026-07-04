import { describe, expect, test } from "@jest/globals";
import { getClientIp } from "../src/lib/getClientIp.js";

function mockHeaders(entries) {
  const map = new Map(Object.entries(entries));
  return { get: (key) => map.get(key) ?? null };
}

describe("getClientIp", () => {
  test("returns x-real-ip when present", () => {
    const headers = mockHeaders({
      "x-real-ip": "203.0.113.42",
    });
    expect(getClientIp(headers)).toBe("203.0.113.42");
  });

  test("x-real-ip takes priority over x-forwarded-for", () => {
    const headers = mockHeaders({
      "x-real-ip": "203.0.113.1",
      "x-forwarded-for": "1.2.3.4, 5.6.7.8",
    });
    expect(getClientIp(headers)).toBe("203.0.113.1");
  });

  test("returns rightmost non-private hop from x-forwarded-for", () => {
    const headers = mockHeaders({
      "x-forwarded-for": "192.168.1.1, 10.0.0.1, 203.0.113.99",
    });
    expect(getClientIp(headers)).toBe("203.0.113.99");
  });

  test("skips RFC-1918, loopback, and link-local hops", () => {
    const headers = mockHeaders({
      "x-forwarded-for": "127.0.0.1, 10.0.0.5, 172.16.0.1, 192.168.1.100, 203.0.113.10",
    });
    expect(getClientIp(headers)).toBe("203.0.113.10");
  });

  test("returns unknown when x-forwarded-for contains only private IPs", () => {
    const headers = mockHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.1.1",
    });
    expect(getClientIp(headers)).toBe("unknown");
  });

  test("returns unknown when no IP headers exist", () => {
    const headers = mockHeaders({});
    expect(getClientIp(headers)).toBe("unknown");
  });

  test("handles IPv6 loopback", () => {
    const headers = mockHeaders({
      "x-forwarded-for": "::1, 2001:db8::1",
    });
    expect(getClientIp(headers)).toBe("2001:db8::1");
  });
});
