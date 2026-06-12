/**
 * Pure generator function for Insertion Sort algorithm.
 * Yields frames representing the state of the sort.
 * 
 * @param {number[]} initialArray - The array to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* insertionSortGenerator(initialArray) {
  let arr = [...initialArray];
  let n = arr.length;
  let comparisons = 0;
  let shifts = 0;
  let step = 0;
  const totalSteps = Math.floor((n * (n - 1)) / 2);

  yield {
    type: 'init',
    payload: { totalSteps }
  };

  for (let i = 1; i < n; i++) {
    let current = arr[i];
    let j = i - 1;

    yield {
      type: 'phase_start',
      payload: { pass: i, totalPasses: n - 1, i, j, current, arr: [...arr] }
    };

    while (j >= 0) {
      comparisons++;
      step++;

      yield {
        type: 'comparing',
        payload: { i, j, current, arr: [...arr], comparisons, shifts, step, totalSteps }
      };

      if (arr[j] > current) {
        // Shift arr[j] to the right
        arr[j + 1] = arr[j];
        shifts++;

        yield {
          type: 'shifting',
          payload: { i, j, current, arr: [...arr], comparisons, shifts, step, totalSteps }
        };

        j--;
      } else {
        break;
      }
    }

    yield {
      type: 'found_insertion_point',
      payload: { i, j, current, arr: [...arr], comparisons, shifts, step, totalSteps }
    };

    // Insert current element at its correct position
    arr[j + 1] = current;

    yield {
      type: 'inserted',
      payload: { i, j, current, arr: [...arr], comparisons, shifts, step, totalSteps }
    };
  }

  yield { type: 'completed', payload: { arr, comparisons, shifts } };
}
