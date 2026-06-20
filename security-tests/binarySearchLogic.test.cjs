/**
 * Regression tests for binarySearchGenerator in
 * src/features/algorithms/array/binarySearchLogic.js
 *
 * Run with: node --experimental-detect-module --test security-tests/binarySearchLogic.test.cjs
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("url");

const { binarySearchGenerator } = require(path.resolve(__dirname, "../src/features/algorithms/array/binarySearchLogic.js"));

test("yields found frame when target is in array", () => {
  const arr = [1, 3, 5, 7, 9];
  const steps = [...binarySearchGenerator(arr, 7)];
  assert.ok(steps.length > 0, "should yield at least one step");
  const found = steps.find((s) => s.type === "found");
  assert.ok(found !== undefined, "should yield a found frame");
  assert.strictEqual(found.m, 3);
});

test("yields not_found frame when target is not in array", () => {
  const arr = [1, 3, 5, 7, 9];
  const steps = [...binarySearchGenerator(arr, 4)];
  const last = steps[steps.length - 1];
  assert.strictEqual(last.type, "not_found");
});

test("handles single-element array — found", () => {
  const steps = [...binarySearchGenerator([5], 5)];
  const found = steps.find((s) => s.type === "found");
  assert.ok(found !== undefined);
  assert.strictEqual(found.m, 0);
});

test("handles single-element array — not found", () => {
  const steps = [...binarySearchGenerator([5], 3)];
  const last = steps[steps.length - 1];
  assert.strictEqual(last.type, "not_found");
});

test("yields correct indices on first check", () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const steps = [...binarySearchGenerator(arr, 1)];
  const checkingSteps = steps.filter((s) => s.type === "checking");
  assert.ok(checkingSteps.length > 0);
  assert.strictEqual(checkingSteps[0].l, 0);
  assert.strictEqual(checkingSteps[0].h, 8);
});

test("yields discard frames before final result", () => {
  const arr = [1, 3, 5, 7, 9];
  const steps = [...binarySearchGenerator(arr, 7)];
  const discardSteps = steps.filter(
    (s) => s.type === "discard_left" || s.type === "discard_right"
  );
  // Should have discarded left half (1, 3, 5) before finding 7
  assert.ok(discardSteps.length >= 1);
});
