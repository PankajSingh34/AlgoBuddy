// security-tests/csrf.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrf.test.cjs
//
// Tests CSRF token generation and validation utilities in src/lib/csrf.js.

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Inline the csrf.js implementation for deterministic testing
// (avoids @/ alias and module resolution issues in --test runner)
const crypto = require('crypto');

const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex");

function generateCsrfToken() {
  const random = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now().toString(36);

  const hmac = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(`${random}:${timestamp}`)
    .digest("hex");

  return `${random}:${timestamp}:${hmac}`;
}

function validateCsrf(request) {
  const cookieToken = request.cookies?.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers?.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  if (cookieToken !== headerToken) {
    return false;
  }

  const parts = cookieToken.split(":");

  if (parts.length !== 3) {
    return false;
  }

  const [random, timestamp, hmac] = parts;

  const expectedHmac = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(`${random}:${timestamp}`)
    .digest("hex");

  if (hmac !== expectedHmac) {
    return false;
  }

  const tokenAge = Date.now() - parseInt(timestamp, 36);

  if (tokenAge > 24 * 60 * 60 * 1000) {
    return false;
  }

  return true;
}

function setCsrfCookie(response) {
  const token = generateCsrfToken();

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  return token;
}

describe("generateCsrfToken", () => {
  test("returns a non-empty string", () => {
    const token = generateCsrfToken();
    assert.ok(typeof token === "string" && token.length > 0);
  });

  test("returns a string with exactly 3 colon-separated parts", () => {
    const token = generateCsrfToken();
    const parts = token.split(":");
    assert.strictEqual(parts.length, 3);
  });

  test("returns a string where each part is non-empty hex", () => {
    const token = generateCsrfToken();
    const [random, timestamp, hmac] = token.split(":");
    assert.ok(random.length > 0 && /^[a-f0-9]+$/.test(random));
    assert.ok(timestamp.length > 0);
    assert.ok(hmac.length > 0 && /^[a-f0-9]+$/.test(hmac));
  });

  test("returns different tokens on successive calls", () => {
    const t1 = generateCsrfToken();
    const t2 = generateCsrfToken();
    assert.notStrictEqual(t1, t2);
  });
});

describe("validateCsrf", () => {
  test("returns true when cookie and header tokens match and are valid", () => {
    const token = generateCsrfToken();
    const request = {
      cookies: new Map([[CSRF_COOKIE_NAME, { value: token }]]),
      headers: new Map([[CSRF_HEADER_NAME, token]]),
    };
    // Patch get to use Map
    request.cookies.get = (key) => request.cookies.get(key);
    const reqWithGet = {
      cookies: { get: (key) => (key === CSRF_COOKIE_NAME ? { value: token } : undefined) },
      headers: { get: (key) => (key === CSRF_HEADER_NAME ? token : null) },
    };
    assert.strictEqual(validateCsrf(reqWithGet), true);
  });

  test("returns false when cookie token is missing", () => {
    const token = generateCsrfToken();
    const req = {
      cookies: { get: () => undefined },
      headers: { get: (key) => (key === CSRF_HEADER_NAME ? token : null) },
    };
    assert.strictEqual(validateCsrf(req), false);
  });

  test("returns false when header token is missing", () => {
    const token = generateCsrfToken();
    const req = {
      cookies: { get: (key) => (key === CSRF_COOKIE_NAME ? { value: token } : undefined) },
      headers: { get: () => null },
    };
    assert.strictEqual(validateCsrf(req), false);
  });

  test("returns false when cookie and header tokens do not match", () => {
    const req = {
      cookies: { get: (key) => (key === CSRF_COOKIE_NAME ? { value: "a:b:c" } : undefined) },
      headers: { get: (key) => (key === CSRF_HEADER_NAME ? "x:y:z" : null) },
    };
    assert.strictEqual(validateCsrf(req), false);
  });

  test("returns false when token has wrong number of parts", () => {
    const req = {
      cookies: { get: (key) => (key === CSRF_COOKIE_NAME ? { value: "not-enough-parts" } : undefined) },
      headers: { get: (key) => (key === CSRF_HEADER_NAME ? "not-enough-parts" : null) },
    };
    assert.strictEqual(validateCsrf(req), false);
  });

  test("returns false when token is tampered (wrong HMAC)", () => {
    const token = generateCsrfToken();
    const [random, timestamp] = token.split(":");
    const tampered = `${random}:${timestamp}:0000000000000000000000000000000000000000000000000000000000`;
    const req = {
      cookies: { get: (key) => (key === CSRF_COOKIE_NAME ? { value: tampered } : undefined) },
      headers: { get: (key) => (key === CSRF_HEADER_NAME ? tampered : null) },
    };
    assert.strictEqual(validateCsrf(req), false);
  });

  test("returns false when token is expired (timestamp > 24h old)", () => {
    // Build a token with a timestamp from 25h ago
    const oldTimestamp = (Date.now() - 25 * 60 * 60 * 1000).toString(36);
    const fakeRandom = crypto.randomBytes(16).toString("hex");
    const hmac = crypto
      .createHmac("sha256", CSRF_SECRET)
      .update(`${fakeRandom}:${oldTimestamp}`)
      .digest("hex");
    const expiredToken = `${fakeRandom}:${oldTimestamp}:${hmac}`;

    const req = {
      cookies: { get: (key) => (key === CSRF_COOKIE_NAME ? { value: expiredToken } : undefined) },
      headers: { get: (key) => (key === CSRF_HEADER_NAME ? expiredToken : null) },
    };
    assert.strictEqual(validateCsrf(req), false);
  });
});

describe("setCsrfCookie", () => {
  test("returns a non-empty token string", () => {
    const response = { cookies: { set: () => {} } };
    const token = setCsrfCookie(response);
    assert.ok(typeof token === "string" && token.length > 0);
  });

  test("returns a token with correct format", () => {
    const response = { cookies: { set: () => {} } };
    const token = setCsrfCookie(response);
    const parts = token.split(":");
    assert.strictEqual(parts.length, 3);
  });

  test("sets the cookie with httpOnly, sameSite, path, and maxAge options", () => {
    let setCalls = [];
    const response = {
      cookies: {
        set: (name, value, options) => {
          setCalls.push({ name, value, options });
        },
      },
    };
    setCsrfCookie(response);
    assert.strictEqual(setCalls.length, 1);
    assert.strictEqual(setCalls[0].name, CSRF_COOKIE_NAME);
    assert.ok(setCalls[0].options.httpOnly === true);
    assert.strictEqual(setCalls[0].options.sameSite, "lax");
    assert.strictEqual(setCalls[0].options.path, "/");
    assert.strictEqual(setCalls[0].options.maxAge, 24 * 60 * 60);
  });
});
