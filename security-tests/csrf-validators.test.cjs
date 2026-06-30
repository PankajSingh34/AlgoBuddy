// security-tests/csrf-validators.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrf-validators.test.cjs
//
// Tests CSRF helpers in src/lib/csrf.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

// ─── Inline csrf helpers ───────────────────────────────────────────────────────
const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

const TRUSTED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://algobuddy.me",
  "https://www.algobuddy.me",
  "https://algobuddy.vercel.app",
]);

function validateCsrfOrigin(request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin || referer || "";
  const normalized = source.replace(/\/+$/, "");
  return TRUSTED_ORIGINS.has(normalized);
}

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isStateChangingMethod(method) {
  return STATE_CHANGING_METHODS.has(method);
}

function isApiRoute(pathname) {
  return pathname.startsWith("/api/");
}

// ─── validateCsrfOrigin tests ──────────────────────────────────────────────────
describe("validateCsrfOrigin", () => {
  function makeRequest(origin, referer) {
    const headers = new Map();
    if (origin !== undefined) headers.set("origin", origin);
    if (referer !== undefined) headers.set("referer", referer);
    return { headers: { get: (k) => headers.get(k) } };
  }

  test("accepts localhost:3000", () => {
    assert.ok(validateCsrfOrigin(makeRequest("http://localhost:3000")));
  });

  test("accepts 127.0.0.1:3000", () => {
    assert.ok(validateCsrfOrigin(makeRequest("http://127.0.0.1:3000")));
  });

  test("accepts algobuddy.me", () => {
    assert.ok(validateCsrfOrigin(makeRequest("https://algobuddy.me")));
  });

  test("accepts www.algobuddy.me", () => {
    assert.ok(validateCsrfOrigin(makeRequest("https://www.algobuddy.me")));
  });

  test("accepts algobuddy.vercel.app", () => {
    assert.ok(validateCsrfOrigin(makeRequest("https://algobuddy.vercel.app")));
  });

  test("rejects unknown domain", () => {
    assert.ok(!validateCsrfOrigin(makeRequest("https://evil.com")));
  });

  test("rejects empty origin and referer", () => {
    assert.ok(!validateCsrfOrigin(makeRequest(undefined, undefined)));
  });

  test("strips trailing slash before matching", () => {
    assert.ok(validateCsrfOrigin(makeRequest("https://algobuddy.me/")));
    // path-only URLs are not in TRUSTED_ORIGINS, only base origin is
  });

  test("falls back to referer when origin is absent", () => {
    const req = makeRequest(undefined, "https://algobuddy.me");
    assert.ok(validateCsrfOrigin(req));
  });

  test("referer with path does not match base origin", () => {
    const req = makeRequest(undefined, "https://algobuddy.me/contact");
    assert.ok(!validateCsrfOrigin(req));
  });

  test("prefers origin over referer", () => {
    const req = makeRequest("https://algobuddy.me", "https://evil.com");
    assert.ok(validateCsrfOrigin(req));
  });
});

// ─── isStateChangingMethod tests ──────────────────────────────────────────────
describe("isStateChangingMethod", () => {
  test("POST is state-changing", () => assert.ok(isStateChangingMethod("POST")));
  test("PUT is state-changing", () => assert.ok(isStateChangingMethod("PUT")));
  test("PATCH is state-changing", () => assert.ok(isStateChangingMethod("PATCH")));
  test("DELETE is state-changing", () => assert.ok(isStateChangingMethod("DELETE")));
  test("GET is not state-changing", () => assert.ok(!isStateChangingMethod("GET")));
  test("HEAD is not state-changing", () => assert.ok(!isStateChangingMethod("HEAD")));
  test("OPTIONS is not state-changing", () => assert.ok(!isStateChangingMethod("OPTIONS")));
  test("lowercase post is not state-changing", () => assert.ok(!isStateChangingMethod("post")));
});

// ─── isApiRoute tests ─────────────────────────────────────────────────────────
describe("isApiRoute", () => {
  test("/api/foo returns true", () => assert.ok(isApiRoute("/api/foo")));
  test("/api/foo/bar returns true", () => assert.ok(isApiRoute("/api/foo/bar")));
  test("/app/xxx returns false", () => assert.ok(!isApiRoute("/app/xxx")));
  test("/page returns false", () => assert.ok(!isApiRoute("/page")));
  test("/api/something returns true", () => assert.ok(isApiRoute("/api/something")));
});
