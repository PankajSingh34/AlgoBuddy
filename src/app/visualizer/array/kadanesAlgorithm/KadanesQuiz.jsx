"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const kadaneQuestions = [
  {
    question: "What is the time complexity of Kadane's Algorithm compared to a brute-force approach for finding maximum subarray sum?",
    options: [
      "O(N³) — same as brute force",
      "O(N²) — using dynamic programming",
      "O(N log N) — requires sorting",
      "O(N) — each element visited once"
    ],
    correctAnswer: 3,
    explanation: "Kadane's Algorithm is a greedy dynamic programming approach that visits each element exactly once, achieving O(N) time complexity. Brute force would be O(N³) or O(N²) depending on implementation."
  },
  {
    question: "In Kadane's Algorithm, what is the purpose of tracking both maxEndingHere and maxSoFar?",
    options: [
      "maxEndingHere tracks the global maximum; maxSoFar tracks the current sum.",
      "maxEndingHere tracks the best sum ending at current index; maxSoFar tracks the overall maximum seen so far.",
      "They are redundant; only one is needed.",
      "maxEndingHere prevents negative numbers; maxSoFar handles positive numbers."
    ],
    correctAnswer: 1,
    explanation: "maxEndingHere = max sum of subarray ending at index i. maxSoFar = best answer found so far. At each step, maxEndingHere is updated, and if it exceeds maxSoFar, we update maxSoFar."
  },
  {
    question: "When should Kadane's Algorithm reset maxEndingHere to the current element?",
    options: [
      "When the current element is greater than maxEndingHere + current element",
      "When the current element is negative",
      "When the sum exceeds the total array sum",
      "After every third element"
    ],
    correctAnswer: 0,
    explanation: "If starting fresh (just taking the current element) gives a larger sum than extending the previous subarray, we reset. This is the greedy decision: arr[i] > maxEndingHere + arr[i]."
  },
  {
    question: "What does the Maximum Circular Subarray variant compute using totalSum - minSubarraySum?",
    options: [
      "The maximum sum if the array must form a circle.",
      "The remaining elements after removing the minimum subarray, which wraps around.",
      "A check to ensure no overflow occurs.",
      "The sum of all negative elements."
    ],
    correctAnswer: 1,
    explanation: "For circular subarrays, the best wrap-around solution = total sum minus the minimum subarray. This accounts for subarrays that 'skip' the minimum middle section and wrap from end to start."
  },
  {
    question: "Given arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4], what is the maximum subarray sum and which subarray achieves it?",
    options: [
      "Sum = 4, subarray = [4]",
      "Sum = 6, subarray = [4, -1, 2, 1]",
      "Sum = 8, subarray = [1, -3, 4, -1, 2, 1]",
      "Sum = 5, subarray = [-2, 1, -3, 4, -1, 2, 1]"
    ],
    correctAnswer: 1,
    explanation: "Tracing Kadane's: [4] gives 4, then [4, -1] gives 3, then [4, -1, 2] gives 5, then [4, -1, 2, 1] gives 6. The maximum subarray sum is 6."
  },
  {
    question: "Why must we handle the edge case where all array elements are negative in the Maximum Circular variant?",
    options: [
      "Negative elements cannot be part of any valid subarray.",
      "maxCircular = totalSum - minSubarray becomes totalSum (all elements), which equals maxNormal. We must return maxNormal to avoid selecting an empty subarray.",
      "Circular logic doesn't apply to negative numbers.",
      "The algorithm requires a preprocessing sort."
    ],
    correctAnswer: 1,
    explanation: "If all elements are negative, minSoFar = totalSum (minimum subarray = entire array). So maxCircular = totalSum - totalSum = 0, which means 'empty subarray'. We must return maxNormal (the single least negative element) instead."
  }
];

const Quiz = () => {
  return <QuizEngine title="Kadane's Algorithm Quiz" questions={kadaneQuestions} />;
};

export default Quiz;