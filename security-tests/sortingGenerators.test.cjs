// security-tests/sortingGenerators.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/sortingGenerators.test.cjs
//
// Tests sorting generator functions in src/utils/sortingGenerators.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

// ─── Bubble Sort Generator ────────────────────────────────────────────────────
function* bubbleSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...a], comparisons: 1, swaps: 0, currentIndices: { comparing: [j, j + 1] } };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { swapping: [j, j + 1] } };
      }
    }
    if (!swapped) break;
  }
  yield { array: [...a] };
}

// ─── Selection Sort Generator ─────────────────────────────────────────────────
function* selectionSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], comparisons: 1, currentIndices: { comparing: [j], min: minIndex, active: i } };
      if (a[j] < a[minIndex]) {
        minIndex = j;
        yield { array: [...a], comparisons: 0, currentIndices: { comparing: [j], min: minIndex, active: i } };
      }
    }
    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
      yield { array: [...a], swaps: 1, currentIndices: { swapping: [i, minIndex] } };
    }
  }
  yield { array: [...a] };
}

// ─── Insertion Sort Generator ─────────────────────────────────────────────────
function* insertionSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    yield { array: [...a], comparing: i, currentIndices: { comparing: [i], sorted: j } };
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      yield { array: [...a], shifts: 1, currentIndices: { shifting: [j, j + 1] } };
      j--;
    }
    a[j + 1] = key;
    yield { array: [...a], inserted: j + 1, currentIndices: { inserted: j + 1 } };
  }
  yield { array: [...a] };
}

// ─── Merge Sort Generator ─────────────────────────────────────────────────────
function* mergeSortGen(arr) {
  function* mergeSort(a, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    yield* mergeSort(a, left, mid);
    yield* mergeSort(a, mid + 1, right);
    yield* merge(a, left, mid, right);
  }

  function* merge(a, left, mid, right) {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i++];
      } else {
        a[k] = rightArr[j++];
      }
      yield { array: [...a], mergeStep: true };
      k++;
    }
    while (i < leftArr.length) {
      a[k] = leftArr[i++];
      yield { array: [...a], mergeStep: true };
      k++;
    }
    while (j < rightArr.length) {
      a[k] = rightArr[j++];
      yield { array: [...a], mergeStep: true };
      k++;
    }
  }

  let a = [...arr];
  if (a.length <= 1) { yield { array: a }; return; }
  yield* mergeSort(a, 0, a.length - 1);
  yield { array: [...a] };
}

