// security-tests/csrf-origin-validation.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrf-origin-validation.test.cjs
//
// Tests the CSRF helper functions in src/lib/csrf.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const csrfUrl = pathToFileURL(
  path.join(__dirname, "..", "src/lib/csrf.js"),
).href;

let validateCsrfOrigin, isStateChangingMethod, isApiRoute;

test("imports csrf helpers without throwing", async () => {
  const mod = await import(csrfUrl);
  validateCsrfOrigin = mod.validateCsrfOrigin;
  isStateChangingMethod = mod.isStateChangingMethod;
  isApiRoute = mod.isApiRoute;
});

function mockRequest(headersInit) {
  return { headers: new Headers(headersInit) };
}

describe("validateCsrfOrigin", () => {
  test("accepts localhost:3000", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ origin: "http://localhost:3000" })),
      true,
    );
  });

  test("accepts 127.0.0.1:3000", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ origin: "http://127.0.0.1:3000" })),
      true,
    );
  });

  test("accepts algobuddy.me", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ origin: "https://algobuddy.me" })),
      true,
    );
  });

  test("accepts www.algobuddy.me", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ origin: "https://www.algobuddy.me" })),
      true,
    );
  });

  test("accepts algobuddy.vercel.app", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ origin: "https://algobuddy.vercel.app" })),
      true,
    );
  });

  test("strips trailing slash from origin", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ origin: "https://algobuddy.me/" })),
      true,
    );
  });

  test("accepts via referer header when origin is absent", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ referer: "https://algobuddy.me/" })),
      true,
    );
  });

  test("rejects untrusted origin", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ origin: "https://evil.com" })),
      false,
    );
  });

  test("rejects untrusted referer", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({ referer: "https://evil.com/page" })),
      false,
    );
  });

  test("rejects when both origin and referer are absent", () => {
    assert.strictEqual(
      validateCsrfOrigin(mockRequest({})),
      false,
    );
  });
});

describe("isStateChangingMethod", () => {
  test("returns true for POST", () => assert.strictEqual(isStateChangingMethod("POST"), true));
  test("returns true for PUT", () => assert.strictEqual(isStateChangingMethod("PUT"), true));
  test("returns true for PATCH", () => assert.strictEqual(isStateChangingMethod("PATCH"), true));
  test("returns true for DELETE", () => assert.strictEqual(isStateChangingMethod("DELETE"), true));
  test("returns false for GET", () => assert.strictEqual(isStateChangingMethod("GET"), false));
  test("returns false for HEAD", () => assert.strictEqual(isStateChangingMethod("HEAD"), false));
  test("returns false for OPTIONS", () => assert.strictEqual(isStateChangingMethod("OPTIONS"), false));
  test("returns false for lowercase post", () => assert.strictEqual(isStateChangingMethod("post"), false));
});

describe("isApiRoute", () => {
  test("returns true for /api/foo", () => assert.strictEqual(isApiRoute("/api/foo"), true));
  test("returns true for /api/v1/users", () => assert.strictEqual(isApiRoute("/api/v1/users"), true));
  test("returns true for /api/", () => assert.strictEqual(isApiRoute("/api/"), true));
  test("returns false for /foo/bar", () => assert.strictEqual(isApiRoute("/foo/bar"), false));
  test("returns false for /about", () => assert.strictEqual(isApiRoute("/about"), false));
  test("returns false for /api (no trailing slash)", () => assert.strictEqual(isApiRoute("/api"), false));
});
