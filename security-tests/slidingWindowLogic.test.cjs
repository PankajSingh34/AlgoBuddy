/**
 * Regression tests for sliding window generators in
 * src/features/algorithms/array/slidingWindowLogic.js
 *
 * Run with: node --experimental-detect-module --test security-tests/slidingWindowLogic.test.cjs
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const {
  generateStatesFixedMax,
  generateStatesFixedAvg,
  generateStatesVarLongestSub,
  generateStatesVarSmallestSub,
} = require(path.resolve(__dirname, "../src/features/algorithms/array/slidingWindowLogic.js"));

// ─── generateStatesFixedMax ────────────────────────────────────────────────────

test("generateStatesFixedMax: finds max sum correctly", () => {
  // [1,3,2,5,1,1,2] k=3: windows are 6, 10, 8, 7, 4 → max=10
  const arr = [1, 3, 2, 5, 1, 1, 2];
  const steps = [...generateStatesFixedMax(arr, 3)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield a done frame");
  assert.strictEqual(done.best, 10, "max sum of size 3 should be 10 (3+2+5)");
});

test("generateStatesFixedMax: yields non-empty steps", () => {
  const steps = [...generateStatesFixedMax([1, 2], 2)];
  assert.ok(steps.length > 0, "should yield at least one step");
});

test("generateStatesFixedMax: None during expansion, numeric best after complete", () => {
  const arr = [3, 1, 2];
  const steps = [...generateStatesFixedMax(arr, 2)];
  // During initial expansion (i<k): best is 'None'
  const noneSteps = steps.filter((s) => s.best === "None");
  assert.ok(noneSteps.length >= 1, "best should be 'None' during initial window fill");
  // After first complete window: best should be numeric (sum of window)
  const afterComplete = steps.find(
    (s) => typeof s.best === "number" && s.activeWindow && s.activeWindow[1] === 1
  );
  assert.ok(afterComplete !== undefined, "first complete window should have numeric best");
  assert.strictEqual(afterComplete.best, 4, "window [3,1] sum = 4");
});

test("generateStatesFixedMax: done frame marks completion", () => {
  const steps = [...generateStatesFixedMax([1, 2, 3], 2)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done frame");
  assert.strictEqual(done.best, 5, "max of windows [1,2]=3 and [2,3]=5 is 5");
});

// ─── generateStatesFixedAvg ─────────────────────────────────────────────────────

test("generateStatesFixedAvg: yields correct number of averages", () => {
  const arr = [1, 3, 2, 4];
  const steps = [...generateStatesFixedAvg(arr, 2)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done frame");
  assert.ok(done.best.includes("2.00"), "should have first average 2.00");
  assert.ok(done.best.includes("2.50"), "should have second average 2.50");
  assert.ok(done.best.includes("3.00"), "should have third average 3.00");
});

test("generateStatesFixedAvg: expands initial window correctly", () => {
  const steps = [...generateStatesFixedAvg([1, 4, 2], 3)];
  const firstYield = steps[0];
  assert.ok(firstYield.activeWindow, "should yield activeWindow");
  assert.strictEqual(firstYield.left, 0);
  assert.strictEqual(firstYield.right, 0, "first step expands to index 0");
});

test("generateStatesFixedAvg: done frame contains all averages", () => {
  const arr = [1, 2, 3];
  const steps = [...generateStatesFixedAvg(arr, 2)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined);
  assert.ok(done.best.includes("1.50"), "avg of [1,2] = 1.50");
  assert.ok(done.best.includes("2.50"), "avg of [2,3] = 2.50");
});

// ─── generateStatesVarLongestSub ────────────────────────────────────────────────

test("generateStatesVarLongestSub: finds correct length", () => {
  const steps = [...generateStatesVarLongestSub("abcabcbb")];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done frame");
  assert.strictEqual(done.best, 3, "abc is 3 chars without repeat");
});

test("generateStatesVarLongestSub: empty string yields done immediately", () => {
  const steps = [...generateStatesVarLongestSub("")];
  assert.ok(steps.length > 0, "should yield at least the done frame");
  const done = steps.find((s) => s.done);
  assert.strictEqual(done.best, 0, "empty string has length 0");
});

test("generateStatesVarLongestSub: all unique chars yields full length", () => {
  const steps = [...generateStatesVarLongestSub("abcd")];
  const done = steps.find((s) => s.done);
  assert.strictEqual(done.best, 4, "all 4 chars are unique");
});

test("generateStatesVarLongestSub: violation flag is set when duplicate found", () => {
  const steps = [...generateStatesVarLongestSub("abba")];
  const violations = steps.filter((s) => s.violation === true);
  assert.ok(violations.length > 0, "should flag duplicate b as violation");
});

// ─── generateStatesVarSmallestSub ───────────────────────────────────────────────

test("generateStatesVarSmallestSub: finds correct min length", () => {
  const arr = [2, 3, 1, 2, 4, 3];
  const steps = [...generateStatesVarSmallestSub(arr, 7)];
  const done = steps.find((s) => s.done);
  assert.ok(done !== undefined, "should yield done frame");
  assert.strictEqual(done.best, 2, "min subarray [3,4] or [2,4] has sum >= 7");
});

test("generateStatesVarSmallestSub: target larger than total sum yields 0", () => {
  const arr = [1, 1, 1];
  const steps = [...generateStatesVarSmallestSub(arr, 100)];
  const done = steps.find((s) => s.done);
  assert.strictEqual(done.best, 0, "no subarray sums to 100");
});

test("generateStatesVarSmallestSub: success flag is set when window meets target", () => {
  const arr = [5, 1, 1];
  const steps = [...generateStatesVarSmallestSub(arr, 5)];
  const successes = steps.filter((s) => s.success === true);
  assert.ok(successes.length > 0, "should flag when window sum >= target");
});

test("generateStatesVarSmallestSub: empty array yields done with best=0", () => {
  const steps = [...generateStatesVarSmallestSub([], 5)];
  const done = steps.find((s) => s.done);
  assert.strictEqual(done.best, 0);
});
