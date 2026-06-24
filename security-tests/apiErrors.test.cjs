// security-tests/apiErrors.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/apiErrors.test.cjs
//
// Tests the ApiError class hierarchy in src/lib/apiErrors.js.
// No network, no Supabase, no Next.js needed — pure unit tests.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const apiErrorsUrl = pathToFileURL(
  path.join(__dirname, "..", "src/lib/apiErrors.js"),
).href;

let ApiError, AuthError, RateLimitError, ValidationError, ConfigError;

test("imports all error classes without throwing", async () => {
  const mod = await import(apiErrorsUrl);
  ApiError = mod.ApiError;
  AuthError = mod.AuthError;
  RateLimitError = mod.RateLimitError;
  ValidationError = mod.ValidationError;
  ConfigError = mod.ConfigError;
});

describe("ApiError", () => {
  test("defaults to status 500 and code INTERNAL_ERROR", () => {
    const err = new ApiError("Something went wrong");
    assert.strictEqual(err.message, "Something went wrong");
    assert.strictEqual(err.code, "INTERNAL_ERROR");
    assert.strictEqual(err.status, 500);
    assert.strictEqual(err.name, "ApiError");
  });

  test("accepts custom code and status", () => {
    const err = new ApiError("Custom", "CUSTOM_CODE", 418);
    assert.strictEqual(err.code, "CUSTOM_CODE");
    assert.strictEqual(err.status, 418);
  });

  test("is an instance of Error", () => {
    const err = new ApiError("test");
    assert.ok(err instanceof Error);
  });
});

describe("AuthError", () => {
  test("defaults to 401 and AUTH_ERROR", () => {
    const err = new AuthError();
    assert.strictEqual(err.message, "Unauthorized");
    assert.strictEqual(err.code, "AUTH_ERROR");
    assert.strictEqual(err.status, 401);
    assert.strictEqual(err.name, "AuthError");
  });

  test("accepts custom message", () => {
    const err = new AuthError("Token expired");
    assert.strictEqual(err.message, "Token expired");
  });

  test("inherits from ApiError", () => {
    const err = new AuthError();
    assert.ok(err instanceof ApiError);
    assert.ok(err instanceof Error);
  });
});

describe("RateLimitError", () => {
  test("defaults to 429 and RATE_LIMIT", () => {
    const err = new RateLimitError();
    assert.strictEqual(err.message, "Too many requests");
    assert.strictEqual(err.code, "RATE_LIMIT");
    assert.strictEqual(err.status, 429);
    assert.strictEqual(err.name, "RateLimitError");
  });

  test("accepts custom message", () => {
    const err = new RateLimitError("Slow down");
    assert.strictEqual(err.message, "Slow down");
  });

  test("inherits from ApiError", () => {
    assert.ok(new RateLimitError() instanceof ApiError);
  });
});

describe("ValidationError", () => {
  test("defaults to 400 and VALIDATION_ERROR", () => {
    const err = new ValidationError();
    assert.strictEqual(err.message, "Validation failed");
    assert.strictEqual(err.code, "VALIDATION_ERROR");
    assert.strictEqual(err.status, 400);
    assert.strictEqual(err.name, "ValidationError");
  });

  test("accepts custom message", () => {
    const err = new ValidationError("Bad input");
    assert.strictEqual(err.message, "Bad input");
  });

  test("inherits from ApiError", () => {
    assert.ok(new ValidationError() instanceof ApiError);
  });
});

describe("ConfigError", () => {
  test("defaults to 500 and CONFIG_ERROR", () => {
    const err = new ConfigError();
    assert.strictEqual(err.message, "Server configuration error");
    assert.strictEqual(err.code, "CONFIG_ERROR");
    assert.strictEqual(err.status, 500);
    assert.strictEqual(err.name, "ConfigError");
  });

  test("accepts custom message", () => {
    const err = new ConfigError("Missing env var");
    assert.strictEqual(err.message, "Missing env var");
  });

  test("inherits from ApiError", () => {
    assert.ok(new ConfigError() instanceof ApiError);
  });
});
