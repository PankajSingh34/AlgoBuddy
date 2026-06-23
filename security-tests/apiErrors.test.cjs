// security-tests/apiErrors.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/apiErrors.test.cjs
//
// Tests src/lib/apiErrors.js — ApiError, AuthError, RateLimitError, ValidationError, ConfigError.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const {
  ApiError,
  AuthError,
  RateLimitError,
  ValidationError,
  ConfigError,
} = require("../src/lib/apiErrors");

// ── ApiError ──────────────────────────────────────────────────────────────────

test("ApiError sets all properties correctly", () => {
  const err = new ApiError("something went wrong", "CUSTOM_CODE", 503);
  assert.strictEqual(err.message, "something went wrong");
  assert.strictEqual(err.code, "CUSTOM_CODE");
  assert.strictEqual(err.status, 503);
  assert.strictEqual(err.name, "ApiError");
  assert.ok(err instanceof Error);
  assert.ok(err instanceof ApiError);
});

test("ApiError uses defaults when no arguments given", () => {
  const err = new ApiError();
  assert.strictEqual(err.message, "");
  assert.strictEqual(err.code, "INTERNAL_ERROR");
  assert.strictEqual(err.status, 500);
});

test("ApiError allows partial override", () => {
  const err = new ApiError("partial", "PARTIAL_CODE");
  assert.strictEqual(err.message, "partial");
  assert.strictEqual(err.code, "PARTIAL_CODE");
  assert.strictEqual(err.status, 500); // default
});

// ── AuthError ─────────────────────────────────────────────────────────────────

test("AuthError sets 401 and AUTH_ERROR by default", () => {
  const err = new AuthError();
  assert.strictEqual(err.status, 401);
  assert.strictEqual(err.code, "AUTH_ERROR");
  assert.strictEqual(err.message, "Unauthorized");
  assert.strictEqual(err.name, "AuthError");
  assert.ok(err instanceof ApiError);
  assert.ok(err instanceof Error);
});

test("AuthError allows custom message override", () => {
  const err = new AuthError("session expired");
  assert.strictEqual(err.message, "session expired");
  assert.strictEqual(err.status, 401);
  assert.strictEqual(err.code, "AUTH_ERROR");
});

// ── RateLimitError ─────────────────────────────────────────────────────────────

test("RateLimitError sets 429 and RATE_LIMIT by default", () => {
  const err = new RateLimitError();
  assert.strictEqual(err.status, 429);
  assert.strictEqual(err.code, "RATE_LIMIT");
  assert.strictEqual(err.message, "Too many requests");
  assert.strictEqual(err.name, "RateLimitError");
  assert.ok(err instanceof ApiError);
});

test("RateLimitError allows custom message override", () => {
  const err = new RateLimitError("slow down, cowboy");
  assert.strictEqual(err.message, "slow down, cowboy");
  assert.strictEqual(err.status, 429);
  assert.strictEqual(err.code, "RATE_LIMIT");
});

// ── ValidationError ───────────────────────────────────────────────────────────

test("ValidationError sets 400 and VALIDATION_ERROR by default", () => {
  const err = new ValidationError();
  assert.strictEqual(err.status, 400);
  assert.strictEqual(err.code, "VALIDATION_ERROR");
  assert.strictEqual(err.message, "Validation failed");
  assert.strictEqual(err.name, "ValidationError");
  assert.ok(err instanceof ApiError);
});

test("ValidationError allows custom message override", () => {
  const err = new ValidationError("email is required");
  assert.strictEqual(err.message, "email is required");
  assert.strictEqual(err.status, 400);
  assert.strictEqual(err.code, "VALIDATION_ERROR");
});

// ── ConfigError ───────────────────────────────────────────────────────────────

test("ConfigError sets 500 and CONFIG_ERROR by default", () => {
  const err = new ConfigError();
  assert.strictEqual(err.status, 500);
  assert.strictEqual(err.code, "CONFIG_ERROR");
  assert.strictEqual(err.message, "Server configuration error");
  assert.strictEqual(err.name, "ConfigError");
  assert.ok(err instanceof ApiError);
});

test("ConfigError allows custom message override", () => {
  const err = new ConfigError("database URL missing");
  assert.strictEqual(err.message, "database URL missing");
  assert.strictEqual(err.status, 500);
  assert.strictEqual(err.code, "CONFIG_ERROR");
});

// ── instanceof chains ──────────────────────────────────────────────────────────

test("all subclasses are instanceof ApiError and Error", () => {
  const errors = [
    new ApiError(),
    new AuthError(),
    new RateLimitError(),
    new ValidationError(),
    new ConfigError(),
  ];
  errors.forEach((err, i) => {
    assert.ok(err instanceof ApiError, `index ${i} should be ApiError`);
    assert.ok(err instanceof Error, `index ${i} should be Error`);
  });
});
