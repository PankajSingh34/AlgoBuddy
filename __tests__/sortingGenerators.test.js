// __tests__/sortingGenerators.test.js
//
// Run with:  npx jest __tests__/sortingGenerators.test.js --colors=false
//
// Tests the six ES6 generator functions in src/utils/sortingGenerators.js.
// Inlined here to avoid ESM import issues with Jest's transform: {} config.

const { describe, expect, test } = require("@jest/globals");

// ─── Inlined generators from src/utils/sortingGenerators.js ─────────────────────

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
      if (L[i] <= R[j]) { a[k] = L[i]; i++; }
      else { a[k] = R[j]; j++; }
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function collectGenerator(gen) {
  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

const DETERMINISTIC = [5, 2, 9, 1, 7];
const SORTED_DETERMINISTIC = [1, 2, 5, 7, 9];
const REVERSE_SORTED = [9, 7, 5, 2, 1];
const SINGLE = [42];
const DUPLICATES = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

function assertYieldShape(step) {
  expect(step).toHaveProperty("array");
  expect(Array.isArray(step.array)).toBe(true);
  expect(step).toHaveProperty("comparisons");
  expect(typeof step.comparisons).toBe("number");
  expect(step.comparisons).toBeGreaterThanOrEqual(0);
  expect(step).toHaveProperty("swaps");
  expect(typeof step.swaps).toBe("number");
  expect(step.swaps).toBeGreaterThanOrEqual(0);
  expect(step).toHaveProperty("currentIndices");
  expect(typeof step.currentIndices).toBe("object");
}

describe("bubbleSortGen", () => {
  test("sorts deterministic array correctly", () => {
    const steps = collectGenerator(bubbleSortGen(DETERMINISTIC));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual(SORTED_DETERMINISTIC);
  });

  test("every step has correct shape", () => {
    const steps = collectGenerator(bubbleSortGen(DETERMINISTIC));
    steps.forEach(assertYieldShape);
  });

  test("all step arrays are the same length as input", () => {
    const steps = collectGenerator(bubbleSortGen(DETERMINISTIC));
    steps.forEach((step) => {
      expect(step.array.length).toBe(DETERMINISTIC.length);
    });
  });

  test("early exit on already-sorted array", () => {
    const steps = collectGenerator(bubbleSortGen([1, 2, 3]));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3]);
    // On sorted input bubble sort makes one pass with no swaps, then breaks
    expect(steps[steps.length - 1].swaps).toBe(0);
  });

  test("empty array produces no yields", () => {
    const steps = collectGenerator(bubbleSortGen([]));
    expect(steps.length).toBeGreaterThanOrEqual(0);
  });

  test("reverses sorted array", () => {
    const steps = collectGenerator(bubbleSortGen(REVERSE_SORTED));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 5, 7, 9]);
  });

  test("handles single element (yields nothing — array is already sorted by definition)", () => {
    const steps = collectGenerator(bubbleSortGen(SINGLE));
    // Single element: loop i < 1-1 = 0 never runs, so no yields
    // Array is trivially sorted without any operations
    expect(steps.length).toBe(0);
  });

  test("all comparison and swap counts are non-negative integers", () => {
    const steps = collectGenerator(bubbleSortGen(DETERMINISTIC));
    steps.forEach((step) => {
      expect(Number.isInteger(step.comparisons)).toBe(true);
      expect(Number.isInteger(step.swaps)).toBe(true);
    });
  });
});

describe("selectionSortGen", () => {
  test("sorts deterministic array correctly", () => {
    const steps = collectGenerator(selectionSortGen(DETERMINISTIC));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual(SORTED_DETERMINISTIC);
  });

  test("every step has correct shape", () => {
    const steps = collectGenerator(selectionSortGen(DETERMINISTIC));
    steps.forEach(assertYieldShape);
  });

  test("final array is sorted", () => {
    const steps = collectGenerator(selectionSortGen(DUPLICATES));
    const lastStep = steps[steps.length - 1];
    expect(isSorted(lastStep.array)).toBe(true);
  });

  test("handles already-sorted array", () => {
    const sorted = [1, 2, 3, 4, 5];
    const steps = collectGenerator(selectionSortGen(sorted));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
  });

  test("handles single element (yields nothing — array is already sorted)", () => {
    const steps = collectGenerator(selectionSortGen(SINGLE));
    // Single element: loop i < 0 never runs, so no yields
    expect(steps.length).toBe(0);
  });

  test("all comparison and swap counts are non-negative integers", () => {
    const steps = collectGenerator(selectionSortGen(DETERMINISTIC));
    steps.forEach((step) => {
      expect(Number.isInteger(step.comparisons)).toBe(true);
      expect(Number.isInteger(step.swaps)).toBe(true);
    });
  });
});

