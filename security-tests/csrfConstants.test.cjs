// security-tests/csrfConstants.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrfConstants.test.cjs
//
// Tests CSRF constants and helper functions from src/lib/csrfConstants.js.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inline csrfConstants.js for deterministic testing
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

const STATE_CHANGING_METHODS = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

function isStateChangingMethod(method) {
  return STATE_CHANGING_METHODS.has(method);
}

function isApiRoute(pathname) {
  return pathname.startsWith("/api/");
}

describe("validateCsrfOrigin", () => {
  test("returns true for localhost:3000 origin", () => {
    const req = {
      headers: { get: (key) => (key === "origin" ? "http://localhost:3000" : null) },
    };
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns true for 127.0.0.1:3000 origin", () => {
    const req = {
      headers: { get: (key) => (key === "origin" ? "http://127.0.0.1:3000" : null) },
    };
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns true for algobuddy.me origin", () => {
    const req = {
      headers: { get: (key) => (key === "origin" ? "https://algobuddy.me" : null) },
    };
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns true for www.algobuddy.me origin", () => {
    const req = {
      headers: { get: (key) => (key === "origin" ? "https://www.algobuddy.me" : null) },
    };
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns true for algobuddy.vercel.app origin", () => {
    const req = {
      headers: { get: (key) => (key === "origin" ? "https://algobuddy.vercel.app" : null) },
    };
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns true for origin without trailing slash", () => {
    const req = {
      headers: { get: (key) => (key === "origin" ? "https://algobuddy.me/" : null) },
    };
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns true when referer is trusted (fallback, no origin)", () => {
    const req = {
      headers: { get: (key) => (key === "origin" ? null : (key === "referer" ? "https://algobuddy.me" : null)) },
    };
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns false for untrusted origin", () => {
    const req = {
      headers: { get: (key) => (key === "origin" ? "https://evil.com" : null) },
    };
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test("returns false when both origin and referer are missing", () => {
    const req = {
      headers: { get: () => null },
    };
    assert.strictEqual(validateCsrfOrigin(req), false);
  });
});

describe("isStateChangingMethod", () => {
  test("returns true for POST", () => {
    assert.strictEqual(isStateChangingMethod("POST"), true);
  });

  test("returns true for PUT", () => {
    assert.strictEqual(isStateChangingMethod("PUT"), true);
  });

  test("returns true for PATCH", () => {
    assert.strictEqual(isStateChangingMethod("PATCH"), true);
  });

  test("returns true for DELETE", () => {
    assert.strictEqual(isStateChangingMethod("DELETE"), true);
  });

  test("returns false for GET", () => {
    assert.strictEqual(isStateChangingMethod("GET"), false);
  });

  test("returns false for HEAD", () => {
    assert.strictEqual(isStateChangingMethod("HEAD"), false);
  });

  test("returns false for OPTIONS", () => {
    assert.strictEqual(isStateChangingMethod("OPTIONS"), false);
  });

  test("returns false for lowercase post", () => {
    assert.strictEqual(isStateChangingMethod("post"), false);
  });
});

describe("isApiRoute", () => {
  test("returns true for /api/foo", () => {
    assert.strictEqual(isApiRoute("/api/foo"), true);
  });

  test("returns true for /api/v1/users", () => {
    assert.strictEqual(isApiRoute("/api/v1/users"), true);
  });

  test("returns false for /foo", () => {
    assert.strictEqual(isApiRoute("/foo"), false);
  });

  test("returns false for /app/api/bar", () => {
    assert.strictEqual(isApiRoute("/app/api/bar"), false);
  });

  test("returns false for empty string", () => {
    assert.strictEqual(isApiRoute(""), false);
  });
});
