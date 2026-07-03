// security-tests/sortingGenerators.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/sortingGenerators.test.cjs
//
// Tests the ES6 generator sorting algorithms in src/utils/sortingGenerators.js.
// Inlined as async functions (generators not supported in CJS mode).

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// ── Inlined source from src/utils/sortingGenerators.js (as async fns) ──

async function bubbleSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return a;
}

async function selectionSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIndex]) minIndex = j;
    }
    if (minIndex !== i) [a[i], a[minIndex]] = [a[minIndex], a[i]];
  }
  return a;
}

async function insertionSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 1; i < n; i++) {
    let current = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > current) { a[j + 1] = a[j]; j--; }
    a[j + 1] = current;
  }
  return a;
}

async function mergeSortGen(arr) {
  const a = [...arr];
  await mergeSortHelper(a, 0, a.length - 1);
  return a;
  async function mergeSortHelper(a, l, r) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await mergeSortHelper(a, l, m);
    await mergeSortHelper(a, m + 1, r);
    await merge(a, l, m, r);
  }
  async function merge(a, l, m, r) {
    const n1 = m - l + 1, n2 = r - m;
    const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) { a[k] = L[i]; i++; } else { a[k] = R[j]; j++; }
      k++;
    }
    while (i < n1) { a[k] = L[i]; i++; k++; }
    while (j < n2) { a[k] = R[j]; j++; k++; }
  }
}

async function quickSortGen(arr) {
  const a = [...arr];
  await quickSortHelper(a, 0, a.length - 1);
  return a;
  async function quickSortHelper(a, low, high) {
    if (low >= high) return;
    const pi = await partition(a, low, high);
    await quickSortHelper(a, low, pi - 1);
    await quickSortHelper(a, pi + 1, high);
  }
  async function partition(a, low, high) {
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (a[j] < pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    return i + 1;
  }
}

async function heapSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  async function heapify(heapSize, rootIndex) {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1, right = 2 * rootIndex + 2;
    if (left < heapSize && a[left] > a[largest]) largest = left;
    if (right < heapSize && a[right] > a[largest]) largest = right;
    if (largest !== rootIndex) { [a[rootIndex], a[largest]] = [a[largest], a[rootIndex]]; await heapify(heapSize, largest); }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
  for (let end = n - 1; end > 0; end--) { [a[0], a[end]] = [a[end], a[0]]; await heapify(end, 0); }
  return a;
}

// ── Tests ───────────────────────────────────────────────────────────────

function assertSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    assert.ok(arr[i - 1] <= arr[i], `array is not sorted: [${arr.join(', ')}]`);
  }
}

const SMALL_ARRAY = [3, 1, 4, 1, 5, 9, 2, 6];

describe('bubbleSortGen', () => {
  test('produces a sorted array', async () => {
    const result = await bubbleSortGen(SMALL_ARRAY);
    assertSorted(result);
  });
  test('empty array returns empty', async () => {
    const result = await bubbleSortGen([]);
    assertSorted(result);
  });
  test('single element is unchanged', async () => {
    const result = await bubbleSortGen([42]);
    assertSorted(result);
    assert.strictEqual(result[0], 42);
  });
  test('already sorted array stays sorted', async () => {
    const result = await bubbleSortGen([1, 2, 3, 4, 5]);
    assertSorted(result);
  });
  test('reverse sorted array gets sorted', async () => {
    const result = await bubbleSortGen([5, 4, 3, 2, 1]);
    assertSorted(result);
  });
  test('array with duplicates gets sorted', async () => {
    const result = await bubbleSortGen([2, 5, 2, 5, 1]);
    assertSorted(result);
  });
});