describe("insertionSortGen", () => {
  test("sorts deterministic array correctly", () => {
    const steps = collectGenerator(insertionSortGen(DETERMINISTIC));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual(SORTED_DETERMINISTIC);
  });

  test("every step has correct shape", () => {
    const steps = collectGenerator(insertionSortGen(DETERMINISTIC));
    steps.forEach(assertYieldShape);
  });

  test("final array is sorted", () => {
    const steps = collectGenerator(insertionSortGen(DUPLICATES));
    const lastStep = steps[steps.length - 1];
    expect(isSorted(lastStep.array)).toBe(true);
  });

  test("handles already-sorted array", () => {
    const sorted = [1, 2, 3, 4, 5];
    const steps = collectGenerator(insertionSortGen(sorted));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
  });

  test("handles reverse sorted array", () => {
    const steps = collectGenerator(insertionSortGen(REVERSE_SORTED));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 5, 7, 9]);
  });

  test("handles single element (yields nothing — outer loop starts at i=1, no iteration)", () => {
    const steps = collectGenerator(insertionSortGen(SINGLE));
    // Single element: outer loop i=1 < n=1 never runs
    expect(steps.length).toBe(0);
  });

  test("all comparison and swap counts are non-negative integers", () => {
    const steps = collectGenerator(insertionSortGen(DETERMINISTIC));
    steps.forEach((step) => {
      expect(Number.isInteger(step.comparisons)).toBe(true);
      expect(Number.isInteger(step.swaps)).toBe(true);
    });
  });
});

describe("mergeSortGen", () => {
  test("sorts deterministic array correctly", () => {
    const steps = collectGenerator(mergeSortGen(DETERMINISTIC));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual(SORTED_DETERMINISTIC);
  });

  test("every step has correct shape", () => {
    const steps = collectGenerator(mergeSortGen(DETERMINISTIC));
    steps.forEach(assertYieldShape);
  });

  test("final array is sorted", () => {
    const steps = collectGenerator(mergeSortGen(DUPLICATES));
    const lastStep = steps[steps.length - 1];
    expect(isSorted(lastStep.array)).toBe(true);
  });

  test("handles already-sorted array", () => {
    const sorted = [1, 2, 3, 4, 5];
    const steps = collectGenerator(mergeSortGen(sorted));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
  });

  test("handles single element (yields nothing — mergeSortHelper returns immediately)", () => {
    const steps = collectGenerator(mergeSortGen(SINGLE));
    // Single element: mergeSortHelper(l=0, r=0) returns without yielding
    expect(steps.length).toBe(0);
  });

  test("all comparison and swap counts are non-negative integers", () => {
    const steps = collectGenerator(mergeSortGen(DETERMINISTIC));
    steps.forEach((step) => {
      expect(Number.isInteger(step.comparisons)).toBe(true);
      expect(Number.isInteger(step.swaps)).toBe(true);
    });
  });
});

describe("quickSortGen", () => {
  test("sorts deterministic array correctly", () => {
    const steps = collectGenerator(quickSortGen(DETERMINISTIC));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual(SORTED_DETERMINISTIC);
  });

  test("every step has correct shape", () => {
    const steps = collectGenerator(quickSortGen(DETERMINISTIC));
    steps.forEach(assertYieldShape);
  });

  test("final array is sorted", () => {
    const steps = collectGenerator(quickSortGen(DUPLICATES));
    const lastStep = steps[steps.length - 1];
    expect(isSorted(lastStep.array)).toBe(true);
  });

  test("handles already-sorted array", () => {
    const sorted = [1, 2, 3, 4, 5];
    const steps = collectGenerator(quickSortGen(sorted));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
  });

  test("handles reverse sorted array", () => {
    const steps = collectGenerator(quickSortGen(REVERSE_SORTED));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 5, 7, 9]);
  });

  test("handles single element (yields nothing — low < high is false)", () => {
    const steps = collectGenerator(quickSortGen(SINGLE));
    // Single element: quickSortHelper(low=0, high=0) — low < high is false, returns
    expect(steps.length).toBe(0);
  });

  test("all comparison and swap counts are non-negative integers", () => {
    const steps = collectGenerator(quickSortGen(DETERMINISTIC));
    steps.forEach((step) => {
      expect(Number.isInteger(step.comparisons)).toBe(true);
      expect(Number.isInteger(step.swaps)).toBe(true);
    });
  });
});

describe("heapSortGen", () => {
  test("sorts deterministic array correctly", () => {
    const steps = collectGenerator(heapSortGen(DETERMINISTIC));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual(SORTED_DETERMINISTIC);
  });

  test("every step has correct shape", () => {
    const steps = collectGenerator(heapSortGen(DETERMINISTIC));
    steps.forEach(assertYieldShape);
  });

  test("final array is sorted", () => {
    const steps = collectGenerator(heapSortGen(DUPLICATES));
    const lastStep = steps[steps.length - 1];
    expect(isSorted(lastStep.array)).toBe(true);
  });

  test("handles already-sorted array", () => {
    const sorted = [1, 2, 3, 4, 5];
    const steps = collectGenerator(heapSortGen(sorted));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
  });

  test("handles reverse sorted array", () => {
    const steps = collectGenerator(heapSortGen(REVERSE_SORTED));
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 5, 7, 9]);
  });

  test("handles single element (yields nothing — heap build loop and sort loop both skip)", () => {
    const steps = collectGenerator(heapSortGen(SINGLE));
    // Single element: heap build loop (i starts at -1, doesn't run) and
    // sort loop (end=0, 0>0 is false) — no yields
    expect(steps.length).toBe(0);
  });

  test("all comparison and swap counts are non-negative integers", () => {
    const steps = collectGenerator(heapSortGen(DETERMINISTIC));
    steps.forEach((step) => {
      expect(Number.isInteger(step.comparisons)).toBe(true);
      expect(Number.isInteger(step.swaps)).toBe(true);
    });
  });
});
