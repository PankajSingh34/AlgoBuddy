/**
 * Fibonacci Search Generator
 */
export function* fibonacciSearchGenerator(arr, target) {
  const n = arr.length;

  let fibMMm2 = 0;
  let fibMMm1 = 1;
  let fibM = fibMMm1 + fibMMm2;

  while (fibM < n) {
    fibMMm2 = fibMMm1;
    fibMMm1 = fibM;
    fibM = fibMMm1 + fibMMm2;
  }

  let offset = -1;
  let step = 0;

  while (fibM > 1) {
    const i = Math.min(offset + fibMMm2, n - 1);
    step++;

    yield {
      type: "checking",
      i,
      value: arr[i],
      offset,
      step,
    };

    if (arr[i] < target) {
      yield {
        type: "move_right",
        i,
        offset,
        step,
      };

      fibM = fibMMm1;
      fibMMm1 = fibMMm2;
      fibMMm2 = fibM - fibMMm1;
      offset = i;
    } else if (arr[i] > target) {
      yield {
        type: "move_left",
        i,
        offset,
        step,
      };

      fibM = fibMMm2;
      fibMMm1 = fibMMm1 - fibMMm2;
      fibMMm2 = fibM - fibMMm1;
    } else {
      yield {
        type: "found",
        i,
        offset,
        step,
      };
      return;
    }
  }

  if (
    fibMMm1 &&
    offset + 1 < n &&
    arr[offset + 1] === target
  ) {
    yield {
      type: "found",
      i: offset + 1,
      offset,
      step: step + 1,
    };
    return;
  }

  yield {
    type: "not_found",
    step: step + 1,
  };
}