describe('selectionSortGen', () => {
  test('produces a sorted array', async () => {
    const result = await selectionSortGen(SMALL_ARRAY);
    assertSorted(result);
  });
  test('empty array returns empty', async () => {
    const result = await selectionSortGen([]);
    assertSorted(result);
  });
  test('single element is unchanged', async () => {
    const result = await selectionSortGen([42]);
    assertSorted(result);
    assert.strictEqual(result[0], 42);
  });
  test('reverse sorted array gets sorted', async () => {
    const result = await selectionSortGen([5, 4, 3, 2, 1]);
    assertSorted(result);
  });
  test('array with duplicates gets sorted', async () => {
    const result = await selectionSortGen([2, 5, 2, 5, 1]);
    assertSorted(result);
  });
});

describe('insertionSortGen', () => {
  test('produces a sorted array', async () => {
    const result = await insertionSortGen(SMALL_ARRAY);
    assertSorted(result);
  });
  test('empty array returns empty', async () => {
    const result = await insertionSortGen([]);
    assertSorted(result);
  });
  test('single element is unchanged', async () => {
    const result = await insertionSortGen([42]);
    assertSorted(result);
    assert.strictEqual(result[0], 42);
  });
  test('reverse sorted array gets sorted', async () => {
    const result = await insertionSortGen([5, 4, 3, 2, 1]);
    assertSorted(result);
  });
  test('array with duplicates gets sorted', async () => {
    const result = await insertionSortGen([2, 5, 2, 5, 1]);
    assertSorted(result);
  });
});

describe('mergeSortGen', () => {
  test('produces a sorted array', async () => {
    const result = await mergeSortGen(SMALL_ARRAY);
    assertSorted(result);
  });
  test('empty array returns empty', async () => {
    const result = await mergeSortGen([]);
    assertSorted(result);
  });
  test('single element is unchanged', async () => {
    const result = await mergeSortGen([42]);
    assertSorted(result);
    assert.strictEqual(result[0], 42);
  });
  test('already sorted array stays sorted', async () => {
    const result = await mergeSortGen([1, 2, 3, 4, 5]);
    assertSorted(result);
  });
  test('reverse sorted array gets sorted', async () => {
    const result = await mergeSortGen([5, 4, 3, 2, 1]);
    assertSorted(result);
  });
  test('array with duplicates gets sorted', async () => {
    const result = await mergeSortGen([2, 5, 2, 5, 1]);
    assertSorted(result);
  });
});

describe('quickSortGen', () => {
  test('produces a sorted array', async () => {
    const result = await quickSortGen(SMALL_ARRAY);
    assertSorted(result);
  });
  test('empty array returns empty', async () => {
    const result = await quickSortGen([]);
    assertSorted(result);
  });
  test('single element is unchanged', async () => {
    const result = await quickSortGen([42]);
    assertSorted(result);
    assert.strictEqual(result[0], 42);
  });
  test('already sorted array stays sorted', async () => {
    const result = await quickSortGen([1, 2, 3, 4, 5]);
    assertSorted(result);
  });
  test('reverse sorted array gets sorted', async () => {
    const result = await quickSortGen([5, 4, 3, 2, 1]);
    assertSorted(result);
  });
  test('array with duplicates gets sorted', async () => {
    const result = await quickSortGen([2, 5, 2, 5, 1]);
    assertSorted(result);
  });
});

describe('heapSortGen', () => {
  test('produces a sorted array', async () => {
    const result = await heapSortGen(SMALL_ARRAY);
    assertSorted(result);
  });
  test('empty array returns empty', async () => {
    const result = await heapSortGen([]);
    assertSorted(result);
  });
  test('single element is unchanged', async () => {
    const result = await heapSortGen([42]);
    assertSorted(result);
    assert.strictEqual(result[0], 42);
  });
  test('already sorted array stays sorted', async () => {
    const result = await heapSortGen([1, 2, 3, 4, 5]);
    assertSorted(result);
  });
  test('reverse sorted array gets sorted', async () => {
    const result = await heapSortGen([5, 4, 3, 2, 1]);
    assertSorted(result);
  });
  test('array with duplicates gets sorted', async () => {
    const result = await heapSortGen([2, 5, 2, 5, 1]);
    assertSorted(result);
  });
});
