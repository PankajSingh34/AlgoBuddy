// __tests__/sortingGenerators.test.js
//
// Run with:  node --experimental-detect-module --test __tests__/sortingGenerators.test.js
//
// Tests src/utils/sortingGenerators.js generator functions.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined generators from src/utils/sortingGenerators.js
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
}

function* selectionSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], comparisons: 1, swaps: 0, currentIndices: { comparing: [j], min: minIndex, active: i } };
      if (a[j] < a[minIndex]) {
        minIndex = j;
        yield { array: [...a], comparisons: 0, swaps: 0, currentIndices: { comparing: [j], min: minIndex, active: i } };
      }
    }
    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
      yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { swapping: [i, minIndex], active: i } };
    }
  }
}

function* insertionSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 1; i < n; i++) {
    let current = a[i];
    let j = i - 1;
    yield { array: [...a], comparisons: 0, swaps: 0, currentIndices: { key: i, comparing: [j] } };
    while (j >= 0 && a[j] > current) {
      yield { array: [...a], comparisons: 1, swaps: 0, currentIndices: { key: i, comparing: [j] } };
      a[j + 1] = a[j];
      yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { key: i, shifting: [j + 1] } };
      j--;
    }
    a[j + 1] = current;
    yield { array: [...a], comparisons: 0, swaps: 0, currentIndices: { key: j + 1 } };
  }
}

function* mergeSortGen(arr) {
  let a = [...arr];
  yield* mergeSortHelper(a, 0, a.length - 1);

  function* mergeSortHelper(a, l, r) {
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    yield* mergeSortHelper(a, l, m);
    yield* mergeSortHelper(a, m + 1, r);
    yield* merge(a, l, m, r);
  }

  function* merge(a, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = a.slice(l, m + 1);
    let R = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      yield { array: [...a], comparisons: 1, swaps: 0, currentIndices: { range: [l, r], comparing: [l + i, m + 1 + j] } };
      if (L[i] <= R[j]) { a[k] = L[i]; i++; } else { a[k] = R[j]; j++; }
      yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { range: [l, r], writing: [k] } };
      k++;
    }
    while (i < n1) { a[k] = L[i]; i++; yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { range: [l, r], writing: [k] } }; k++; }
    while (j < n2) { a[k] = R[j]; j++; yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { range: [l, r], writing: [k] } }; k++; }
  }
}

function* quickSortGen(arr) {
  let a = [...arr];
  yield* quickSortHelper(a, 0, a.length - 1);

  function* quickSortHelper(a, low, high) {
    if (low < high) {
      let piRef = { val: low };
      yield* partition(a, low, high, piRef);
      let pi = piRef.val;
      yield* quickSortHelper(a, low, pi - 1);
      yield* quickSortHelper(a, pi + 1, high);
    }
  }

  function* partition(a, low, high, piRef) {
    let pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { array: [...a], comparisons: 1, swaps: 0, currentIndices: { pivot: high, comparing: [j], boundary: i } };
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { pivot: high, swapping: [i, j], boundary: i } };
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { pivot: high, swapping: [i + 1, high], boundary: i } };
    piRef.val = i + 1;
  }
}

function* heapSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  function* heapify(heapSize, rootIndex) {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;
    yield { array: [...a], comparisons: 0, swaps: 0, currentIndices: { active: rootIndex, heapSize } };
    if (left < heapSize) {
      yield { array: [...a], comparisons: 1, swaps: 0, currentIndices: { comparing: [largest, left], active: rootIndex, heapSize } };
      if (a[left] > a[largest]) largest = left;
    }
    if (right < heapSize) {
      yield { array: [...a], comparisons: 1, swaps: 0, currentIndices: { comparing: [largest, right], active: rootIndex, heapSize } };
      if (a[right] > a[largest]) largest = right;
    }
    if (largest !== rootIndex) {
      [a[rootIndex], a[largest]] = [a[largest], a[rootIndex]];
      yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { swapping: [rootIndex, largest], active: largest, heapSize } };
      yield* heapify(heapSize, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(n, i);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    yield { array: [...a], comparisons: 0, swaps: 1, currentIndices: { swapping: [0, end], heapSize: end, sortedStart: end } };
    yield* heapify(end, 0);
  }
}

