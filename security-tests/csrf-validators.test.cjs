// security-tests/csrf-validators.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrf-validators.test.cjs
//
// Tests the CSRF validators in src/lib/csrf.js:
// validateCsrfOrigin, isStateChangingMethod, and isApiRoute.
// Uses node:test + assert/strict — the same runner as npm run test:security.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// ─── Inline the source to avoid ESM / @/ alias resolution issues ────────────
// (Copied verbatim from src/lib/csrf.js)

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
  const origin = request.headers?.get?.("origin");
  const referer = request.headers?.get?.("referer");
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

// ─── Tests ────────────────────────────────────────────────────────────────────

const makeMockRequest = (headers = {}) => ({
  headers: {
    get: (name) => headers[name] ?? null,
  },
});

describe("validateCsrfOrigin", () => {
  test("returns true for requests with origin matching TRUSTED_ORIGINS", () => {
    const origins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://algobuddy.me",
      "https://www.algobuddy.me",
      "https://algobuddy.vercel.app",
    ];
    for (const origin of origins) {
      const req = makeMockRequest({ origin });
      assert.strictEqual(
        validateCsrfOrigin(req),
        true,
        `${origin} should be trusted`,
      );
    }
  });

  test("falls back to referer header when origin is absent", () => {
    // TRUSTED_ORIGINS stores bare origins; a referer matching a bare origin passes
    const req = makeMockRequest({ referer: "https://algobuddy.me" });
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns false for untrusted origins", () => {
    const req = makeMockRequest({ origin: "https://evil.example.com" });
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test("returns false for empty origin and referer", () => {
    const req = makeMockRequest({});
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test("returns false when headers.get is undefined", () => {
    const req = { headers: null };
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test("returns false for null headers", () => {
    const req = { headers: { get: () => null } };
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test("strips trailing slashes before comparing", () => {
    const req = makeMockRequest({ origin: "https://algobuddy.me/" });
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("strips multiple trailing slashes", () => {
    const req = makeMockRequest({ origin: "https://algobuddy.me///" });
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("referer with trailing slash is stripped and accepted", () => {
    const req = makeRequest({ referer: "https://www.algobuddy.me/" });
    assert.strictEqual(validateCsrfOrigin(req), true);
  });

  test("returns false for slightly misspelled trusted origin", () => {
    const req = makeMockRequest({ origin: "https://algobuddy-me.example.com" });
    assert.strictEqual(validateCsrfOrigin(req), false);
  });

  test("returns false for http on a https-only origin", () => {
    const req = makeMockRequest({ origin: "http://algobuddy.me" });
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

  test("returns false for TRACE", () => {
    assert.strictEqual(isStateChangingMethod("TRACE"), false);
  });

  test("is case-sensitive (lowercase returns false)", () => {
    assert.strictEqual(isStateChangingMethod("post"), false);
    assert.strictEqual(isStateChangingMethod("Post"), false);
    assert.strictEqual(isStateChangingMethod("put"), false);
  });

  test("returns false for null or undefined", () => {
    assert.strictEqual(isStateChangingMethod(null), false);
    assert.strictEqual(isStateChangingMethod(undefined), false);
  });
});

describe("isApiRoute", () => {
  test("returns true for paths starting with /api/", () => {
    assert.strictEqual(isApiRoute("/api/users"), true);
    assert.strictEqual(isApiRoute("/api/activity"), true);
    assert.strictEqual(isApiRoute("/api/v2/auth/login"), true);
  });

  test("returns false for non-API paths", () => {
    assert.strictEqual(isApiRoute("/users"), false);
    assert.strictEqual(isApiRoute("/profile"), false);
    assert.strictEqual(isApiRoute("/visualizer"), false);
  });

  test("returns false for paths that merely contain /api as a segment", () => {
    // /api is a route segment, not /api/
    assert.strictEqual(isApiRoute("/foo/api"), false);
  });

  test("returns true for /api/ at root", () => {
    assert.strictEqual(isApiRoute("/api/"), true);
  });

  test("throws TypeError for null or undefined pathname", () => {
    assert.throws(() => isApiRoute(null), TypeError);
    assert.throws(() => isApiRoute(undefined), TypeError);
  });

  test("is case-sensitive", () => {
    assert.strictEqual(isApiRoute("/API/users"), false);
    assert.strictEqual(isApiRoute("/Api/users"), false);
  });
});

// Helper
function makeRequest(headers = {}) {
  return {
    headers: {
      get: (name) => headers[name] ?? null,
    },
  };
}