// security-tests/getClientIp.test.cjs
//
// Run with:  node --test security-tests/getClientIp.test.cjs
//
// Tests src/lib/getClientIp.js — getClientIp header parsing.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const { getClientIp } = require("../src/lib/getClientIp");

// Helper: build a minimal Headers-like object with .get()
function headers(dict = {}) {
  return {
    get: (k) => dict[k] ?? null,
  };
}

// ── x-real-ip ─────────────────────────────────────────────────────────────────

test("returns x-real-ip when present", () => {
  const h = headers({ "x-real-ip": "203.0.113.42" });
  assert.strictEqual(getClientIp(h), "203.0.113.42");
});

test("x-real-ip is trimmed", () => {
  const h = headers({ "x-real-ip": "  198.51.100.7  " });
  assert.strictEqual(getClientIp(h), "198.51.100.7");
});

test("x-real-ip takes priority over x-forwarded-for", () => {
  const h = headers({ "x-real-ip": "10.0.0.1", "x-forwarded-for": "203.0.113.1" });
  assert.strictEqual(getClientIp(h), "10.0.0.1");
});

// ── x-forwarded-for ──────────────────────────────────────────────────────────

test("returns single x-forwarded-for when not private", () => {
  const h = headers({ "x-forwarded-for": "203.0.113.42" });
  assert.strictEqual(getClientIp(h), "203.0.113.42");
});

test("returns rightmost non-private hop from multiple x-forwarded-for", () => {
  // Last hop is private, so scan right-to-left until a public IP is found.
  const h = headers({ "x-forwarded-for": "10.0.0.1, 172.16.0.5, 203.0.113.42" });
  assert.strictEqual(getClientIp(h), "203.0.113.42");
});

test("skips multiple private hops, returns first public from right", () => {
  const h = headers({ "x-forwarded-for": "192.168.1.1, 10.0.0.99, 172.31.255.1, 198.51.100.7" });
  assert.strictEqual(getClientIp(h), "198.51.100.7");
});

test("returns second hop when last is private", () => {
  const h = headers({ "x-forwarded-for": "10.0.0.1, 203.0.113.99" });
  assert.strictEqual(getClientIp(h), "203.0.113.99");
});

test("x-forwarded-for whitespace is trimmed per-hop", () => {
  const h = headers({ "x-forwarded-for": "  10.0.0.1  ,  203.0.113.5  " });
  assert.strictEqual(getClientIp(h), "203.0.113.5");
});

// ── RFC-1918 private ranges ───────────────────────────────────────────────────

test("strips 10.0.0.0/8 private range", () => {
  const h = headers({ "x-forwarded-for": "10.255.255.255" });
  assert.strictEqual(getClientIp(h), "unknown");
});

test("strips 172.16.0.0/12 private range", () => {
  for (const ip of ["172.16.0.1", "172.31.255.255", "172.20.0.9"]) {
    const h = headers({ "x-forwarded-for": ip });
    assert.strictEqual(getClientIp(h), "unknown", `should strip ${ip}`);
  }
});

test("strips 192.168.0.0/16 private range", () => {
  const h = headers({ "x-forwarded-for": "192.168.99.99" });
  assert.strictEqual(getClientIp(h), "unknown");
});

test("strips loopback 127.0.0.0/8", () => {
  const h = headers({ "x-forwarded-for": "127.0.0.1" });
  assert.strictEqual(getClientIp(h), "unknown");
});

// ── IPv6 private ranges ────────────────────────────────────────────────────────

test("strips IPv6 loopback ::1", () => {
  const h = headers({ "x-forwarded-for": "::1" });
  assert.strictEqual(getClientIp(h), "unknown");
});

test("strips IPv6 private fc00::/7", () => {
  const h = headers({ "x-forwarded-for": "fc00:0000:0000:0000:0000:0000:0000:0001" });
  assert.strictEqual(getClientIp(h), "unknown");
});

test("strips IPv6 private fd00::/7", () => {
  const h = headers({ "x-forwarded-for": "fd12:3456:789a::1" });
  assert.strictEqual(getClientIp(h), "unknown");
});

// ── Fallback ──────────────────────────────────────────────────────────────────

test("returns unknown when no headers present", () => {
  const h = headers({});
  assert.strictEqual(getClientIp(h), "unknown");
});

test("returns unknown when only private IPs in x-forwarded-for", () => {
  const h = headers({ "x-forwarded-for": "10.0.0.1, 192.168.1.1, 172.16.0.1" });
  assert.strictEqual(getClientIp(h), "unknown");
});

test("empty x-real-ip falls through to x-forwarded-for", () => {
  const h = headers({ "x-real-ip": "", "x-forwarded-for": "203.0.113.42" });
  assert.strictEqual(getClientIp(h), "203.0.113.42");
});

// ── Mixed public/private ──────────────────────────────────────────────────────

test("real-world: Vercel proxy pattern x-real-ip then private x-forwarded-for", () => {
  // x-real-ip set by Vercel edge; x-forwarded-for has client, private hops
  const h = headers({
    "x-real-ip": "203.0.113.99",
    "x-forwarded-for": "198.51.100.7, 10.0.0.1, 172.16.0.1",
  });
  assert.strictEqual(getClientIp(h), "203.0.113.99");
});

test("CDN pattern: rightmost non-private is returned even when earlier public hops exist", () => {
  // Right-to-left scan skips 10.0.0.5 (private), then returns 198.51.100.7.
  const h = headers({ "x-forwarded-for": "198.51.100.7, 10.0.0.5" });
  assert.strictEqual(getClientIp(h), "198.51.100.7");
});