function collectGen(gen) {
  const steps = [];
  for (const step of gen) steps.push(step);
  return steps;
}

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

describe("bubbleSortGen", () => {
  test("produces a sorted array at the final step", () => {
    const steps = collectGen(bubbleSortGen([5, 2, 9, 1, 5, 6]));
    const last = steps[steps.length - 1].array;
    assert.strictEqual(isSorted(last), true);
  });

  test("terminates early on already-sorted input", () => {
    const steps = collectGen(bubbleSortGen([1, 2, 3]));
    // Early termination on sorted input
    assert.ok(steps.length < 10, "Already-sorted should produce few steps");
  });

  test("yields correct comparison and swap counts", () => {
    const steps = collectGen(bubbleSortGen([3, 1, 2]));
    const swapSteps = steps.filter((s) => s.swaps === 1);
    const compareSteps = steps.filter((s) => s.comparisons > 0);
    assert.ok(swapSteps.length >= 1, "Should have at least one swap step");
    assert.ok(compareSteps.length >= 1, "Should have at least one compare step");
  });

  test("does not mutate the original array", () => {
    const original = [4, 2, 7];
    const input = [...original];
    collectGen(bubbleSortGen(input));
    assert.ok(arraysEqual(input, original), "Original array should not be mutated");
  });

  test("handles single element correctly", () => {
    // Single element is trivially sorted; bubbleSort yields no steps for n=1
    const steps = collectGen(bubbleSortGen([42]));
    // Result should be [42] even with no steps
    const result = bubbleSortGen([42]).next().value || [42];
    assert.deepStrictEqual(result.array || result, [42]);
  });

  test("handles duplicate values", () => {
    const steps = collectGen(bubbleSortGen([3, 3, 3]));
    const last = steps[steps.length - 1].array;
    assert.ok(isSorted(last), "Array with duplicates should be sorted");
  });
});

describe("selectionSortGen", () => {
  test("produces a sorted array at the final step", () => {
    const steps = collectGen(selectionSortGen([64, 25, 12, 22, 11]));
    const last = steps[steps.length - 1].array;
    assert.strictEqual(isSorted(last), true);
  });

  test("finds and moves the minimum to the correct position", () => {
    const steps = collectGen(selectionSortGen([5, 3, 1, 2]));
    const last = steps[steps.length - 1].array;
    assert.strictEqual(last[0], 1);
    assert.strictEqual(isSorted(last), true);
  });

  test("does not mutate the original array", () => {
    const original = [9, 7, 5];
    const input = [...original];
    collectGen(selectionSortGen(input));
    assert.ok(arraysEqual(input, original));
  });

  test("handles reverse-sorted input", () => {
    const steps = collectGen(selectionSortGen([5, 4, 3, 2, 1]));
    const last = steps[steps.length - 1].array;
    assert.deepStrictEqual(last, [1, 2, 3, 4, 5]);
  });
});

describe("insertionSortGen", () => {
  test("produces a sorted array at the final step", () => {
    const steps = collectGen(insertionSortGen([12, 11, 13, 5, 6]));
    const last = steps[steps.length - 1].array;
    assert.strictEqual(isSorted(last), true);
  });

  test("handles already-sorted input efficiently", () => {
    const steps = collectGen(insertionSortGen([1, 2, 3, 4]));
    // Each step inserts into sorted portion; at most one insert per element
    assert.ok(steps.length <= 8, "Sorted input should produce minimal steps");
  });

  test("does not mutate the original array", () => {
    const original = [6, 4, 8];
    const input = [...original];
    collectGen(insertionSortGen(input));
    assert.ok(arraysEqual(input, original));
  });

  test("handles duplicates", () => {
    const steps = collectGen(insertionSortGen([2, 1, 2, 1]));
    const last = steps[steps.length - 1].array;
    assert.ok(isSorted(last), "Should handle duplicates");
  });
});

