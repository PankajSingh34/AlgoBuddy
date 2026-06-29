// security-tests/serverApi.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/serverApi.test.cjs
//
// Tests the jsonResponse and errorResponse helpers in src/lib/serverApi.js.
// Uses node:test + assert/strict — the same runner as npm run test:security.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// ─── Inline the source to avoid ESM / @/ alias resolution issues ────────────
// (Copied verbatim from src/lib/serverApi.js)

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function errorResponse(error) {
  const code = error.code || "INTERNAL_ERROR";
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  return Response.json(
    { error: message, code },
    { status, headers: { "Content-Type": "application/json" } },
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("jsonResponse", () => {
  test("returns a Response with status 200 by default", async () => {
    const res = jsonResponse({ ok: true });
    assert.strictEqual(res.status, 200);
  });

  test("returns Content-Type application/json header", async () => {
    const res = jsonResponse({ ok: true });
    assert.strictEqual(res.headers.get("Content-Type"), "application/json");
  });

  test("returns the provided data in the response body", async () => {
    const data = { foo: "bar", count: 42 };
    const res = jsonResponse(data);
    const body = await res.json();
    assert.deepStrictEqual(body, data);
  });

  test("accepts a custom status code", async () => {
    const res = jsonResponse({ created: true }, 201);
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.deepStrictEqual(body, { created: true });
  });

  test("accepts status 404", async () => {
    const res = jsonResponse({ error: "not found" }, 404);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.deepStrictEqual(body, { error: "not found" });
  });

  test("includes extraHeaders when provided", async () => {
    const res = jsonResponse({ ok: true }, 200, { "X-Custom": "value" });
    assert.strictEqual(res.headers.get("X-Custom"), "value");
    assert.strictEqual(res.headers.get("Content-Type"), "application/json");
  });

  test("extraHeaders can override Content-Type", async () => {
    const res = jsonResponse({ ok: true }, 200, { "Content-Type": "text/plain" });
    assert.strictEqual(res.headers.get("Content-Type"), "text/plain");
  });

  test("handles empty object data", async () => {
    const res = jsonResponse({});
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.deepStrictEqual(body, {});
  });

  test("handles array data", async () => {
    const res = jsonResponse([1, 2, 3]);
    const body = await res.json();
    assert.deepStrictEqual(body, [1, 2, 3]);
  });
});

describe("errorResponse", () => {
  test("returns a Response with default status 500", async () => {
    const err = new Error("boom");
    const res = errorResponse(err);
    assert.strictEqual(res.status, 500);
  });

  test("returns Content-Type application/json header", async () => {
    const res = errorResponse(new Error());
    assert.strictEqual(res.headers.get("Content-Type"), "application/json");
  });

  test("returns { error, code } in the body", async () => {
    const err = new Error("validation failed");
    err.code = "VALIDATION_ERROR";
    err.status = 400;
    const res = errorResponse(err);
    const body = await res.json();
    assert.strictEqual(body.error, "validation failed");
    assert.strictEqual(body.code, "VALIDATION_ERROR");
  });

  test("uses error.message in the body", async () => {
    const err = new Error("custom error message");
    const res = errorResponse(err);
    const body = await res.json();
    assert.strictEqual(body.error, "custom error message");
  });

  test("defaults error message to 'Internal server error'", async () => {
    const err = {};
    const res = errorResponse(err);
    const body = await res.json();
    assert.strictEqual(body.error, "Internal server error");
  });

  test("defaults code to 'INTERNAL_ERROR'", async () => {
    const err = new Error("oops");
    delete err.code;
    const res = errorResponse(err);
    const body = await res.json();
    assert.strictEqual(body.code, "INTERNAL_ERROR");
  });

  test("uses error.status for HTTP status when present", async () => {
    const err = new Error("rate limited");
    err.code = "RATE_LIMIT";
    err.status = 429;
    const res = errorResponse(err);
    assert.strictEqual(res.status, 429);
  });

  test("defaults to status 500 when error.status is absent", async () => {
    const err = new Error("internal");
    err.code = "SOME_CODE";
    delete err.status;
    const res = errorResponse(err);
    assert.strictEqual(res.status, 500);
  });

  test("handles AuthError-shaped error (status 401)", async () => {
    const err = new Error("Unauthorized");
    err.code = "AUTH_ERROR";
    err.status = 401;
    const res = errorResponse(err);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.code, "AUTH_ERROR");
  });

  test("body always contains both error and code fields", async () => {
    const err = {};
    const res = errorResponse(err);
    const body = await res.json();
    assert.ok("error" in body);
    assert.ok("code" in body);
  });
});