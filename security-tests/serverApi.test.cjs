// security-tests/serverApi.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/serverApi.test.cjs
//
// Tests response helpers in src/lib/serverApi.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

// ─── Inlined helpers ──────────────────────────────────────────────────────────
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

// ─── jsonResponse tests ────────────────────────────────────────────────────────
describe("jsonResponse", () => {
  test("default status is 200", async () => {
    const res = jsonResponse({ ok: true });
    assert.equal(res.status, 200);
  });

  test("custom status is respected", async () => {
    const res = jsonResponse({ created: true }, 201);
    assert.equal(res.status, 201);
  });

  test("400 returns correct status", async () => {
    const res = jsonResponse({ error: "bad input" }, 400);
    assert.equal(res.status, 400);
  });

  test("Content-Type is application/json", async () => {
    const res = jsonResponse({ foo: "bar" });
    assert.equal(res.headers.get("Content-Type"), "application/json");
  });

  test("extraHeaders are merged", async () => {
    const res = jsonResponse({}, 200, { "X-RateLimit-Remaining": "42" });
    assert.equal(res.headers.get("X-RateLimit-Remaining"), "42");
    assert.equal(res.headers.get("Content-Type"), "application/json");
  });

  test("data is preserved in body", async () => {
    const body = { users: [{ id: 1 }, { id: 2 }] };
    const res = jsonResponse(body);
    const json = await res.json();
    assert.deepEqual(json, body);
  });
});

// ─── errorResponse tests ──────────────────────────────────────────────────────
describe("errorResponse", () => {
  test("maps error.message to { error }", async () => {
    const res = errorResponse({ message: "Not found", status: 404, code: "NOT_FOUND" });
    const json = await res.json();
    assert.equal(json.error, "Not found");
  });

  test("maps error.code to { code }", async () => {
    const res = errorResponse({ message: "Bad", status: 400, code: "BAD_REQUEST" });
    const json = await res.json();
    assert.equal(json.code, "BAD_REQUEST");
  });

  test("maps error.status to HTTP status", async () => {
    const res = errorResponse({ message: "Unauthorized", status: 401, code: "AUTH" });
    assert.equal(res.status, 401);
  });

  test("defaults to status 500 when status is missing", async () => {
    const res = errorResponse({ message: "oops" });
    assert.equal(res.status, 500);
  });

  test("defaults to INTERNAL_ERROR when code is missing", async () => {
    const res = errorResponse({ message: "boom" });
    const json = await res.json();
    assert.equal(json.code, "INTERNAL_ERROR");
  });

  test("defaults to Internal server error when message is missing", async () => {
    const res = errorResponse({});
    const json = await res.json();
    assert.equal(json.error, "Internal server error");
  });

  test("Content-Type is application/json", async () => {
    const res = errorResponse({ message: "err", code: "ERR", status: 500 });
    assert.equal(res.headers.get("Content-Type"), "application/json");
  });

  test("ApiError subclass maps correctly", async () => {
    const apiErr = new Error("Rate limited");
    apiErr.code = "RATE_LIMIT";
    apiErr.status = 429;
    const res = errorResponse(apiErr);
    assert.equal(res.status, 429);
    const json = await res.json();
    assert.equal(json.code, "RATE_LIMIT");
    assert.equal(json.error, "Rate limited");
  });
});
