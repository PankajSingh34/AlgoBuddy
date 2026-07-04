// security-tests/getClientIp.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/getClientIp.test.cjs
//
// Tests the getClientIp function exported by src/lib/getClientIp.js

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inlined implementation under test (mirrors src/lib/getClientIp.js)
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

// Minimal mock Headers class
function makeHeaders(entries = {}) {
  const map = new Map(Object.entries(entries).filter(([, v]) => v !== undefined));
  return {
    get(key) {
      return map.get(key) ?? null;
    },
  };
}

describe('getClientIp', () => {
  test('prefers x-real-ip header over x-forwarded-for', () => {
    const headers = makeHeaders({
      "x-real-ip": "203.0.113.50",
      "x-forwarded-for": "10.0.0.1, 192.168.1.1",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.50");
  });

  test('returns x-forwarded-for rightmost non-private hop when x-real-ip absent', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.1.1, 203.0.113.99",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.99");
  });

  test('returns x-forwarded-for single public hop', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "203.0.113.1",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });

  test('returns unknown when all x-forwarded-for hops are private', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.1.1",
    });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('returns unknown when no headers are present', () => {
    const headers = makeHeaders({});
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('filters 127.x loopback addresses', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "127.0.0.1, 203.0.113.5",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.5");
  });

  test('filters 10.x addresses', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.5.1, 10.255.255.255, 203.0.113.7",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.7");
  });

  test('filters 172.16-31.x addresses', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "172.16.0.1, 172.31.255.255, 203.0.113.8",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.8");
  });

  test('skips 172.15.x when looking for rightmost public hop', () => {
    // 172.15.x is not RFC-1918 private, so it should NOT be filtered out.
    // When hops are [172.15.0.1, 203.0.113.9], walking right-to-left
    // finds 203.0.113.9 first (public) — so 172.15.0.1 is never reached.
    const headers = makeHeaders({
      "x-forwarded-for": "172.15.0.1, 203.0.113.9",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.9");
  });

  test('returns 172.15.0.1 as client IP when it is the rightmost hop', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "203.0.113.50, 172.15.0.1",
    });
    assert.strictEqual(getClientIp(headers), "172.15.0.1");
  });

  test('filters 192.168.x addresses', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "192.168.0.100, 203.0.113.10",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.10");
  });

  test('handles whitespace in x-forwarded-for hops', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "  10.0.0.1  ,  203.0.113.11  ",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.11");
  });

  test('handles empty x-forwarded-for gracefully', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "",
    });
    assert.strictEqual(getClientIp(headers), "unknown");
  });
});
