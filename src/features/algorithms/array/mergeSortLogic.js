/**
 * Pure generator function for Merge Sort algorithm.
 * Yields frames representing the state of the sort.
 * 
 * @param {number[]} initialArray - The array to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* mergeSortGenerator(initialArray) {
  let arr = [...initialArray];
  let n = arr.length;
  let comparisons = 0;
  let merges = 0; // mapped to 'swaps' in the UI
  let step = 0;
  const totalSteps = Math.floor(n * Math.ceil(Math.log2(n || 1)));

  yield {
    type: 'init',
    payload: { totalSteps }
  };

  yield* mergeSortHelper(arr, 0, n - 1, 0, []);

  yield { type: 'completed', payload: { arr, comparisons, merges } };

  function* mergeSortHelper(arr, l, r, level, path) {
    if (l >= r) return;
    const currentPath = [...path, { l, r }];
    const m = l + Math.floor((r - l) / 2);

    yield {
      type: 'divide',
      payload: { l, r, m, level, currentPath, arr: [...arr] }
    };

    yield* mergeSortHelper(arr, l, m, level + 1, currentPath);
    yield* mergeSortHelper(arr, m + 1, r, level + 1, currentPath);
    yield* merge(arr, l, m, r);
  }

  function* merge(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0, j = 0, k = l;

    yield {
      type: 'merge_start',
      payload: { l, m, r, arr: [...arr] }
    };

    while (i < n1 && j < n2) {
      comparisons++;
      step++;

      yield {
        type: 'comparing',
        payload: { l, m, r, k, leftCompareIdx: l + i, rightCompareIdx: m + 1 + j, LVal: L[i], RVal: R[j], arr: [...arr], comparisons, merges, step, totalSteps }
      };

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        merges++;
        yield {
          type: 'merged',
          payload: { l, m, r, k, val: L[i], fromLeft: true, arr: [...arr], comparisons, merges, step, totalSteps }
        };
        i++;
      } else {
        arr[k] = R[j];
        merges++;
        yield {
          type: 'merged',
          payload: { l, m, r, k, val: R[j], fromLeft: false, arr: [...arr], comparisons, merges, step, totalSteps }
        };
        j++;
      }
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      merges++;
      yield {
        type: 'merged_remainder',
        payload: { l, m, r, k, val: L[i], fromLeft: true, arr: [...arr], comparisons, merges, step, totalSteps }
      };
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      merges++;
      yield {
        type: 'merged_remainder',
        payload: { l, m, r, k, val: R[j], fromLeft: false, arr: [...arr], comparisons, merges, step, totalSteps }
      };
      j++;
      k++;
    }
  }
}
