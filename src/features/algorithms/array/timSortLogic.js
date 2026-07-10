const MIN_MERGE = 32;

function calcMinRun(n) {
  let r = 0;
  while (n >= MIN_MERGE) {
    r |= n & 1;
    n >>= 1;
  }
  return n + r;
}

function* insertionSort(arr, left, right, state) {
  const runIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= left) {
      state.comparisons++;
      yield {
        type: "insertion_sort_in_run",
        payload: {
          ...state,
          array: [...arr],
          run: runIndices,
          i: i,
          j: j,
          step: state.step++,
        },
      };
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        state.swaps++;
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    if (j + 1 !== i) {
      state.swaps++; // Count the final placement as a swap
    }
  }
}

function* merge(arr, l, m, r, state) {
  const len1 = m - l + 1;
  const len2 = r - m;
  const left = new Array(len1);
  const right = new Array(len2);

  for (let i = 0; i < len1; i++) left[i] = arr[l + i];
  for (let i = 0; i < len2; i++) right[i] = arr[m + 1 + i];

  let i = 0, j = 0, k = l;

  while (i < len1 && j < len2) {
    state.comparisons++;
    yield {
      type: "merge_compare",
      payload: {
        ...state,
        array: [...arr],
        compare: [l + i, m + 1 + j],
        step: state.step++,
      },
    };

    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    state.swaps++; // A copy is conceptually similar to a swap/move
    yield {
      type: "merge_copy",
      payload: {
        ...state,
        array: [...arr],
        writeIndex: k,
        step: state.step++,
      },
    };
    k++;
  }

  while (i < len1) {
    arr[k] = left[i];
    state.swaps++;
    yield {
      type: "merge_copy",
      payload: { ...state, array: [...arr], writeIndex: k, step: state.step++ },
    };
    i++;
    k++;
  }

  while (j < len2) {
    arr[k] = right[j];
    state.swaps++;
    yield {
      type: "merge_copy",
      payload: { ...state, array: [...arr], writeIndex: k, step: state.step++ },
    };
    j++;
    k++;
  }
}

export function* timSortGenerator(inputArray) {
  const n = inputArray.length;
  if (n === 0) return;

  const arr = [...inputArray];
  const state = {
    comparisons: 0,
    swaps: 0,
    step: 0,
    totalSteps: 0, // Will be estimated later
  };

  yield { type: "init", payload: { ...state, array: arr } };

  const minRun = calcMinRun(n);
  const runs = [];

  // Phase 1: Find and sort initial runs
  for (let i = 0; i < n; i += minRun) {
    const end = Math.min(i + minRun - 1, n - 1);
    const runIndices = Array.from({ length: end - i + 1 }, (_, k) => i + k);

    yield {
      type: "find_run",
      payload: { ...state, array: [...arr], run: runIndices, step: state.step++ },
    };

    yield* insertionSort(arr, i, end, state);

    runs.push({ start: i, len: end - i + 1 });
    yield {
      type: "push_run",
      payload: { ...state, array: [...arr], runs: [...runs], step: state.step++ },
    };
  }

  // Phase 2: Merge runs
  let size = minRun;
  while (size < n) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);

      if (mid < right) {
        const run1Indices = Array.from({ length: mid - left + 1 }, (_, i) => left + i);
        const run2Indices = Array.from({ length: right - mid }, (_, i) => mid + 1 + i);
        
        yield {
          type: "start_merge",
          payload: { ...state, array: [...arr], run1: run1Indices, run2: run2Indices, step: state.step++ },
        };

        yield* merge(arr, left, mid, right, state);

        yield {
            type: "merge_complete",
            payload: { ...state, array: [...arr], step: state.step++ },
        };
      }
    }
    size *= 2;
  }

  yield { type: "completed", payload: { ...state, array: [...arr], step: state.step++ } };
}