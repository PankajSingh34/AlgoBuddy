/**
 * Pure generator functions for Kadane's Algorithm.
 * Yields state objects representing the algorithm state at each step.
 */

// ─── 1. Maximum Subarray Sum (Classic Kadane's) ───────────────────────────────
export function* generateStatesMaxSubarray(arr) {
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];
  let start = 0;
  let end = 0;
  let tempStart = 0;

  yield {
    index: 0,
    maxEndingHere,
    maxSoFar,
    currentStart: tempStart,
    currentEnd: 0,
    bestStart: start,
    bestEnd: end,
    explanation: `Initialize: maxEndingHere = ${arr[0]}, maxSoFar = ${arr[0]}. Start at index 0.`,
    activeIndex: 0,
    currentWindow: [0, 0],
    bestWindow: [0, 0],
  };

  for (let i = 1; i < arr.length; i++) {
    yield {
      index: i,
      maxEndingHere,
      maxSoFar,
      currentStart: tempStart,
      currentEnd: i,
      bestStart: start,
      bestEnd: end,
      explanation: `Index ${i}: Consider extending current subarray (${maxEndingHere} + ${arr[i]} = ${maxEndingHere + arr[i]}) vs starting fresh (${arr[i]}).`,
      activeIndex: i,
      currentWindow: [tempStart, i - 1],
      bestWindow: [start, end],
      comparing: true,
    };

    if (arr[i] > maxEndingHere + arr[i]) {
      maxEndingHere = arr[i];
      tempStart = i;
      yield {
        index: i,
        maxEndingHere,
        maxSoFar,
        currentStart: tempStart,
        currentEnd: i,
        bestStart: start,
        bestEnd: end,
        explanation: `Starting fresh at index ${i} (${arr[i]}) is better than extending (${maxEndingHere}). Reset subarray.`,
        activeIndex: i,
        currentWindow: [tempStart, i],
        bestWindow: [start, end],
        reset: true,
      };
    } else {
      maxEndingHere = maxEndingHere + arr[i];
      yield {
        index: i,
        maxEndingHere,
        maxSoFar,
        currentStart: tempStart,
        currentEnd: i,
        bestStart: start,
        bestEnd: end,
        explanation: `Extend current subarray to include ${arr[i]}. maxEndingHere = ${maxEndingHere}.`,
        activeIndex: i,
        currentWindow: [tempStart, i],
        bestWindow: [start, end],
      };
    }

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
      yield {
        index: i,
        maxEndingHere,
        maxSoFar,
        currentStart: start,
        currentEnd: end,
        bestStart: start,
        bestEnd: end,
        explanation: `🆕 New maximum found! maxSoFar = ${maxSoFar}. Best subarray: indices [${start}, ${end}].`,
        activeIndex: i,
        currentWindow: [start, end],
        bestWindow: [start, end],
        newMax: true,
      };
    }
  }

  yield {
    index: arr.length - 1,
    maxEndingHere,
    maxSoFar,
    currentStart: start,
    currentEnd: end,
    bestStart: start,
    bestEnd: end,
    explanation: `Finished. Maximum subarray sum = ${maxSoFar}, subarray = [${arr.slice(start, end + 1).join(', ')}] (indices ${start}–${end}).`,
    activeIndex: arr.length - 1,
    currentWindow: [start, end],
    bestWindow: [start, end],
    done: true,
  };
}

// ─── 2. Maximum Circular Subarray Sum ────────────────────────────────────────
export function* generateStatesCircularSubarray(arr) {
  const n = arr.length;

  // Step 1: Run normal Kadane's
  yield {
    index: -1,
    maxEndingHere: null,
    maxSoFar: null,
    phase: 'normal',
    explanation: `Phase 1: Run normal Kadane's to find max subarray sum (non-circular case).`,
    currentWindow: [],
    bestWindow: [],
    phaseLabel: 'Normal Kadane\'s',
  };

  let maxNormal = arr[0];
  let curMax = arr[0];

  for (let i = 1; i < n; i++) {
    curMax = Math.max(arr[i], curMax + arr[i]);
    maxNormal = Math.max(maxNormal, curMax);

    yield {
      index: i,
      maxEndingHere: curMax,
      maxSoFar: maxNormal,
      phase: 'normal',
      explanation: `Normal Kadane's at index ${i} (${arr[i]}): curMax = ${curMax}, maxNormal = ${maxNormal}.`,
      activeIndex: i,
      currentWindow: [0, i],
      bestWindow: [],
      phaseLabel: 'Normal Kadane\'s',
    };
  }

  yield {
    index: n - 1,
    maxEndingHere: curMax,
    maxSoFar: maxNormal,
    phase: 'normal',
    explanation: `Phase 1 complete. Max non-circular subarray sum = ${maxNormal}.`,
    currentWindow: [0, n - 1],
    bestWindow: [],
    phaseLabel: 'Normal Kadane\'s',
  };

  // Step 2: Find max circular using total sum - min subarray
  yield {
    index: -1,
    maxEndingHere: null,
    maxSoFar: maxNormal,
    phase: 'circular',
    explanation: `Phase 2: Find max circular sum = totalSum - minSubarraySum. Run Kadane's for minimum subarray.`,
    currentWindow: [],
    bestWindow: [],
    phaseLabel: 'Circular Check',
  };

  const totalSum = arr.reduce((a, b) => a + b, 0);
  let minSoFar = arr[0];
  let curMin = arr[0];

  for (let i = 1; i < n; i++) {
    curMin = Math.min(arr[i], curMin + arr[i]);
    minSoFar = Math.min(minSoFar, curMin);

    yield {
      index: i,
      maxEndingHere: curMin,
      maxSoFar: maxNormal,
      phase: 'circular',
      explanation: `Min Kadane's at index ${i} (${arr[i]}): curMin = ${curMin}, minSoFar = ${minSoFar}. totalSum = ${totalSum}.`,
      activeIndex: i,
      currentWindow: [0, i],
      bestWindow: [],
      phaseLabel: 'Circular Check',
    };
  }

  const maxCircular = totalSum - minSoFar;
  const result = maxCircular > maxNormal ? maxCircular : maxNormal;

  yield {
    index: n - 1,
    maxEndingHere: curMin,
    maxSoFar: result,
    phase: 'circular',
    explanation: `Phase 2 complete. maxCircular = totalSum(${totalSum}) - minSubarray(${minSoFar}) = ${maxCircular}.`,
    currentWindow: [0, n - 1],
    bestWindow: [],
    phaseLabel: 'Circular Check',
  };

  yield {
    index: n - 1,
    maxEndingHere: curMin,
    maxSoFar: result,
    phase: 'done',
    explanation: `Finished. Answer = max(maxNormal=${maxNormal}, maxCircular=${maxCircular}) = ${result}.`,
    currentWindow: [0, n - 1],
    bestWindow: [0, n - 1],
    phaseLabel: 'Complete',
    done: true,
  };
}