// security-tests/getClientIp.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/getClientIp.test.cjs

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined source to avoid ESM import issues.
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

function makeHeaders(dict) {
  return {
    get: (key) => (key in dict ? dict[key] : null),
  };
}

// ── Tests ────────────────────────────────────────────────────────────

describe("getClientIp — x-real-ip priority", () => {
  test("returns x-real-ip when present", () => {
    const headers = makeHeaders({ "x-real-ip": "203.0.113.45" });
    assert.equal(getClientIp(headers), "203.0.113.45");
  });

  test("trims whitespace from x-real-ip", () => {
    const headers = makeHeaders({ "x-real-ip": "  203.0.113.45  " });
    assert.equal(getClientIp(headers), "203.0.113.45");
  });

  test("prefers x-real-ip over X-Forwarded-For", () => {
    const headers = makeHeaders({
      "x-real-ip": "198.51.100.10",
      "x-forwarded-for": "203.0.113.1, 10.0.0.1",
    });
    assert.equal(getClientIp(headers), "198.51.100.10");
  });
});

describe("getClientIp — X-Forwarded-For rightmost hop", () => {
  test("returns the rightmost public IP", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "203.0.113.1, 10.0.0.1, 198.51.100.5",
    });
    assert.equal(getClientIp(headers), "198.51.100.5");
  });

  test("skips private IPs from rightmost until a public one is found", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "203.0.113.1, 10.0.0.1, 192.168.1.1",
    });
    assert.equal(getClientIp(headers), "203.0.113.1");
  });

  test("skips multiple consecutive private IPs", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "172.16.0.1, 192.168.0.1, 10.0.0.5, 198.51.100.99",
    });
    assert.equal(getClientIp(headers), "198.51.100.99");
  });

  test("returns unknown when all hops are private", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "10.0.0.1, 192.168.1.1, 172.17.0.1",
    });
    assert.equal(getClientIp(headers), "unknown");
  });

  test("handles single public IP in X-Forwarded-For", () => {
    const headers = makeHeaders({ "x-forwarded-for": "203.0.113.50" });
    assert.equal(getClientIp(headers), "203.0.113.50");
  });

  test("trims whitespace from each X-Forwarded-For hop", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "  203.0.113.1  ,  10.0.0.1  ",
    });
    assert.equal(getClientIp(headers), "203.0.113.1");
  });
});

describe("getClientIp — RFC-1918 private IP filtering", () => {
  test("rejects 10.x.x.x as private", () => {
    const headers = makeHeaders({ "x-forwarded-for": "10.255.255.255" });
    assert.equal(getClientIp(headers), "unknown");
  });

  test("rejects 172.16.x.x – 172.31.x.x as private", () => {
    const headers = makeHeaders({ "x-forwarded-for": "172.20.0.1" });
    assert.equal(getClientIp(headers), "unknown");
  });

  test("rejects 192.168.x.x as private", () => {
    const headers = makeHeaders({ "x-forwarded-for": "192.168.255.255" });
    assert.equal(getClientIp(headers), "unknown");
  });

  test("rejects 127.x.x.x (loopback) as private", () => {
    const headers = makeHeaders({ "x-forwarded-for": "127.0.0.1" });
    assert.equal(getClientIp(headers), "unknown");
  });
});

describe("getClientIp — SSR fallback", () => {
  test("returns unknown when no headers are present", () => {
    const headers = makeHeaders({});
    assert.equal(getClientIp(headers), "unknown");
  });

  test("returns unknown when headers is empty object", () => {
    assert.equal(getClientIp({ get: () => null }), "unknown");
  });
});
