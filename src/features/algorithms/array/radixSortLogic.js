/**
 * Pure generator function for Radix Sort algorithm.
 * Yields frames representing each step of the sort.
 *
 * @param {number[]} initialArray - The array of non-negative integers to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* radixSortGenerator(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  if (n === 0) return;

  const DIGIT_PLACE_LABELS = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
  const maxVal = Math.max(...arr);
  const numPasses = maxVal === 0 ? 1 : Math.floor(Math.log10(maxVal)) + 1;

  let comparisons = 0;
  let step = 0;
  // Total steps: for each pass, n placements into buckets + n collections back
  const totalSteps = numPasses * n * 2;

  yield {
    type: 'init',
    payload: {
      arr: [...arr],
      digit: 1,
      digitPlace: 'ones',
      activeIndex: -1,
      buckets: Array.from({ length: 10 }, () => []),
      comparisons: 0,
      swaps: 0,
      step: 0,
      totalSteps,
      stepExplanation: 'Ready to start Radix Sort.',
    },
  };

  let swaps = 0;
  let digit = 1;

  for (let pass = 0; pass < numPasses; pass++) {
    const digitPlace = DIGIT_PLACE_LABELS[pass] ?? `10^${pass}`;
    const buckets = Array.from({ length: 10 }, () => []);

    yield {
      type: 'digit_pass',
      payload: {
        arr: [...arr],
        digit,
        digitPlace,
        activeIndex: -1,
        buckets: buckets.map((b) => [...b]),
        comparisons,
        swaps,
        step,
        totalSteps,
        stepExplanation: `Pass ${pass + 1}: Sorting by ${digitPlace} digit (place value ${digit}).`,
      },
    };

    // Place each element into its bucket
    for (let i = 0; i < n; i++) {
      const bucketIndex = Math.floor(arr[i] / digit) % 10;
      comparisons++;
      step++;

      yield {
        type: 'counting',
        payload: {
          arr: [...arr],
          digit,
          digitPlace,
          activeIndex: i,
          buckets: buckets.map((b) => [...b]),
          comparisons,
          swaps,
          step,
          totalSteps,
          stepExplanation: `Placing ${arr[i]} into bucket ${bucketIndex} (${digitPlace} digit = ${bucketIndex}).`,
        },
      };

      buckets[bucketIndex].push(arr[i]);

      yield {
        type: 'counting',
        payload: {
          arr: [...arr],
          digit,
          digitPlace,
          activeIndex: i,
          buckets: buckets.map((b) => [...b]),
          comparisons,
          swaps,
          step,
          totalSteps,
          stepExplanation: `Placed ${arr[i]} into bucket ${bucketIndex}.`,
        },
      };
    }

    // Collect elements back from buckets into arr
    let idx = 0;
    for (let b = 0; b < 10; b++) {
      for (let j = 0; j < buckets[b].length; j++) {
        arr[idx] = buckets[b][j];
        swaps++;
        step++;
        idx++;

        yield {
          type: 'output',
          payload: {
            arr: [...arr],
            digit,
            digitPlace,
            activeIndex: idx - 1,
            buckets: buckets.map((bkt) => [...bkt]),
            comparisons,
            swaps,
            step,
            totalSteps,
            stepExplanation: `Collecting from bucket ${b}: placing ${buckets[b][j]} at array position ${idx - 1}.`,
          },
        };
      }
    }

    digit *= 10;
  }

  yield {
    type: 'done',
    payload: {
      arr: [...arr],
      digit,
      digitPlace: 'done',
      activeIndex: -1,
      buckets: Array.from({ length: 10 }, () => []),
      comparisons,
      swaps,
      step,
      totalSteps,
      stepExplanation: 'Array is fully sorted using Radix Sort!',
    },
  };
}