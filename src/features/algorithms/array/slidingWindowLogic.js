/**
 * Pure generator functions for various Sliding Window algorithms.
 * Yields state objects representing the window at each step.
 */

export function* generateStatesFixedMax(arr, k) {
  let max_sum = -Infinity;
  let window_sum = 0;

  for (let i = 0; i < k; i++) {
    window_sum += arr[i];
    yield {
      left: 0, right: i, current: window_sum, best: max_sum === -Infinity ? "None" : max_sum,
      explanation: `Expanding initial window: Adding ${arr[i]} at index ${i}. Current sum: ${window_sum}.`,
      activeWindow: [0, i]
    };
  }
  
  max_sum = window_sum;
  yield {
    left: 0, right: k - 1, current: window_sum, best: max_sum,
    explanation: `Initial window of size ${k} complete. Best sum so far: ${max_sum}.`,
    activeWindow: [0, k - 1]
  };

  for (let i = k; i < arr.length; i++) {
    const leftIdx = i - k;
    yield {
      left: leftIdx, right: i, current: window_sum, best: max_sum,
      explanation: `Sliding window forward. Preparing to remove ${arr[leftIdx]} and add ${arr[i]}.`,
      activeWindow: [leftIdx, i]
    };

    window_sum = window_sum - arr[leftIdx] + arr[i];
    const new_max = Math.max(max_sum, window_sum);
    const updated = new_max > max_sum;
    max_sum = new_max;

    yield {
      left: leftIdx + 1, right: i, current: window_sum, best: max_sum,
      explanation: `Slid window: Removed ${arr[leftIdx]}, Added ${arr[i]}. New sum: ${window_sum}. ${updated ? 'New maximum found!' : ''}`,
      activeWindow: [leftIdx + 1, i]
    };
  }

  yield {
    left: arr.length - k, right: arr.length - 1, current: window_sum, best: max_sum,
    explanation: `Finished. Maximum sum of subarray of size ${k} is ${max_sum}.`,
    activeWindow: [arr.length - k, arr.length - 1],
    done: true
  };
}

export function* generateStatesFixedAvg(arr, k) {
  const result = [];
  let window_sum = 0;

  for (let i = 0; i < k; i++) {
    window_sum += arr[i];
    yield {
      left: 0, right: i, current: (window_sum/(i+1)).toFixed(2), best: "N/A",
      explanation: `Expanding initial window: Adding ${arr[i]}. Current sum: ${window_sum}.`,
      activeWindow: [0, i]
    };
  }
  
  result.push((window_sum / k).toFixed(2));
  yield {
    left: 0, right: k - 1, current: (window_sum/k).toFixed(2), best: `Averages: [${result.join(', ')}]`,
    explanation: `Initial window complete. First average: ${(window_sum/k).toFixed(2)}.`,
    activeWindow: [0, k - 1]
  };

  for (let i = k; i < arr.length; i++) {
    const leftIdx = i - k;
    window_sum = window_sum - arr[leftIdx] + arr[i];
    result.push((window_sum / k).toFixed(2));

    yield {
      left: leftIdx + 1, right: i, current: (window_sum/k).toFixed(2), best: `Averages: [${result.join(', ')}]`,
      explanation: `Slid window: Removed ${arr[leftIdx]}, Added ${arr[i]}. New average: ${(window_sum/k).toFixed(2)}.`,
      activeWindow: [leftIdx + 1, i]
    };
  }
  
  yield {
    left: arr.length - k, right: arr.length - 1, current: (window_sum/k).toFixed(2), best: `Averages: [${result.join(', ')}]`,
    explanation: `Finished calculating all averages of subarrays of size ${k}.`,
    activeWindow: [arr.length - k, arr.length - 1],
    done: true
  };
}

export function* generateStatesVarLongestSub(s) {
  let charSet = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    yield {
      left, right, current: Array.from(charSet).join(''), best: maxLength,
      explanation: `Right pointer at '${s[right]}'. Checking if it's already in the window.`,
      activeWindow: [left, right]
    };

    while (charSet.has(s[right])) {
      yield {
        left, right, current: Array.from(charSet).join(''), best: maxLength,
        explanation: `Duplicate '${s[right]}' found! Shrinking window from left to remove '${s[left]}'.`,
        activeWindow: [left, right],
        violation: true
      };
      charSet.delete(s[left]);
      left++;
    }
    
    charSet.add(s[right]);
    const updated = (right - left + 1) > maxLength;
    maxLength = Math.max(maxLength, right - left + 1);

    yield {
      left, right, current: s.substring(left, right + 1), best: maxLength,
      explanation: `Added '${s[right]}' to window. Current valid substring: "${s.substring(left, right + 1)}". ${updated ? 'New max length!' : ''}`,
      activeWindow: [left, right]
    };
  }

  yield {
    left, right: s.length - 1, current: s.substring(left, s.length), best: maxLength,
    explanation: `Finished processing. Longest substring without repeating characters has length ${maxLength}.`,
    activeWindow: [left, s.length - 1],
    done: true
  };
}

export function* generateStatesVarSmallestSub(arr, target) {
  let left = 0;
  let window_sum = 0;
  let min_length = Infinity;

  for (let right = 0; right < arr.length; right++) {
    window_sum += arr[right];
    
    yield {
      left, right, current: window_sum, best: min_length === Infinity ? "None" : min_length,
      explanation: `Expanding right pointer: Added ${arr[right]}. Current sum: ${window_sum}.`,
      activeWindow: [left, right]
    };

    while (window_sum >= target) {
      const updated = (right - left + 1) < min_length;
      min_length = Math.min(min_length, right - left + 1);
      
      yield {
        left, right, current: window_sum, best: min_length,
        explanation: `Sum ${window_sum} >= target ${target}! ${updated ? 'New minimum length found!' : ''} Shrinking from left to find smaller valid window.`,
        activeWindow: [left, right],
        success: true
      };
      
      window_sum -= arr[left];
      left++;
      
      if (left <= right) {
        yield {
          left, right, current: window_sum, best: min_length,
          explanation: `Shrunk window: removed ${arr[left-1]}. New sum: ${window_sum}.`,
          activeWindow: [left, right]
        };
      }
    }
  }

  yield {
    left, right: arr.length - 1, current: window_sum, best: min_length === Infinity ? 0 : min_length,
    explanation: `Finished. Smallest subarray with sum >= ${target} has length ${min_length === Infinity ? 0 : min_length}.`,
    activeWindow: [Math.max(0, left-1), arr.length - 1], // Just for final display
    done: true
  };
}