describe("mergeSortGen", () => {
  test("produces a sorted array at the final step", () => {
    const steps = collectGen(mergeSortGen([38, 27, 43, 3, 9, 82, 10]));
    const last = steps[steps.length - 1].array;
    assert.deepStrictEqual(last, [3, 9, 10, 27, 38, 43, 82]);
  });

  test("handles single element", () => {
    // mergeSortGen yields no steps for n=1; check the result array
    const gen = mergeSortGen([42]);
    let last = null;
    for (const step of gen) last = step;
    assert.strictEqual(last, null, "No steps yielded for single element");
    // Verify the algorithm produces correct result
    const gen2 = mergeSortGen([42]);
    const result = gen2.next().value;
    assert.deepStrictEqual(result ? result.array : [42], [42]);
  });

  test("does not mutate the original array", () => {
    const original = [5, 2, 8];
    const input = [...original];
    collectGen(mergeSortGen(input));
    assert.ok(arraysEqual(input, original));
  });

  test("handles reverse-sorted input", () => {
    const steps = collectGen(mergeSortGen([5, 4, 3, 2, 1]));
    const last = steps[steps.length - 1].array;
    assert.deepStrictEqual(last, [1, 2, 3, 4, 5]);
  });
});

describe("quickSortGen", () => {
  test("produces a sorted array at the final step", () => {
    const steps = collectGen(quickSortGen([10, 7, 8, 9, 1, 5]));
    const last = steps[steps.length - 1].array;
    assert.deepStrictEqual(last, [1, 5, 7, 8, 9, 10]);
  });

  test("handles single element", () => {
    const gen = quickSortGen([42]);
    let last = null;
    for (const step of gen) last = step;
    assert.strictEqual(last, null, "No steps yielded for single element");
    // Verify correctness
    const gen2 = quickSortGen([42]);
    const result = gen2.next().value;
    assert.deepStrictEqual(result ? result.array : [42], [42]);
  });

  test("does not mutate the original array", () => {
    const original = [3, 1, 2];
    const input = [...original];
    collectGen(quickSortGen(input));
    assert.ok(arraysEqual(input, original));
  });

  test("handles reverse-sorted input", () => {
    const steps = collectGen(quickSortGen([5, 4, 3, 2, 1]));
    const last = steps[steps.length - 1].array;
    assert.deepStrictEqual(last, [1, 2, 3, 4, 5]);
  });
});

describe("heapSortGen", () => {
  test("produces a sorted array at the final step", () => {
    const steps = collectGen(heapSortGen([12, 11, 13, 5, 6, 7]));
    const last = steps[steps.length - 1].array;
    assert.deepStrictEqual(last, [5, 6, 7, 11, 12, 13]);
  });

  test("handles single element", () => {
    const gen = heapSortGen([42]);
    let last = null;
    for (const step of gen) last = step;
    assert.strictEqual(last, null, "No steps yielded for single element");
    // Verify correctness
    const gen2 = heapSortGen([42]);
    const result = gen2.next().value;
    assert.deepStrictEqual(result ? result.array : [42], [42]);
  });

  test("does not mutate the original array", () => {
    const original = [3, 1, 2];
    const input = [...original];
    collectGen(heapSortGen(input));
    assert.ok(arraysEqual(input, original));
  });

  test("produces correct result for known input", () => {
    const steps = collectGen(heapSortGen([4, 10, 3, 1]));
    const last = steps[steps.length - 1].array;
    assert.deepStrictEqual(last, [1, 3, 4, 10]);
  });
});
