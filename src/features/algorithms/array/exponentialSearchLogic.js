/**
 * Pure generator function for Exponential Search.
 * First finds the search range by doubling the index,
 * then performs Binary Search within that range.
 */

export function* exponentialSearchGenerator(arr, target) {
  const n = arr.length;

  if (n === 0) {
    yield { type: "not_found" };
    return;
  }

  let step = 0;

  // Check first element
  step++;
  yield {
    type: "range",
    current: 0,
    low: 0,
    high: 0,
    step,
  };

  if (arr[0] === target) {
    yield {
      type: "found",
      index: 0,
      step,
    };
    return;
  }

  // Exponential range finding
  let i = 1;

  while (i < n && arr[i] <= target) {
    step++;

    yield {
      type: "range",
      current: i,
      low: i / 2,
      high: Math.min(i, n - 1),
      step,
    };

    i *= 2;
  }

  let low = Math.floor(i / 2);
  let high = Math.min(i, n - 1);

  // Binary Search within the identified range
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    step++;

    yield {
      type: "binary",
      low,
      high,
      mid,
      step,
    };

    if (arr[mid] === target) {
      yield {
        type: "found",
        index: mid,
        low,
        high,
        mid,
        step,
      };
      return;
    }

    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  yield {
    type: "not_found",
    step,
  };
}