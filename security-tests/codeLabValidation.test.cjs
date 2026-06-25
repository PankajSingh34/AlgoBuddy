const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

// -------------------------------------------------------------------
// Inline route validation logic from src/app/api/code-lab/route.js
// -------------------------------------------------------------------

function validateCodeInput(body) {
  if (typeof body !== "object" || body === null) {
    return { valid: false, status: 400, error: "Invalid JSON in request body" };
  }

  const { code } = body;

  if (typeof code !== "string") {
    return { valid: false, status: 400, error: "`code` must be a string" };
  }

  if (code.trim().length === 0) {
    return { valid: false, status: 400, error: "No code provided" };
  }

  if (code.length > 50_000) {
    return {
      valid: false,
      status: 400,
      error: "Code exceeds maximum allowed length (50 000 characters)",
    };
  }

  return { valid: true };
}

function getMethodNotAllowed() {
  return { status: 405, error: "Method Not Allowed" };
}

// -------------------------------------------------------------------
// Tests
// -------------------------------------------------------------------

describe("validateCodeInput", () => {
  it("returns valid for a non-empty code string", () => {
    const result = validateCodeInput({ code: "print('hello')" });
    assert.strictEqual(result.valid, true);
  });

  it("returns invalid when body is null", () => {
    const result = validateCodeInput(null);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.status, 400);
    assert.ok(result.error.includes("Invalid JSON"));
  });

  it("returns invalid when body is a primitive (string)", () => {
    const result = validateCodeInput("print('hello')");
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.status, 400);
  });

  it("returns invalid when code is undefined", () => {
    const result = validateCodeInput({ code: undefined });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "`code` must be a string");
  });

  it("returns invalid when code is null", () => {
    const result = validateCodeInput({ code: null });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "`code` must be a string");
  });

  it("returns invalid when code is a number", () => {
    const result = validateCodeInput({ code: 42 });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "`code` must be a string");
  });

  it("returns invalid when code is an array", () => {
    const result = validateCodeInput({ code: ["print", "hello"] });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "`code` must be a string");
  });

  it("returns invalid when code is an object", () => {
    const result = validateCodeInput({ code: { source: "print('x')" } });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "`code` must be a string");
  });

  it("returns invalid when code is an empty string", () => {
    const result = validateCodeInput({ code: "" });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "No code provided");
  });

  it("returns invalid when code is only whitespace", () => {
    const result = validateCodeInput({ code: "   \n\t  " });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "No code provided");
  });

  it("returns invalid when code is only newlines", () => {
    const result = validateCodeInput({ code: "\n\n\n" });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "No code provided");
  });

  it("returns invalid when code exceeds 50,000 characters", () => {
    const result = validateCodeInput({ code: "x".repeat(50001) });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "Code exceeds maximum allowed length (50 000 characters)");
  });

  it("accepts code at exactly the 50,000 character boundary", () => {
    const result = validateCodeInput({ code: "x".repeat(50000) });
    assert.strictEqual(result.valid, true);
  });

  it("accepts code that is whitespace-padded but non-empty", () => {
    const result = validateCodeInput({ code: "  print('hello')  " });
    assert.strictEqual(result.valid, true);
  });

  it("accepts code with newline characters", () => {
    const result = validateCodeInput({ code: "def foo():\n    pass" });
    assert.strictEqual(result.valid, true);
  });

  it("returns invalid when code key is missing entirely", () => {
    const result = validateCodeInput({});
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, "`code` must be a string");
  });
});

describe("getMethodNotAllowed", () => {
  it("returns 405 status for unsupported methods", () => {
    const result = getMethodNotAllowed();
    assert.strictEqual(result.status, 405);
    assert.strictEqual(result.error, "Method Not Allowed");
  });
});
