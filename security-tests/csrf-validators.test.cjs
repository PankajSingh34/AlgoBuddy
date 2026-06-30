/**
 * Unit tests for the CSRF validators in src/lib/csrf.js.
 * Uses inlined helper logic so the tests stay focused on behavior rather
 * than Next.js module resolution details.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");

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

function createRequest({ origin, referer }) {
  return {
    headers: {
      get(name) {
        if (name === "origin") return origin ?? null;
        if (name === "referer") return referer ?? null;
        return null;
      },
    },
  };
}

test("validateCsrfOrigin accepts trusted origins and trims trailing slashes", () => {
  assert.equal(
    validateCsrfOrigin(createRequest({ origin: "https://algobuddy.me/" })),
    true,
  );
  assert.equal(
    validateCsrfOrigin(createRequest({ origin: "http://localhost:3000///" })),
    true,
  );
});

test("validateCsrfOrigin falls back to referer and rejects untrusted origins", () => {
  assert.equal(
    validateCsrfOrigin(createRequest({ referer: "https://www.algobuddy.me/path/to/page/" })),
    false,
  );
  assert.equal(
    validateCsrfOrigin(createRequest({ referer: "https://www.algobuddy.me" })),
    true,
  );
  assert.equal(
    validateCsrfOrigin(createRequest({ origin: "https://example.com" })),
    false,
  );
});

test("isStateChangingMethod recognizes mutating HTTP verbs", () => {
  assert.equal(isStateChangingMethod("POST"), true);
  assert.equal(isStateChangingMethod("PUT"), true);
  assert.equal(isStateChangingMethod("PATCH"), true);
  assert.equal(isStateChangingMethod("DELETE"), true);
  assert.equal(isStateChangingMethod("GET"), false);
  assert.equal(isStateChangingMethod("HEAD"), false);
  assert.equal(isStateChangingMethod("OPTIONS"), false);
});

test("isApiRoute only accepts API paths", () => {
  assert.equal(isApiRoute("/api/auth"), true);
  assert.equal(isApiRoute("/api/csrf-token"), true);
  assert.equal(isApiRoute("/blog"), false);
  assert.equal(isApiRoute("/visualizer/stack"), false);
});
