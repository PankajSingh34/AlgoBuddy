const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const configPath = path.resolve(__dirname, "..", "src", "lib", "sandbox", "sandbox.config.js");
const SANDBOX_CONFIG = require(configPath);

test("SANDBOX_CONFIG is an object", () => {
  assert.ok(SANDBOX_CONFIG, "SANDBOX_CONFIG must be defined");
  assert.equal(typeof SANDBOX_CONFIG, "object", "SANDBOX_CONFIG must be an object");
  assert.ok(!Array.isArray(SANDBOX_CONFIG), "SANDBOX_CONFIG must not be an array");
});

test("MAX_TIMEOUT_MS is a positive number", () => {
  assert.ok(
    Object.prototype.hasOwnProperty.call(SANDBOX_CONFIG, "MAX_TIMEOUT_MS"),
    "MAX_TIMEOUT_MS must be defined"
  );
  const val = SANDBOX_CONFIG.MAX_TIMEOUT_MS;
  assert.equal(typeof val, "number", "MAX_TIMEOUT_MS must be a number");
  assert.ok(val > 0, "MAX_TIMEOUT_MS must be positive");
});

test("MAX_MEMORY_MB is a positive number", () => {
  assert.ok(
    Object.prototype.hasOwnProperty.call(SANDBOX_CONFIG, "MAX_MEMORY_MB"),
    "MAX_MEMORY_MB must be defined"
  );
  const val = SANDBOX_CONFIG.MAX_MEMORY_MB;
  assert.equal(typeof val, "number", "MAX_MEMORY_MB must be a number");
  assert.ok(val > 0, "MAX_MEMORY_MB must be positive");
});

test("MAX_OUTPUT_LENGTH is a positive integer", () => {
  assert.ok(
    Object.prototype.hasOwnProperty.call(SANDBOX_CONFIG, "MAX_OUTPUT_LENGTH"),
    "MAX_OUTPUT_LENGTH must be defined"
  );
  const val = SANDBOX_CONFIG.MAX_OUTPUT_LENGTH;
  assert.equal(typeof val, "number", "MAX_OUTPUT_LENGTH must be a number");
  assert.ok(Number.isInteger(val), "MAX_OUTPUT_LENGTH must be an integer");
  assert.ok(val > 0, "MAX_OUTPUT_LENGTH must be positive");
});

test("RATE_LIMIT_MAX_REQUESTS is a positive integer", () => {
  assert.ok(
    Object.prototype.hasOwnProperty.call(SANDBOX_CONFIG, "RATE_LIMIT_MAX_REQUESTS"),
    "RATE_LIMIT_MAX_REQUESTS must be defined"
  );
  const val = SANDBOX_CONFIG.RATE_LIMIT_MAX_REQUESTS;
  assert.equal(typeof val, "number", "RATE_LIMIT_MAX_REQUESTS must be a number");
  assert.ok(Number.isInteger(val), "RATE_LIMIT_MAX_REQUESTS must be an integer");
  assert.ok(val > 0, "RATE_LIMIT_MAX_REQUESTS must be positive");
});

test("RATE_LIMIT_WINDOW_SEC is a positive integer", () => {
  assert.ok(
    Object.prototype.hasOwnProperty.call(SANDBOX_CONFIG, "RATE_LIMIT_WINDOW_SEC"),
    "RATE_LIMIT_WINDOW_SEC must be defined"
  );
  const val = SANDBOX_CONFIG.RATE_LIMIT_WINDOW_SEC;
  assert.equal(typeof val, "number", "RATE_LIMIT_WINDOW_SEC must be a number");
  assert.ok(Number.isInteger(val), "RATE_LIMIT_WINDOW_SEC must be an integer");
  assert.ok(val > 0, "RATE_LIMIT_WINDOW_SEC must be positive");
});

test("MAX_TIMEOUT_MS has expected default value of 1000", () => {
  assert.equal(SANDBOX_CONFIG.MAX_TIMEOUT_MS, 1000, "MAX_TIMEOUT_MS should default to 1000ms");
});

test("MAX_MEMORY_MB has expected default value of 32", () => {
  assert.equal(SANDBOX_CONFIG.MAX_MEMORY_MB, 32, "MAX_MEMORY_MB should default to 32MB");
});

test("MAX_OUTPUT_LENGTH has expected default value of 8000", () => {
  assert.equal(SANDBOX_CONFIG.MAX_OUTPUT_LENGTH, 8000, "MAX_OUTPUT_LENGTH should default to 8000 chars");
});

test("RATE_LIMIT_MAX_REQUESTS has expected default value of 10", () => {
  assert.equal(SANDBOX_CONFIG.RATE_LIMIT_MAX_REQUESTS, 10, "RATE_LIMIT_MAX_REQUESTS should default to 10");
});

test("RATE_LIMIT_WINDOW_SEC has expected default value of 60", () => {
  assert.equal(SANDBOX_CONFIG.RATE_LIMIT_WINDOW_SEC, 60, "RATE_LIMIT_WINDOW_SEC should default to 60s");
});

test("All SANDBOX_CONFIG values are numbers", () => {
  for (const [key, val] of Object.entries(SANDBOX_CONFIG)) {
    assert.equal(typeof val, "number", `"${key}" must be a number`);
  }
});

test("No unexpected keys in SANDBOX_CONFIG", () => {
  const expectedKeys = [
    "MAX_TIMEOUT_MS",
    "MAX_MEMORY_MB",
    "MAX_OUTPUT_LENGTH",
    "RATE_LIMIT_MAX_REQUESTS",
    "RATE_LIMIT_WINDOW_SEC",
  ];
  const actualKeys = Object.keys(SANDBOX_CONFIG).sort();
  const expectedSorted = expectedKeys.slice().sort();
  assert.deepEqual(actualKeys, expectedSorted, "SANDBOX_CONFIG must have exactly the expected keys");
});
