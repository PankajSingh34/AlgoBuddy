"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const ternarySearchQuestions = [
  {
    question: "What is the main requirement for applying Ternary Search?",
    options: [
      "The array must be sorted.",
      "The array must be unsorted.",
      "The array must contain distinct elements.",
      "The array size must be a power of 3.",
    ],
    answer: "The array must be sorted.",
    explanation:
      "Ternary Search works correctly only on sorted arrays because it repeatedly narrows the search range based on element ordering.",
  },
  {
    question: "How many middle indices are calculated in Ternary Search?",
    options: ["1", "2", "3", "4"],
    answer: "2",
    explanation:
      "Ternary Search divides the search space into three parts using two middle indices: mid1 and mid2.",
  },
  {
    question: "What is the average time complexity of Ternary Search?",
    options: [
      "O(n)",
      "O(log₃ n)",
      "O(log₂ n)",
      "O(n log n)",
    ],
    answer: "O(log₃ n)",
    explanation:
      "Ternary Search reduces the search space to one-third in every iteration, resulting in O(log₃ n) complexity.",
  },
  {
    question: "If the target is smaller than arr[mid1], where should the search continue?",
    options: [
      "Left third",
      "Middle third",
      "Right third",
      "Entire array",
    ],
    answer: "Left third",
    explanation:
      "When the target is less than arr[mid1], it can only exist in the left third of the array.",
  },
  {
    question: "If the target is greater than arr[mid2], where should the search continue?",
    options: [
      "Left third",
      "Middle third",
      "Right third",
      "Search stops",
    ],
    answer: "Right third",
    explanation:
      "Values greater than arr[mid2] can only appear in the right third of the sorted array.",
  },
  {
    question: "When is the middle third searched?",
    options: [
      "When target lies between arr[mid1] and arr[mid2].",
      "When target is less than arr[mid1].",
      "When target is greater than arr[mid2].",
      "Never.",
    ],
    answer: "When target lies between arr[mid1] and arr[mid2].",
    explanation:
      "If the target is between the two middle elements, only the middle third needs to be searched.",
  },
  {
    question: "What is the space complexity of iterative Ternary Search?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)",
    ],
    answer: "O(1)",
    explanation:
      "The iterative implementation uses only a few variables regardless of input size.",
  },
  {
    question: "Compared to Binary Search, Ternary Search uses:",
    options: [
      "One midpoint",
      "Two midpoints",
      "Three midpoints",
      "No midpoint",
    ],
    answer: "Two midpoints",
    explanation:
      "Binary Search uses one midpoint, while Ternary Search calculates two middle positions.",
  },
  {
    question: "Which searching algorithm generally performs better in practice on sorted arrays?",
    options: [
      "Linear Search",
      "Binary Search",
      "Ternary Search",
      "Jump Search",
    ],
    answer: "Binary Search",
    explanation:
      "Although Ternary Search divides the array into three parts, Binary Search usually performs fewer comparisons and is faster in practice.",
  },
  {
    question: "What happens if the target is not found?",
    options: [
      "The algorithm returns -1.",
      "The algorithm returns 0.",
      "The algorithm returns the nearest element.",
      "The algorithm throws an exception.",
    ],
    answer: "The algorithm returns -1.",
    explanation:
      "When the search range becomes empty, Ternary Search returns -1 to indicate the target does not exist.",
  },
  {
  question: "Into how many parts does Ternary Search divide a sorted array?",
  options: [
    "2",
    "3",
    "4",
    "5",
  ],
  answer: "3",
  explanation:
    "Ternary Search divides the search space into three nearly equal parts using two middle indices.",
},
{
  question: "Which formula is used to calculate the first middle index (mid1)?",
  options: [
    "left + (right - left) / 3",
    "(left + right) / 2",
    "right - (right - left) / 3",
    "left / 3",
  ],
  answer: "left + (right - left) / 3",
  explanation:
    "mid1 is calculated as left + (right - left) / 3.",
},
{
  question: "Which formula is used to calculate the second middle index (mid2)?",
  options: [
    "left + (right - left) / 3",
    "(left + right) / 2",
    "right - (right - left) / 3",
    "right / 3",
  ],
  answer: "right - (right - left) / 3",
  explanation:
    "mid2 is calculated from the right side of the current search interval.",
},
{
  question: "What is checked first during each iteration of Ternary Search?",
  options: [
    "Whether the array is sorted",
    "Whether the target equals arr[mid1] or arr[mid2]",
    "Whether the array contains duplicates",
    "Whether the array length is divisible by 3",
  ],
  answer: "Whether the target equals arr[mid1] or arr[mid2]",
  explanation:
    "The algorithm first compares the target with both middle elements before deciding which third to search.",
},
{
  question: "What happens if the target lies between arr[mid1] and arr[mid2]?",
  options: [
    "Search continues in the middle third",
    "Search continues in the left third",
    "Search continues in the right third",
    "The search stops immediately",
  ],
  answer: "Search continues in the middle third",
  explanation:
    "Only the middle third can contain the target in this case.",
},
{
  question: "Which searching strategy does Ternary Search use?",
  options: [
    "Divide and Conquer",
    "Greedy",
    "Dynamic Programming",
    "Backtracking",
  ],
  answer: "Divide and Conquer",
  explanation:
    "Ternary Search repeatedly divides the search interval into smaller parts.",
},
{
  question: "Which of the following data structures is Ternary Search primarily used on?",
  options: [
    "Sorted arrays",
    "Stacks",
    "Queues",
    "Graphs",
  ],
  answer: "Sorted arrays",
  explanation:
    "Ternary Search requires direct index access and sorted data.",
},
{
  question: "How many comparisons with middle elements can occur in one iteration?",
  options: [
    "1",
    "2",
    "3",
    "4",
  ],
  answer: "2",
  explanation:
    "The algorithm compares the target with both mid1 and mid2.",
},
{
  question: "Why is Binary Search often preferred over Ternary Search in practice?",
  options: [
    "It requires fewer comparisons per iteration.",
    "It works on unsorted arrays.",
    "It uses recursion only.",
    "It has O(1) worst-case complexity.",
  ],
  answer: "It requires fewer comparisons per iteration.",
  explanation:
    "Although Ternary Search divides into three parts, Binary Search generally performs fewer comparisons and is usually faster.",
},
{
  question: "What value is typically returned when the target element is not present?",
  options: [
    "-1",
    "0",
    "1",
    "NULL",
  ],
  answer: "-1",
  explanation:
    "Returning -1 is the standard way to indicate that the target element was not found.",
}
];

export default function TernarySearchQuiz() {
  return (
    <QuizEngine
      title="Ternary Search Quiz"
      questions={ternarySearchQuestions}
    />
  );
}