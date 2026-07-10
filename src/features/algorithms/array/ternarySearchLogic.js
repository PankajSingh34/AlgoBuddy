/**
 * Pure generator function for Ternary Search algorithm.
 * Yields frames representing the state of the search.
 *
 * @param {number[]} arr - Sorted array
 * @param {number} targetValue - Value to search
 */
export function* ternarySearchGenerator(arr, targetValue) {
  let l = 0;
  let h = arr.length - 1;
  let step = 0;

  while (l <= h) {
    step++;

    const mid1 = l + Math.floor((h - l) / 3);
    const mid2 = h - Math.floor((h - l) / 3);

    yield {
      type: "checking",
      l,
      h,
      mid1,
      mid2,
      step,
      arrMid1: arr[mid1],
      arrMid2: arr[mid2],
    };

    if (arr[mid1] === targetValue) {
      yield {
        type: "found_mid1",
        mid1,
        step,
      };
      return;
    }

    if (arr[mid2] === targetValue) {
      yield {
        type: "found_mid2",
        mid2,
        step,
      };
      return;
    }

    if (targetValue < arr[mid1]) {
      yield {
        type: "discard_right_two_thirds",
        mid1,
        mid2,
        step,
      };

      h = mid1 - 1;
    } else if (targetValue > arr[mid2]) {
      yield {
        type: "discard_left_two_thirds",
        mid1,
        mid2,
        step,
      };

      l = mid2 + 1;
    } else {
      yield {
        type: "discard_outer_thirds",
        mid1,
        mid2,
        step,
      };

      l = mid1 + 1;
      h = mid2 - 1;
    }
  }

  yield {
    type: "not_found",
  };
}