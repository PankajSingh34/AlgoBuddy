/**
 * Verifies the sandbox resource-limit contract.
 *
 * Run with:
 *   node --experimental-detect-module --test security-tests/sandbox-config.test.cjs
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const SANDBOX_CONFIG = require("../src/lib/sandbox/sandbox.config");

test("sandbox config exposes the expected keys", () => {
  const keys = Object.keys(SANDBOX_CONFIG).sort();
  assert.deepEqual(keys, [
    "MAX_MEMORY_MB",
    "MAX_OUTPUT_LENGTH",
    "MAX_TIMEOUT_MS",
    "RATE_LIMIT_MAX_REQUESTS",
    "RATE_LIMIT_WINDOW_SEC",
  ]);
});

test("sandbox config keeps the documented timeout and memory caps", () => {
  assert.equal(SANDBOX_CONFIG.MAX_TIMEOUT_MS, 1000);
  assert.equal(SANDBOX_CONFIG.MAX_MEMORY_MB, 32);
  assert.equal(SANDBOX_CONFIG.MAX_OUTPUT_LENGTH, 8000);
});

test("sandbox config uses positive integer rate-limit values", () => {
  assert.equal(Number.isInteger(SANDBOX_CONFIG.RATE_LIMIT_MAX_REQUESTS), true);
  assert.equal(Number.isInteger(SANDBOX_CONFIG.RATE_LIMIT_WINDOW_SEC), true);
  assert.ok(SANDBOX_CONFIG.RATE_LIMIT_MAX_REQUESTS > 0);
  assert.ok(SANDBOX_CONFIG.RATE_LIMIT_WINDOW_SEC > 0);
});
