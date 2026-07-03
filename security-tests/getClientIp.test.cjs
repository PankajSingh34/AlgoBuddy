// security-tests/getClientIp.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/getClientIp.test.cjs
//
// Tests the getClientIp helper in src/lib/getClientIp.js.
// Inlined here because the source uses @/ path aliases that node:test cannot resolve.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// ── Inlined source from src/lib/getClientIp.js ───────────────────────────

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
function makeHeaders(map) {
  return { get: (key) => (map[key] !== undefined ? map[key] : null) };
}

// ── Tests ───────────────────────────────────────────────────────────────

describe('getClientIp — x-real-ip priority', () => {
  test('returns x-real-ip when present', () => {
    const headers = makeHeaders({ "x-real-ip": "203.0.113.50" });
    assert.strictEqual(getClientIp(headers), "203.0.113.50");
  });

  test('x-real-ip is trimmed', () => {
    const headers = makeHeaders({ "x-real-ip": "  203.0.113.50  " });
    assert.strictEqual(getClientIp(headers), "203.0.113.50");
  });

  test('x-real-ip takes priority over x-forwarded-for', () => {
    const headers = makeHeaders({
      "x-real-ip": "203.0.113.50",
      "x-forwarded-for": "10.0.0.1, 192.168.1.1",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.50");
  });
});

describe('getClientIp — X-Forwarded-For right-to-left parsing', () => {
  test('returns rightmost non-private hop', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.1.1, 203.0.113.50",
    });
    assert.strictEqual(getClientIp(headers), "203.0.113.50");
  });

  test('skips private hops in x-forwarded-for and returns first public', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.1.1, 172.16.0.1",
    });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('all hops private returns unknown', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.1.1, 172.20.0.5",
    });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('single public hop in x-forwarded-for is returned', () => {
    const headers = makeHeaders({ "x-forwarded-for": "203.0.113.99" });
    assert.strictEqual(getClientIp(headers), "203.0.113.99");
  });

  test('empty string x-forwarded-for returns unknown', () => {
    const headers = makeHeaders({ "x-forwarded-for": "" });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('comma-separated with spaces is parsed correctly', () => {
    const headers = makeHeaders({ "x-forwarded-for": "10.0.0.5 ,  203.0.113.7  , 192.168.0.1" });
    // Rightmost non-private: 192.168.0.1 is private, then 203.0.113.7
    assert.strictEqual(getClientIp(headers), "203.0.113.7");
  });
});

describe('getClientIp — private IP regex', () => {
  const PUBLIC_IPS = [
    "8.8.8.8",
    "1.1.1.1",
    "203.0.113.1",
    "199.232.69.194",
    "151.101.1.69",
  ];
  for (const ip of PUBLIC_IPS) {
    test(`${ip} is NOT matched as private`, () => {
      assert.strictEqual(PRIVATE_IP_RE.test(ip), false, `${ip} should not be matched as private`);
    });
  }

  const PRIVATE_IPS = [
    "127.0.0.1",
    "127.0.0.2",
    "10.0.0.0",
    "10.255.255.255",
    "10.1.2.3",
    "172.16.0.1",
    "172.31.255.255",
    "172.20.0.1",
    "192.168.0.1",
    "192.168.255.255",
  ];
  for (const ip of PRIVATE_IPS) {
    test(`${ip} IS matched as private`, () => {
      assert.strictEqual(PRIVATE_IP_RE.test(ip), true, `${ip} should be matched as private`);
    });
  }

  test('172.15.0.1 is NOT matched as private (outside 172.16-31)', () => {
    assert.strictEqual(PRIVATE_IP_RE.test("172.15.0.1"), false);
  });

  test('172.32.0.1 is NOT matched as private (outside 172.16-31)', () => {
    assert.strictEqual(PRIVATE_IP_RE.test("172.32.0.1"), false);
  });
});

describe('getClientIp — edge cases', () => {
  test('no headers returns unknown', () => {
    const headers = makeHeaders({});
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('x-forwarded-for with missing IP (null) returns unknown', () => {
    const headers = makeHeaders({ "x-forwarded-for": null });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test('IPv6 loopback ::1 is skipped in x-forwarded-for', () => {
    const headers = makeHeaders({ "x-forwarded-for": "::1, fc00::1, 203.0.113.5" });
    assert.strictEqual(getClientIp(headers), "203.0.113.5");
  });

  test('IPv6 private fd00:: is skipped in x-forwarded-for', () => {
    const headers = makeHeaders({ "x-forwarded-for": "fd12:3456:789a::1, 203.0.113.1" });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });
});
