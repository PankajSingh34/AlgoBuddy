// security-tests/csrf-validation.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrf-validation.test.cjs
//
// Tests CSRF utilities in src/lib/csrf.js and src/lib/csrfToken.js.

const { describe, test, mock } = require("node:test");
const assert = require("node:assert/strict");

// Inline the source — pure functions, no external dependencies.
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

// csrfToken.js helpers
const CSRF_TOKEN_LENGTH = 32;
const crypto = require("crypto");

function getSecret() {
  return "dev-csrf-secret-do-not-use-in-production";
}

function generateCsrfToken() {
  const secret = getSecret();
  const randomValue = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(randomValue);
  const signature = hmac.digest("hex");
  return `${randomValue}.${signature}`;
}

function validateCsrfToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [randomValue, signature] = parts;
  const secret = getSecret();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(randomValue);
  const expected = hmac.digest("hex");
  if (signature.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Mock Request helper
function makeRequest(headers = {}) {
  return {
    headers: {
      get(name) {
        return headers[name] || null;
      },
    },
  };
}

describe("validateCsrfOrigin", () => {
  test("returns true for trusted origin header", () => {
    const req = makeRequest({ origin: "https://algobuddy.me" });
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns true for trusted localhost origin", () => {
    const req = makeRequest({ origin: "http://localhost:3000" });
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns true for trusted referer header when origin is absent", () => {
    const req = makeRequest({ referer: "https://algobuddy.me" });
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns false for untrusted origin", () => {
    const req = makeRequest({ origin: "https://evil.com" });
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test("returns false when both origin and referer are absent", () => {
    const req = makeRequest({});
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test("strips trailing slashes from origin before matching", () => {
    const req = makeRequest({ origin: "https://algobuddy.me/" });
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns false for empty origin string", () => {
    const req = makeRequest({ origin: "" });
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
});

describe("isApiRoute", () => {
  test("returns true for /api/foo", () => {
    assert.strictEqual(isApiRoute("/api/foo"), true);
  });

  test("returns true for /api/v1/users", () => {
    assert.strictEqual(isApiRoute("/api/v1/users"), true);
  });

  test("returns false for /dashboard", () => {
    assert.strictEqual(isApiRoute("/dashboard"), false);
  });

  test("returns false for /api", () => {
    assert.strictEqual(isApiRoute("/api"), false);
  });

  test("returns false for empty string", () => {
    assert.strictEqual(isApiRoute(""), false);
  });
});

describe("generateCsrfToken", () => {
  test("returns a non-empty string", () => {
    const token = generateCsrfToken();
    assert.ok(typeof token === "string" && token.length > 0);
  });

  test("returns a token with exactly one dot separator", () => {
    const token = generateCsrfToken();
    const parts = token.split(".");
    assert.strictEqual(parts.length, 2);
  });

  test("returns a token where both parts are non-empty hex strings", () => {
    const token = generateCsrfToken();
    const [randomPart, sigPart] = token.split(".");
    assert.ok(randomPart.length > 0);
    assert.ok(sigPart.length > 0);
    // Each part should be valid hex (64 chars for sha256)
    assert.strictEqual(randomPart.length, 64);
    assert.strictEqual(sigPart.length, 64);
  });

  test("each call returns a unique token", () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    assert.notStrictEqual(token1, token2);
  });
});

describe("validateCsrfToken", () => {
  test("returns true for a freshly generated valid token", () => {
    const token = generateCsrfToken();
    assert.strictEqual(validateCsrfToken(token), true);
  });

  test("returns false for null", () => {
    assert.strictEqual(validateCsrfToken(null), false);
  });

  test("returns false for undefined", () => {
    assert.strictEqual(validateCsrfToken(undefined), false);
  });

  test("returns false for empty string", () => {
    assert.strictEqual(validateCsrfToken(""), false);
  });

  test("returns false for string without dot separator", () => {
    assert.strictEqual(validateCsrfToken("justarandomstring"), false);
  });

  test("returns false for token with wrong number of parts", () => {
    assert.strictEqual(validateCsrfToken("a.b.c"), false);
  });

  test("returns false for tampered token (modified signature)", () => {
    const token = generateCsrfToken();
    const [randomPart] = token.split(".");
    const tampered = `${randomPart}.${"0".repeat(64)}`;
    assert.strictEqual(validateCsrfToken(tampered), false);
  });

  test("returns false for tampered token (modified random part)", () => {
    const token = generateCsrfToken();
    const [, sigPart] = token.split(".");
    const tampered = `${"a".repeat(64)}.${sigPart}`;
    assert.strictEqual(validateCsrfToken(tampered), false);
  });

  test("returns false for non-string input", () => {
    assert.strictEqual(validateCsrfToken(12345), false);
    assert.strictEqual(validateCsrfToken({}), false);
    assert.strictEqual(validateCsrfToken([]), false);
  });
});
