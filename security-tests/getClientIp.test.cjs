// security-tests/getClientIp.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/getClientIp.test.cjs
//
// Tests the getClientIp utility in src/lib/getClientIp.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const getClientIpUrl = pathToFileURL(
  path.join(__dirname, "..", "src/lib/getClientIp.js"),
).href;

let getClientIp;

test("imports getClientIp without throwing", async () => {
  const mod = await import(getClientIpUrl);
  getClientIp = mod.getClientIp;
});

function mockHeaders(init) {
  return new Headers(init);
}

describe("getClientIp", () => {
  test("returns x-real-ip when present", () => {
    const headers = mockHeaders({ "x-real-ip": "8.8.8.8" });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });

  test("x-real-ip takes priority over x-forwarded-for", () => {
    const headers = mockHeaders({
      "x-real-ip": "8.8.8.8",
      "x-forwarded-for": "1.2.3.4",
    });
    assert.strictEqual(getClientIp(headers), "8.8.8.8");
  });

  test("returns rightmost non-private IP in x-forwarded-for", () => {
    const headers = mockHeaders({ "x-forwarded-for": "10.0.0.1, 203.0.113.5, 198.51.100.178" });
    assert.strictEqual(getClientIp(headers), "198.51.100.178");
  });

  test("returns unknown when all x-forwarded-for hops are private", () => {
    const headers = mockHeaders({ "x-forwarded-for": "10.0.0.1, 192.168.1.1" });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test("handles single public x-forwarded-for hop", () => {
    const headers = mockHeaders({ "x-forwarded-for": "203.0.113.50" });
    assert.strictEqual(getClientIp(headers), "203.0.113.50");
  });

  test("handles single private x-forwarded-for hop", () => {
    const headers = mockHeaders({ "x-forwarded-for": "10.0.0.5" });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test("rejects 127.x.x.x as private", () => {
    const headers = mockHeaders({ "x-forwarded-for": "127.0.0.1, 203.0.113.1" });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });

  test("rejects 172.16-31.x.x as private", () => {
    const headers = mockHeaders({ "x-forwarded-for": "172.20.0.1, 203.0.113.1" });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });

  test("accepts 172.15.x.x and 172.32.x.x as public", () => {
    const headers172_15 = mockHeaders({ "x-forwarded-for": "172.15.0.1" });
    const headers172_32 = mockHeaders({ "x-forwarded-for": "172.32.0.1" });
    assert.strictEqual(getClientIp(headers172_15), "172.15.0.1");
    assert.strictEqual(getClientIp(headers172_32), "172.32.0.1");
  });

  test("rejects IPv6 loopback ::1", () => {
    const headers = mockHeaders({ "x-forwarded-for": "::1, 203.0.113.1" });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });

  test("trims whitespace from IP values", () => {
    const headers = mockHeaders({ "x-forwarded-for": "  203.0.113.1  ,  10.0.0.1  " });
    assert.strictEqual(getClientIp(headers), "203.0.113.1");
  });

  test("returns unknown when no headers present", () => {
    const headers = mockHeaders({});
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test("returns unknown for empty x-forwarded-for", () => {
    const headers = mockHeaders({ "x-forwarded-for": "" });
    assert.strictEqual(getClientIp(headers), "unknown");
  });

  test("returns unknown for x-forwarded-for with only separators", () => {
    const headers = mockHeaders({ "x-forwarded-for": "  ,  ,  " });
    assert.strictEqual(getClientIp(headers), "unknown");
  });
});
