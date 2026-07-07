/**
 * Pure generator function for Jump Search algorithm.
 * Yields frames representing the state of the search.
 *
 * @param {number[]} arr
 * @param {number} targetValue
 */
export function* jumpSearchGenerator(arr, targetValue) {
  const n = arr.length;

  if (n === 0) {
    yield { type: "not_found" };
    return;
  }

  const stepSize = Math.floor(Math.sqrt(n));

  let prev = 0;
  let step = stepSize;
  let iteration = 0;

  // Jump phase
  while (prev < n && arr[Math.min(step, n) - 1] < targetValue) {
    iteration++;

    yield {
      type: "jump",
      prev,
      step: Math.min(step, n),
      current: Math.min(step, n) - 1,
      iteration,
      value: arr[Math.min(step, n) - 1],
    };

    prev = step;
    step += stepSize;

    if (prev >= n) {
      yield {
        type: "not_found",
      };
      return;
    }
  }

  // Block found
  yield {
    type: "block_found",
    prev,
    step: Math.min(step, n),
    iteration,
  };

  // Linear search phase
  while (prev < Math.min(step, n)) {
    iteration++;

    yield {
      type: "checking",
      index: prev,
      iteration,
      value: arr[prev],
    };

    if (arr[prev] === targetValue) {
      yield {
        type: "found",
        index: prev,
        iteration,
      };
      return;
    }

    prev++;
  }

  yield {
    type: "not_found",
  };
}