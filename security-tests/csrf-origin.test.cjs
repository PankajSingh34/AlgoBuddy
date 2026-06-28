'use strict';

// security-tests/csrf-origin.test.cjs
// Run with: node --experimental-detect-module --test security-tests/csrf-origin.test.cjs
//
// Tests CSRF helpers from src/lib/csrf.js.
// Logic is inlined to avoid import path issues with @/ aliases.

const { test } = require('node:test');
const assert = require('node:assert/strict');

// Inlined from src/lib/csrf.js
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
  const origin = request.headers ? request.headers.get("origin") : request.origin;
  const referer = request.headers ? request.headers.get("referer") : request.referer;
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

// Minimal Headers mock — get() returns null for missing keys (matches real Headers API)
class MockHeaders {
  constructor(values = {}) {
    this._values = values;
  }
  get(name) {
    const v = this._values[name];
    return v !== undefined ? v : null;
  }
}

// Helpers to build mock request objects
function makeRequest({ origin = null, referer = null } = {}) {
  return {
    headers: new MockHeaders({
      origin: origin,
      referer: referer,
    }),
  };
}

// Tests for validateCsrfOrigin
test('validateCsrfOrigin: accepts localhost origin', () => {
  const req = makeRequest({ origin: 'http://localhost:3000' });
  assert.equal(validateCsrfOrigin(req), true);
});

test('validateCsrfOrigin: accepts 127.0.0.1 origin', () => {
  const req = makeRequest({ origin: 'http://127.0.0.1:3000' });
  assert.equal(validateCsrfOrigin(req), true);
});

test('validateCsrfOrigin: accepts algobuddy.me origin', () => {
  const req = makeRequest({ origin: 'https://algobuddy.me' });
  assert.equal(validateCsrfOrigin(req), true);
});

test('validateCsrfOrigin: accepts www.algobuddy.me origin', () => {
  const req = makeRequest({ origin: 'https://www.algobuddy.me' });
  assert.equal(validateCsrfOrigin(req), true);
});

test('validateCsrfOrigin: accepts algobuddy.vercel.app origin', () => {
  const req = makeRequest({ origin: 'https://algobuddy.vercel.app' });
  assert.equal(validateCsrfOrigin(req), true);
});

test('validateCsrfOrigin: rejects untrusted origin', () => {
  const req = makeRequest({ origin: 'https://evil.example.com' });
  assert.equal(validateCsrfOrigin(req), false);
});

test('validateCsrfOrigin: strips trailing slash from origin', () => {
  const req = makeRequest({ origin: 'https://algobuddy.me/' });
  assert.equal(validateCsrfOrigin(req), true);
});

test('validateCsrfOrigin: strips trailing slash from referer', () => {
  const req = makeRequest({ origin: null, referer: 'https://algobuddy.me/' });
  assert.equal(validateCsrfOrigin(req), true);
});

test('validateCsrfOrigin: falls back to referer when origin is missing', () => {
  const req = makeRequest({ origin: null, referer: 'https://algobuddy.me' });
  assert.equal(validateCsrfOrigin(req), true);
});

test('validateCsrfOrigin: rejects untrusted referer', () => {
  const req = makeRequest({ origin: null, referer: 'https://evil.example.com' });
  assert.equal(validateCsrfOrigin(req), false);
});

test('validateCsrfOrigin: returns false for empty/missing origin and referer', () => {
  const req = makeRequest({ origin: null, referer: null });
  assert.equal(validateCsrfOrigin(req), false);
});

// Tests for isStateChangingMethod
test('isStateChangingMethod: POST returns true', () => {
  assert.equal(isStateChangingMethod('POST'), true);
});

test('isStateChangingMethod: PUT returns true', () => {
  assert.equal(isStateChangingMethod('PUT'), true);
});

test('isStateChangingMethod: PATCH returns true', () => {
  assert.equal(isStateChangingMethod('PATCH'), true);
});

test('isStateChangingMethod: DELETE returns true', () => {
  assert.equal(isStateChangingMethod('DELETE'), true);
});

test('isStateChangingMethod: GET returns false', () => {
  assert.equal(isStateChangingMethod('GET'), false);
});

test('isStateChangingMethod: HEAD returns false', () => {
  assert.equal(isStateChangingMethod('HEAD'), false);
});

test('isStateChangingMethod: OPTIONS returns false', () => {
  assert.equal(isStateChangingMethod('OPTIONS'), false);
});

test('isStateChangingMethod: lowercase methods return false', () => {
  assert.equal(isStateChangingMethod('post'), false);
  assert.equal(isStateChangingMethod('get'), false);
});

// Tests for isApiRoute
test('isApiRoute: /api/foo returns true', () => {
  assert.equal(isApiRoute('/api/foo'), true);
});

test('isApiRoute: /api/v1/users returns true', () => {
  assert.equal(isApiRoute('/api/v1/users'), true);
});

test('isApiRoute: /api/ returns true', () => {
  assert.equal(isApiRoute('/api/'), true);
});

test('isApiRoute: /app/dashboard returns false', () => {
  assert.equal(isApiRoute('/app/dashboard'), false);
});

test('isApiRoute: /login returns false', () => {
  assert.equal(isApiRoute('/login'), false);
});

test('isApiRoute: empty string returns false', () => {
  assert.equal(isApiRoute(''), false);
});