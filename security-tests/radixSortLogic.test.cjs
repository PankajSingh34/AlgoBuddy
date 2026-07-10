const test = require("node:test");
const assert = require("node:assert/strict");

async function loadRadixSortGenerator() {
  const module = await import("../src/features/algorithms/array/radixSortLogic.js");
  return module.radixSortGenerator;
}

function getCompletedArray(radixSortGenerator, input) {
  const steps = [...radixSortGenerator(input)];
  return steps.at(-1).payload.arr;
}

test("radixSortGenerator keeps positive-number sorting behavior", async () => {
  const radixSortGenerator = await loadRadixSortGenerator();

  assert.deepEqual(
    getCompletedArray(radixSortGenerator, [170, 45, 75, 90, 802, 24, 2, 66]),
    [2, 24, 45, 66, 75, 90, 170, 802],
  );
});

test("radixSortGenerator sorts mixed negative and non-negative integers", async () => {
  const radixSortGenerator = await loadRadixSortGenerator();

  assert.deepEqual(
    getCompletedArray(radixSortGenerator, [3, -1, 2, -10]),
    [-10, -1, 2, 3],
  );
  assert.deepEqual(
    getCompletedArray(radixSortGenerator, [-5, -10, 0, 2, 1]),
    [-10, -5, 0, 1, 2],
  );
});
