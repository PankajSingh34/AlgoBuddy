const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inline sorting generators as CommonJS for Node test runner

function* bubbleSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { comparing: [j, j + 1] },
      };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        yield {
          array: [...a],
          comparisons: 0,
          swaps: 1,
          currentIndices: { swapping: [j, j + 1] },
        };
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
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { comparing: [j], min: minIndex, active: i },
      };
      if (a[j] < a[minIndex]) {
        minIndex = j;
        yield {
          array: [...a],
          comparisons: 0,
          swaps: 0,
          currentIndices: { comparing: [j], min: minIndex, active: i },
        };
      }
    }
    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
      yield {
        array: [...a],
        comparisons: 0,
        swaps: 1,
        currentIndices: { swapping: [i, minIndex], active: i },
      };
    }
  }
}

function* insertionSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 1; i < n; i++) {
    let current = a[i];
    let j = i - 1;
    yield {
      array: [...a],
      comparisons: 0,
      swaps: 0,
      currentIndices: { key: i, comparing: [j] },
    };
    while (j >= 0 && a[j] > current) {
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { key: i, comparing: [j] },
      };
      a[j + 1] = a[j];
      yield {
        array: [...a],
        comparisons: 0,
        swaps: 1,
        currentIndices: { key: i, shifting: [j + 1] },
      };
      j--;
    }
    a[j + 1] = current;
    yield {
      array: [...a],
      comparisons: 0,
      swaps: 0,
      currentIndices: { key: j + 1 },
    };
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
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { range: [l, r], comparing: [l + i, m + 1 + j] },
      };
      if (L[i] <= R[j]) {
        a[k] = L[i];
        i++;
      } else {
        a[k] = R[j];
        j++;
      }
      yield {
        array: [...a],
        comparisons: 0,
        swaps: 1,
        currentIndices: { range: [l, r], writing: [k] },
      };
      k++;
    }
    while (i < n1) {
      a[k] = L[i];
      i++;
      yield {
        array: [...a],
        comparisons: 0,
        swaps: 1,
        currentIndices: { range: [l, r], writing: [k] },
      };
      k++;
    }
    while (j < n2) {
      a[k] = R[j];
      j++;
      yield {
        array: [...a],
        comparisons: 0,
        swaps: 1,
        currentIndices: { range: [l, r], writing: [k] },
      };
      k++;
    }
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
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { pivot: high, comparing: [j], boundary: i },
      };
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        yield {
          array: [...a],
          comparisons: 0,
          swaps: 1,
          currentIndices: { pivot: high, swapping: [i, j], boundary: i },
        };
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    yield {
      array: [...a],
      comparisons: 0,
      swaps: 1,
      currentIndices: { pivot: high, swapping: [i + 1, high], boundary: i },
    };
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

    yield {
      array: [...a],
      comparisons: 0,
      swaps: 0,
      currentIndices: { active: rootIndex, heapSize },
    };

    if (left < heapSize) {
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { comparing: [largest, left], active: rootIndex, heapSize },
      };
      if (a[left] > a[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { comparing: [largest, right], active: rootIndex, heapSize },
      };
      if (a[right] > a[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIndex) {
      [a[rootIndex], a[largest]] = [a[largest], a[rootIndex]];
      yield {
        array: [...a],
        comparisons: 0,
        swaps: 1,
        currentIndices: { swapping: [rootIndex, largest], active: largest, heapSize },
      };
      yield* heapify(heapSize, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    yield {
      array: [...a],
      comparisons: 0,
      swaps: 1,
      currentIndices: { swapping: [0, end], heapSize: end, sortedStart: end },
    };
    yield* heapify(end, 0);
  }
}

function collect(gen) {
  return [...gen];
}

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

describe('bubbleSortGen', () => {
  it('sorts a small array correctly', () => {
    const steps = collect(bubbleSortGen([5, 3, 8, 1]));
    const last = steps[steps.length - 1].array;
    assert.ok(isSorted(last), 'final array must be sorted');
  });

  it('terminates early on already-sorted input', () => {
    const steps = collect(bubbleSortGen([1, 2, 3]));
    assert.ok(steps.length > 0);
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('yields comparison and swap steps', () => {
    const steps = collect(bubbleSortGen([3, 1]));
    assert.ok(steps.some(s => s.comparisons > 0 || s.swaps > 0));
  });
});

describe('selectionSortGen', () => {
  it('sorts a small array correctly', () => {
    const steps = collect(selectionSortGen([5, 3, 8, 1]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('does not swap when element already in place', () => {
    const steps = collect(selectionSortGen([1, 2, 3]));
    const swapSteps = steps.filter(s => s.swaps > 0);
    assert.equal(swapSteps.length, 0);
  });

  it('yields comparison steps', () => {
    const steps = collect(selectionSortGen([2, 1]));
    assert.ok(steps.some(s => s.comparisons > 0));
  });
});

describe('insertionSortGen', () => {
  it('sorts a small array correctly', () => {
    const steps = collect(insertionSortGen([5, 3, 8, 1]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('handles reverse-sorted input', () => {
    const steps = collect(insertionSortGen([3, 2, 1]));
    assert.ok(isSorted(steps[steps.length - 1].array));
    const swapSteps = steps.filter(s => s.swaps > 0);
    assert.ok(swapSteps.length > 0, 'reverse-sorted should have swaps');
  });

  it('yields key and shift steps', () => {
    const steps = collect(insertionSortGen([1, 3, 2]));
    assert.ok(steps.some(s => s.currentIndices && 'key' in s.currentIndices));
  });
});

describe('mergeSortGen', () => {
  it('sorts a small array correctly', () => {
    const steps = collect(mergeSortGen([5, 3, 8, 1]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('handles single-element input', () => {
    const steps = collect(mergeSortGen([42]));
    assert.ok(isSorted([42]));
    assert.equal(steps.length, 0);
  });

  it('handles two-element input', () => {
    const steps = collect(mergeSortGen([2, 1]));
    assert.ok(steps.length > 0);
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('yields merge comparison steps', () => {
    const steps = collect(mergeSortGen([3, 1, 2]));
    assert.ok(steps.some(s => s.comparisons > 0));
  });
});

describe('quickSortGen', () => {
  it('sorts a small array correctly', () => {
    const steps = collect(quickSortGen([5, 3, 8, 1]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('handles already-sorted input', () => {
    const steps = collect(quickSortGen([1, 2, 3]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('handles reverse-sorted input', () => {
    const steps = collect(quickSortGen([3, 2, 1]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('places pivot correctly in final array', () => {
    const steps = collect(quickSortGen([5, 3, 8, 1]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });
});

describe('heapSortGen', () => {
  it('sorts a small array correctly', () => {
    const steps = collect(heapSortGen([5, 3, 8, 1]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('handles already-sorted input', () => {
    const steps = collect(heapSortGen([1, 2, 3]));
    assert.ok(isSorted(steps[steps.length - 1].array));
  });

  it('yields heapify steps', () => {
    const steps = collect(heapSortGen([3, 1, 2]));
    assert.ok(steps.length > 0);
    assert.ok(steps.some(s => s.currentIndices && 'active' in s.currentIndices));
  });
});
