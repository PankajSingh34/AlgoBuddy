/**
 * Pure generator function for Binary Search algorithm.
 * Yields frames representing the state of the search.
 * 
 * @param {number[]} arr - The sorted array to search through.
 * @param {number} targetValue - The value to search for.
 * @returns {Generator<{type: string, l?: number, h?: number, m?: number, step?: number, arrM?: number}, void, unknown>}
 */
export function* binarySearchGenerator(arr, targetValue) {
  let l = 0;
  let h = arr.length - 1;
  let step = 0;

  while (l <= h) {
    const m = Math.floor((l + h) / 2);
    step++;

    // Stage 1: Highlight mid and search range
    yield {
      type: 'checking',
      l,
      h,
      m,
      step,
      arrM: arr[m]
    };

    // Stage 2: Result of comparison
    if (arr[m] === targetValue) {
      yield { type: 'found', m, step };
      return;
    } else if (arr[m] < targetValue) {
      yield { type: 'discard_left', m, step };
      l = m + 1;
    } else {
      yield { type: 'discard_right', m, step };
      h = m - 1;
    }
  }

  yield { type: 'not_found' };
}
