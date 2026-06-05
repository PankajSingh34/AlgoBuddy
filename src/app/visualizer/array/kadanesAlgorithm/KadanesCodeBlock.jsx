"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// 1. Maximum Subarray Sum (Classic Kadane's)
function maxSubarraySum(arr) {
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];

  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  return maxSoFar;
}

// 2. Maximum Subarray Sum with Indices
function maxSubarraySumWithIndices(arr) {
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];
  let start = 0, end = 0, tempStart = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxEndingHere + arr[i]) {
      maxEndingHere = arr[i];
      tempStart = i;
    } else {
      maxEndingHere += arr[i];
    }

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
    }
  }
  return {
    sum: maxSoFar,
    subarray: arr.slice(start, end + 1),
    indices: [start, end]
  };
}

// 3. Maximum Circular Subarray Sum
function maxCircularSubarraySum(arr) {
  const n = arr.length;
  
  // Case 1: Max subarray without wrapping
  let maxNormal = maxSubarraySum(arr);
  
  // Case 2: Max subarray with wrapping = totalSum - minSubarray
  const totalSum = arr.reduce((a, b) => a + b, 0);
  const maxNegative = -Infinity;
  let minEndingHere = arr[0];
  let minSoFar = arr[0];

  for (let i = 1; i < n; i++) {
    minEndingHere = Math.min(arr[i], minEndingHere + arr[i]);
    minSoFar = Math.min(minSoFar, minEndingHere);
  }

  const maxCircular = totalSum - minSoFar;
  
  // Edge case: all negative numbers
  if (maxCircular === 0) return maxNormal;
  
  return Math.max(maxNormal, maxCircular);
}`,

  python: `# 1. Maximum Subarray Sum (Classic Kadane's)
def max_subarray_sum(arr: list[int]) -> int:
    max_so_far = arr[0]
    max_ending_here = arr[0]

    for i in range(1, len(arr)):
        max_ending_here = max(arr[i], max_ending_here + arr[i])
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far

# 2. Maximum Subarray Sum with Indices
def max_subarray_sum_with_indices(arr: list[int]) -> dict:
    max_so_far = arr[0]
    max_ending_here = arr[0]
    start, end, temp_start = 0, 0, 0

    for i in range(1, len(arr)):
        if arr[i] > max_ending_here + arr[i]:
            max_ending_here = arr[i]
            temp_start = i
        else:
            max_ending_here += arr[i]

        if max_ending_here > max_so_far:
            max_so_far = max_ending_here
            start = temp_start
            end = i

    return {
        "sum": max_so_far,
        "subarray": arr[start:end + 1],
        "indices": [start, end]
    }

# 3. Maximum Circular Subarray Sum
def max_circular_subarray_sum(arr: list[int]) -> int:
    # Case 1: Max subarray without wrapping
    max_normal = max_subarray_sum(arr)
    
    # Case 2: Max with wrapping = totalSum - minSubarray
    total_sum = sum(arr)
    max_ending_here = arr[0]
    min_so_far = arr[0]

    for i in range(1, len(arr)):
        max_ending_here = min(arr[i], max_ending_here + arr[i])
        min_so_far = min(min_so_far, max_ending_here)

    max_circular = total_sum - min_so_far
    
    # Edge case: all negative
    if max_circular == 0:
        return max_normal
    
    return max(max_normal, max_circular)`,

  java: `import java.util.*;

class KadaneAlgorithm {

    // 1. Maximum Subarray Sum (Classic Kadane's)
    public int maxSubarraySum(int[] arr) {
        int maxSoFar = arr[0];
        int maxEndingHere = arr[0];

        for (int i = 1; i < arr.length; i++) {
            maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        return maxSoFar;
    }

    // 2. Maximum Subarray Sum with Indices
    public Map<String, Object> maxSubarraySumWithIndices(int[] arr) {
        int maxSoFar = arr[0];
        int maxEndingHere = arr[0];
        int start = 0, end = 0, tempStart = 0;

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > maxEndingHere + arr[i]) {
                maxEndingHere = arr[i];
                tempStart = i;
            } else {
                maxEndingHere += arr[i];
            }

            if (maxEndingHere > maxSoFar) {
                maxSoFar = maxEndingHere;
                start = tempStart;
                end = i;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("sum", maxSoFar);
        result.put("subarray", Arrays.copyOfRange(arr, start, end + 1));
        result.put("indices", new int[]{start, end});
        return result;
    }

    // 3. Maximum Circular Subarray Sum
    public int maxCircularSubarraySum(int[] arr) {
        int maxNormal = maxSubarraySum(arr);
        int totalSum = Arrays.stream(arr).sum();

        int minEndingHere = arr[0];
        int minSoFar = arr[0];

        for (int i = 1; i < arr.length; i++) {
            minEndingHere = Math.min(arr[i], minEndingHere + arr[i]);
            minSoFar = Math.min(minSoFar, minEndingHere);
        }

        int maxCircular = totalSum - minSoFar;
        if (maxCircular == 0) return maxNormal;

        return Math.max(maxNormal, maxCircular);
    }
}`,

  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

// 1. Maximum Subarray Sum (Classic Kadane's)
int maxSubarraySum(vector<int>& arr) {
    int maxSoFar = arr[0];
    int maxEndingHere = arr[0];

    for (int i = 1; i < arr.size(); i++) {
        maxEndingHere = max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}

// 2. Maximum Subarray Sum with Indices
struct Result {
    int sum;
    vector<int> subarray;
    pair<int, int> indices;
};

Result maxSubarraySumWithIndices(vector<int>& arr) {
    int maxSoFar = arr[0];
    int maxEndingHere = arr[0];
    int start = 0, end = 0, tempStart = 0;

    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > maxEndingHere + arr[i]) {
            maxEndingHere = arr[i];
            tempStart = i;
        } else {
            maxEndingHere += arr[i];
        }

        if (maxEndingHere > maxSoFar) {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
        }
    }

    Result result;
    result.sum = maxSoFar;
    result.subarray = vector<int>(arr.begin() + start, arr.begin() + end + 1);
    result.indices = {start, end};
    return result;
}

// 3. Maximum Circular Subarray Sum
int maxCircularSubarraySum(vector<int>& arr) {
    int maxNormal = maxSubarraySum(arr);
    int totalSum = accumulate(arr.begin(), arr.end(), 0);

    int minEndingHere = arr[0];
    int minSoFar = arr[0];

    for (int i = 1; i < arr.size(); i++) {
        minEndingHere = min(arr[i], minEndingHere + arr[i]);
        minSoFar = min(minSoFar, minEndingHere);
    }

    int maxCircular = totalSum - minSoFar;
    if (maxCircular == 0) return maxNormal;

    return max(maxNormal, maxCircular);
}`
};

const fileNames = {
  javascript: "kadane.js",
  python: "kadane.py",
  java: "KadaneAlgorithm.java",
  cpp: "kadane.cpp",
};

const Code = () => {
  return (
    <div>
      <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
      />
    </div>
  );
};

export default Code;