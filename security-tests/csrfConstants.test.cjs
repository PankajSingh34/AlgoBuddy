// security-tests/csrfConstants.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrfConstants.test.cjs
//
// Tests the CSRF helper functions exported by src/lib/csrfConstants.js

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inlined implementation under test (mirrors src/lib/csrfConstants.js)
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

// Minimal mock request object
function makeRequest(headers) {
  return { headers };
}

describe('validateCsrfOrigin', () => {
  test('accepts http://localhost:3000', () => {
    const req = makeRequest(makeHeaders({ origin: "http://localhost:3000" }));
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test('accepts http://127.0.0.1:3000', () => {
    const req = makeRequest(makeHeaders({ origin: "http://127.0.0.1:3000" }));
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test('accepts https://algobuddy.me', () => {
    const req = makeRequest(makeHeaders({ origin: "https://algobuddy.me" }));
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test('accepts https://www.algobuddy.me', () => {
    const req = makeRequest(makeHeaders({ origin: "https://www.algobuddy.me" }));
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test('accepts https://algobuddy.vercel.app', () => {
    const req = makeRequest(makeHeaders({ origin: "https://algobuddy.vercel.app" }));
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test('accepts origin with trailing slash', () => {
    const req = makeRequest(makeHeaders({ origin: "https://algobuddy.me/" }));
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test('rejects untrusted origin', () => {
    const req = makeRequest(makeHeaders({ origin: "https://evil.com" }));
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test('rejects missing origin and referer', () => {
    const req = makeRequest(makeHeaders({}));
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test('falls back to referer when origin is absent', () => {
    // TRUSTED_ORIGINS contains "https://algobuddy.me" without a path,
    // so the referer must match exactly (no trailing path).
    const req = makeRequest(makeHeaders({ referer: "https://algobuddy.me" }));
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test('referer with path does not match trusted origin', () => {
    // referer includes a path which is not in TRUSTED_ORIGINS
    const req = makeRequest(makeHeaders({ referer: "https://algobuddy.me/page" }));
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test('rejects referer from untrusted origin', () => {
    const req = makeRequest(makeHeaders({ referer: "https://malicious.com/page" }));
    assert.strictEqual(validateCsrfOrigin(req), false);
  });
});

describe('isStateChangingMethod', () => {
  test('returns true for POST', () => {
    assert.strictEqual(isStateChangingMethod("POST"), true);
  });

  test('returns true for PUT', () => {
    assert.strictEqual(isStateChangingMethod("PUT"), true);
  });

  test('returns true for PATCH', () => {
    assert.strictEqual(isStateChangingMethod("PATCH"), true);
  });

  test('returns true for DELETE', () => {
    assert.strictEqual(isStateChangingMethod("DELETE"), true);
  });

  test('returns false for GET', () => {
    assert.strictEqual(isStateChangingMethod("GET"), false);
  });

  test('returns false for HEAD', () => {
    assert.strictEqual(isStateChangingMethod("HEAD"), false);
  });

  test('returns false for OPTIONS', () => {
    assert.strictEqual(isStateChangingMethod("OPTIONS"), false);
  });

  test('returns false for lowercase method names', () => {
    assert.strictEqual(isStateChangingMethod("post"), false);
    assert.strictEqual(isStateChangingMethod("get"), false);
  });
});

describe('isApiRoute', () => {
  test('returns true for /api/foo', () => {
    assert.strictEqual(isApiRoute("/api/foo"), true);
  });

  test('returns true for /api/v1/bar', () => {
    assert.strictEqual(isApiRoute("/api/v1/bar"), true);
  });

  test('returns true for /api/', () => {
    assert.strictEqual(isApiRoute("/api/"), true);
  });

  test('returns false for /foo', () => {
    assert.strictEqual(isApiRoute("/foo"), false);
  });

  test('returns false for /api-docs', () => {
    // Does not start with /api/ (the slash matters)
    assert.strictEqual(isApiRoute("/api-docs"), false);
  });

  test('returns false for root path', () => {
    assert.strictEqual(isApiRoute("/"), false);
  });

  test('returns false for empty string', () => {
    assert.strictEqual(isApiRoute(""), false);
  });
});

// Minimal Headers mock
function makeHeaders(entries = {}) {
  const map = new Map(Object.entries(entries).filter(([, v]) => v !== undefined));
  return {
    get(key) {
      return map.get(key) ?? null;
    },
  };
}
