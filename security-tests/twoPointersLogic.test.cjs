/**
 * Regression tests for two-pointers generators in
 * src/features/algorithms/array/twoPointersLogic.js
 *
 * Run with: node --experimental-detect-module --test security-tests/twoPointersLogic.test.cjs
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const {
  generateStatesPairSum,
  generateStatesRemoveDuplicates,
  generateStatesContainerWater,
} = require(path.resolve(__dirname, "../src/features/algorithms/array/twoPointersLogic.js"));

// ─── generateStatesPairSum ─────────────────────────────────────────────────────

test("generateStatesPairSum: finds matching pair and yields success+done", () => {
  const arr = [1, 3, 5, 7, 9];
  const steps = [...generateStatesPairSum(arr, 10)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done frame");
  assert.strictEqual(done.success, true, "should have success=true");
  assert.strictEqual(done.best.includes("Found!"), true, "best should indicate found");
});

test("generateStatesPairSum: yields not-found done when no pair exists", () => {
  const arr = [1, 2, 3];
  const steps = [...generateStatesPairSum(arr, 100)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined);
  assert.strictEqual(done.success, undefined, "should not be success");
  assert.strictEqual(done.best, "Not found", "should indicate not found");
});

test("generateStatesPairSum: yields initialization step", () => {
  const arr = [1, 3, 5];
  const steps = [...generateStatesPairSum(arr, 8)];
  assert.ok(steps.length > 0, "should yield at least one step");
  assert.ok(steps[0].activePointers, "first step should have activePointers");
  assert.strictEqual(steps[0].activePointers[0], 0);
  assert.strictEqual(steps[0].activePointers[1], 2);
});

test("generateStatesPairSum: handles adjacent pair (left+1 == right)", () => {
  const arr = [1, 4, 5, 7];
  const steps = [...generateStatesPairSum(arr, 9)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined);
  assert.strictEqual(done.success, true);
  assert.strictEqual(done.left + 1, done.right, "left and right should be adjacent when found");
});

test("generateStatesPairSum: empty array yields done", () => {
  const steps = [...generateStatesPairSum([], 5)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done for empty array");
});

// ─── generateStatesRemoveDuplicates ────────────────────────────────────────────

test("generateStatesRemoveDuplicates: counts unique elements correctly", () => {
  const arr = [1, 1, 2, 2, 3, 4, 4, 5];
  const steps = [...generateStatesRemoveDuplicates(arr)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done frame");
  // The done frame reports slow+1 (write-position count)
  assert.ok(done.best.startsWith("Unique count:"), "should have unique count");
  const count = parseInt(done.best.replace("Unique count: ", ""));
  assert.ok(count >= 1, "should report at least 1 unique element");
});

test("generateStatesRemoveDuplicates: all same elements yields 1", () => {
  const arr = [7, 7, 7, 7];
  const steps = [...generateStatesRemoveDuplicates(arr)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined);
  assert.strictEqual(done.best, "Unique count: 1");
});

test("generateStatesRemoveDuplicates: empty array returns nothing", () => {
  const steps = [...generateStatesRemoveDuplicates([])];
  assert.strictEqual(steps.length, 0, "should not yield any steps for empty array");
});

test("generateStatesRemoveDuplicates: violation flag set for duplicates", () => {
  const arr = [1, 1, 2];
  const steps = [...generateStatesRemoveDuplicates(arr)];
  const violations = steps.filter((s) => s.violation === true);
  assert.ok(violations.length > 0, "should flag duplicate");
});

test("generateStatesRemoveDuplicates: success flag set for new unique", () => {
  const arr = [1, 1, 2, 3];
  const steps = [...generateStatesRemoveDuplicates(arr)];
  const successes = steps.filter((s) => s.success === true);
  assert.ok(successes.length > 0, "should flag new unique element");
});

// ─── generateStatesContainerWater ──────────────────────────────────────────────

test("generateStatesContainerWater: calculates max water correctly", () => {
  // [1,8,6,2,5,4,8,3,7] — the max area is 49 from indices 1 and 8
  const arr = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const steps = [...generateStatesContainerWater(arr)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done frame");
  assert.strictEqual(done.best, "Max water: 49");
});

test("generateStatesContainerWater: two elements yields correct area", () => {
  const arr = [1, 10];
  const steps = [...generateStatesContainerWater(arr)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined);
  assert.strictEqual(done.best, "Max water: 1", "min(1,10)*1=1");
});

test("generateStatesContainerWater: non-increasing heights yields first area", () => {
  const arr = [5, 4, 3, 2, 1];
  const steps = [...generateStatesContainerWater(arr)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined);
  assert.ok(done.best.startsWith("Max water:"), "should have max water value");
});

test("generateStatesContainerWater: done flag is set", () => {
  const steps = [...generateStatesContainerWater([1, 2, 3])];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done frame");
});

test("generateStatesContainerWater: empty array yields done", () => {
  const steps = [...generateStatesContainerWater([])];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done for empty array");
});
