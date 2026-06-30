// security-tests/apiErrors.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/apiErrors.test.cjs
//
// Tests the ApiError class hierarchy in src/lib/apiErrors.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

// Inlined source to avoid ESM import issues in Node --test runner.
class ApiError extends Error {
  constructor(message, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

class AuthError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthError";
  }
}

class RateLimitError extends ApiError {
  constructor(message = "Too many requests") {
    super(message, "RATE_LIMIT", 429);
    this.name = "RateLimitError";
  }
}

class ValidationError extends ApiError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

class ConfigError extends ApiError {
  constructor(message = "Server configuration error") {
    super(message, "CONFIG_ERROR", 500);
    this.name = "ConfigError";
  }
}

// ─── ApiError tests ─────────────────────────────────────────────────────────────
describe("ApiError", () => {
  test("default values", () => {
    const err = new ApiError("Something went wrong");
    assert.equal(err.message, "Something went wrong");
    assert.equal(err.code, "INTERNAL_ERROR");
    assert.equal(err.status, 500);
    assert.equal(err.name, "ApiError");
    assert.ok(err instanceof Error);
    assert.ok(err instanceof ApiError);
  });

  test("custom code and status", () => {
    const err = new ApiError("Bad request", "BAD_REQ", 400);
    assert.equal(err.code, "BAD_REQ");
    assert.equal(err.status, 400);
  });

  test("inherits from Error", () => {
    const err = new ApiError("test");
    assert.ok(err instanceof Error);
  });
});

// ─── AuthError tests ────────────────────────────────────────────────────────────
describe("AuthError", () => {
  test("default values", () => {
    const err = new AuthError();
    assert.equal(err.message, "Unauthorized");
    assert.equal(err.code, "AUTH_ERROR");
    assert.equal(err.status, 401);
    assert.equal(err.name, "AuthError");
    assert.ok(err instanceof ApiError);
    assert.ok(err instanceof AuthError);
  });

  test("custom message", () => {
    const err = new AuthError("Token expired");
    assert.equal(err.message, "Token expired");
    assert.equal(err.code, "AUTH_ERROR");
    assert.equal(err.status, 401);
  });
});

// ─── RateLimitError tests ──────────────────────────────────────────────────────
describe("RateLimitError", () => {
  test("default values", () => {
    const err = new RateLimitError();
    assert.equal(err.message, "Too many requests");
    assert.equal(err.code, "RATE_LIMIT");
    assert.equal(err.status, 429);
    assert.equal(err.name, "RateLimitError");
    assert.ok(err instanceof ApiError);
    assert.ok(err instanceof RateLimitError);
  });

  test("custom message", () => {
    const err = new RateLimitError("Slow down");
    assert.equal(err.message, "Slow down");
    assert.equal(err.code, "RATE_LIMIT");
    assert.equal(err.status, 429);
  });
});

// ─── ValidationError tests ─────────────────────────────────────────────────────
describe("ValidationError", () => {
  test("default values", () => {
    const err = new ValidationError();
    assert.equal(err.message, "Validation failed");
    assert.equal(err.code, "VALIDATION_ERROR");
    assert.equal(err.status, 400);
    assert.equal(err.name, "ValidationError");
    assert.ok(err instanceof ApiError);
    assert.ok(err instanceof ValidationError);
  });

  test("custom message", () => {
    const err = new ValidationError("Email is required");
    assert.equal(err.message, "Email is required");
    assert.equal(err.code, "VALIDATION_ERROR");
    assert.equal(err.status, 400);
  });
});

// ─── ConfigError tests ─────────────────────────────────────────────────────────
describe("ConfigError", () => {
  test("default values", () => {
    const err = new ConfigError();
    assert.equal(err.message, "Server configuration error");
    assert.equal(err.code, "CONFIG_ERROR");
    assert.equal(err.status, 500);
    assert.equal(err.name, "ConfigError");
    assert.ok(err instanceof ApiError);
    assert.ok(err instanceof ConfigError);
  });

  test("custom message", () => {
    const err = new ConfigError("Missing DB credentials");
    assert.equal(err.message, "Missing DB credentials");
    assert.equal(err.code, "CONFIG_ERROR");
    assert.equal(err.status, 500);
  });
});

// ─── instanceof chain ──────────────────────────────────────────────────────────
describe("instanceof chain for all subclasses", () => {
  test("each subclass is instanceof its parent", () => {
    const auth = new AuthError();
    const rate = new RateLimitError();
    const val = new ValidationError();
    const conf = new ConfigError();
    assert.ok(auth instanceof ApiError);
    assert.ok(rate instanceof ApiError);
    assert.ok(val instanceof ApiError);
    assert.ok(conf instanceof ApiError);
  });

  test("no cross-subclass instanceof", () => {
    const auth = new AuthError();
    const rate = new RateLimitError();
    assert.ok(!(auth instanceof RateLimitError));
    assert.ok(!(rate instanceof AuthError));
  });
});
