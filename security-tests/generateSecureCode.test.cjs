/**
 * Unit tests for generateSecureCode function.
 * Covers: generateSecureCode in src/lib/random.js
 * Uses Node's built-in node:test runner.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const randomUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "random.js"),
).href;

let generateSecureCode;

test("random module loads and exports generateSecureCode", async () => {
  const mod = await import(randomUrl);
  generateSecureCode = mod.generateSecureCode;
  assert.ok(typeof generateSecureCode === "function");
});

test("returns a string", () => {
  const result = generateSecureCode();
  assert.strictEqual(typeof result, "string");
});

test("default length is 6 characters", () => {
  const result = generateSecureCode();
  assert.strictEqual(result.length, 6);
});

test("respects custom length parameter", () => {
  assert.strictEqual(generateSecureCode(3).length, 3);
  assert.strictEqual(generateSecureCode(10).length, 10);
  assert.strictEqual(generateSecureCode(20).length, 20);
});

test("returns only uppercase A-Z and 0-9 characters", () => {
  const result = generateSecureCode(100);
  assert.ok(/^[A-Z0-9]+$/.test(result), "All characters must be A-Z or 0-9, got: " + result);
});

test("produces different results on each call", () => {
  const results = new Set();
  for (let i = 0; i < 20; i++) {
    results.add(generateSecureCode());
  }
  // With 36^6 possible codes, 20 calls should all be unique
  assert.strictEqual(results.size, 20, "All 20 calls should produce unique codes");
});

test("length 0 returns empty string", () => {
  const result = generateSecureCode(0);
  assert.strictEqual(result, "");
});

test("length 1 returns a single character from the charset", () => {
  const result = generateSecureCode(1);
  assert.strictEqual(result.length, 1);
  assert.ok(/^[A-Z0-9]$/.test(result));
});

test("very long length works without throwing", () => {
  const result = generateSecureCode(1000);
  assert.strictEqual(result.length, 1000);
  assert.ok(/^[A-Z0-9]+$/.test(result));
});