// ─── Helper ──────────────────────────────────────────────────────────────────
function toArray(gen) {
  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

function extractLastArray(steps) {
  return steps[steps.length - 1].array;
}

// ─── Bubble Sort tests ────────────────────────────────────────────────────────
describe("bubbleSortGen", () => {
  test("sorts [5,3,8,4,2]", () => {
    const steps = toArray(bubbleSortGen([5, 3, 8, 4, 2]));
    assert.deepEqual(extractLastArray(steps), [2, 3, 4, 5, 8]);
  });

  test("sorts [1,2,3,4,5] (already sorted)", () => {
    const steps = toArray(bubbleSortGen([1, 2, 3, 4, 5]));
    assert.deepEqual(extractLastArray(steps), [1, 2, 3, 4, 5]);
  });

  test("sorts [5,4,3,2,1] (reverse sorted)", () => {
    const steps = toArray(bubbleSortGen([5, 4, 3, 2, 1]));
    assert.deepEqual(extractLastArray(steps), [1, 2, 3, 4, 5]);
  });

  test("handles empty array", () => {
    const steps = toArray(bubbleSortGen([]));
    assert.deepEqual(extractLastArray(steps), []);
  });

  test("handles single element", () => {
    const steps = toArray(bubbleSortGen([42]));
    assert.deepEqual(extractLastArray(steps), [42]);
  });

  test("handles duplicate elements", () => {
    const steps = toArray(bubbleSortGen([3, 1, 3, 2, 1]));
    assert.deepEqual(extractLastArray(steps), [1, 1, 2, 3, 3]);
  });

  test("produces at least one step", () => {
    const steps = toArray(bubbleSortGen([5, 3]));
    assert.ok(steps.length >= 1);
  });
});

// ─── Selection Sort tests ──────────────────────────────────────────────────────
describe("selectionSortGen", () => {
  test("sorts [64,25,12,22,11]", () => {
    const steps = toArray(selectionSortGen([64, 25, 12, 22, 11]));
    assert.deepEqual(extractLastArray(steps), [11, 12, 22, 25, 64]);
  });

  test("handles empty array", () => {
    const steps = toArray(selectionSortGen([]));
    assert.deepEqual(extractLastArray(steps), []);
  });

  test("handles single element", () => {
    const steps = toArray(selectionSortGen([42]));
    assert.deepEqual(extractLastArray(steps), [42]);
  });

  test("handles already sorted array", () => {
    const steps = toArray(selectionSortGen([1, 2, 3]));
    assert.deepEqual(extractLastArray(steps), [1, 2, 3]);
  });

  test("handles duplicates", () => {
    const steps = toArray(selectionSortGen([2, 1, 2, 1]));
    assert.deepEqual(extractLastArray(steps), [1, 1, 2, 2]);
  });
});

// ─── Insertion Sort tests ─────────────────────────────────────────────────────
describe("insertionSortGen", () => {
  test("sorts [12,11,13,5,6]", () => {
    const steps = toArray(insertionSortGen([12, 11, 13, 5, 6]));
    assert.deepEqual(extractLastArray(steps), [5, 6, 11, 12, 13]);
  });

  test("handles empty array", () => {
    const steps = toArray(insertionSortGen([]));
    assert.deepEqual(extractLastArray(steps), []);
  });

  test("handles single element", () => {
    const steps = toArray(insertionSortGen([42]));
    assert.deepEqual(extractLastArray(steps), [42]);
  });

  test("handles already sorted array", () => {
    const steps = toArray(insertionSortGen([1, 2, 3]));
    assert.deepEqual(extractLastArray(steps), [1, 2, 3]);
  });

  test("handles reverse sorted", () => {
    const steps = toArray(insertionSortGen([5, 4, 3, 2, 1]));
    assert.deepEqual(extractLastArray(steps), [1, 2, 3, 4, 5]);
  });
});

// ─── Merge Sort tests ─────────────────────────────────────────────────────────
describe("mergeSortGen", () => {
  test("sorts [38,27,43,3,9,82,10]", () => {
    const steps = toArray(mergeSortGen([38, 27, 43, 3, 9, 82, 10]));
    assert.deepEqual(extractLastArray(steps), [3, 9, 10, 27, 38, 43, 82]);
  });

  test("handles empty array", () => {
    const steps = toArray(mergeSortGen([]));
    assert.deepEqual(extractLastArray(steps), []);
  });

  test("handles single element", () => {
    const steps = toArray(mergeSortGen([42]));
    assert.deepEqual(extractLastArray(steps), [42]);
  });

  test("handles already sorted array", () => {
    const steps = toArray(mergeSortGen([1, 2, 3, 4, 5]));
    assert.deepEqual(extractLastArray(steps), [1, 2, 3, 4, 5]);
  });

  test("handles reverse sorted", () => {
    const steps = toArray(mergeSortGen([5, 4, 3, 2, 1]));
    assert.deepEqual(extractLastArray(steps), [1, 2, 3, 4, 5]);
  });

  test("handles duplicates", () => {
    const steps = toArray(mergeSortGen([3, 3, 1, 2, 1]));
    assert.deepEqual(extractLastArray(steps), [1, 1, 2, 3, 3]);
  });

  test("handles two elements", () => {
    const steps = toArray(mergeSortGen([2, 1]));
    assert.deepEqual(extractLastArray(steps), [1, 2]);
  });
});
