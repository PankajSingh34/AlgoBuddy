/**
 * Pure generator function for Interpolation Search.
 * Yields frames representing each step of the search.
 */

export function* interpolationSearchGenerator(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  let step = 0;

  while (
    low <= high &&
    target >= arr[low] &&
    target <= arr[high]
  ) {
    step++;

    if (low === high) {
      yield {
        type: "checking",
        low,
        high,
        pos: low,
        step,
      };

      if (arr[low] === target) {
        yield {
          type: "found",
          low,
          high,
          pos: low,
          step,
        };
      } else {
        yield {
          type: "not_found",
          step,
        };
      }

      return;
    }

    const pos =
      low +
      Math.floor(
        ((target - arr[low]) * (high - low)) /
          (arr[high] - arr[low])
      );

    yield {
      type: "checking",
      low,
      high,
      pos,
      step,
    };

    if (arr[pos] === target) {
      yield {
        type: "found",
        low,
        high,
        pos,
        step,
      };

      return;
    }

    if (arr[pos] < target) {
      yield {
        type: "move_right",
        low,
        high,
        pos,
        step,
      };

      low = pos + 1;
    } else {
      yield {
        type: "move_left",
        low,
        high,
        pos,
        step,
      };

      high = pos - 1;
    }
  }

  yield {
    type: "not_found",
    step,
  };
}