"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const CountingSortQuiz = () => {
  const questions = [
    {
      question: "What is the basic idea behind Counting Sort?",
      options: [
        "Compare adjacent elements repeatedly",
        "Count the occurrences of each value",
        "Divide the array into smaller arrays",
        "Build a binary heap",
      ],
      correctAnswer: 1,
      explanation:
        "Counting Sort works by counting how many times each value appears and then reconstructing the sorted array.",
    },
    {
      question: "Counting Sort is most efficient when:",
      options: [
        "The input values are within a small range",
        "The array is already sorted",
        "The array contains floating-point numbers",
        "The array has no duplicate values",
      ],
      correctAnswer: 0,
      explanation:
        "Counting Sort performs best when the range of input values is relatively small.",
    },
    {
      question: "What is the average time complexity of Counting Sort?",
      options: [
        "O(n²)",
        "O(n log n)",
        "O(n + k)",
        "O(log n)",
      ],
      correctAnswer: 2,
      explanation:
        "Counting Sort has a time complexity of O(n + k), where n is the number of elements and k is the range of input values.",
    },
    {
      question: "What does 'k' represent in the complexity O(n + k)?",
      options: [
        "Number of comparisons",
        "Range of input values",
        "Number of recursive calls",
        "Output array size",
      ],
      correctAnswer: 1,
      explanation:
        "k represents the range of possible input values.",
    },
    {
      question: "Counting Sort belongs to which category?",
      options: [
        "Comparison-based sorting",
        "Non-comparison sorting",
        "Divide and Conquer",
        "Recursive sorting",
      ],
      correctAnswer: 1,
      explanation:
        "Counting Sort is a non-comparison sorting algorithm.",
    },
    {
      question: "Which auxiliary data structure is used in Counting Sort?",
      options: [
        "Stack",
        "Queue",
        "Count Array",
        "Binary Heap",
      ],
      correctAnswer: 2,
      explanation:
        "A Count Array stores the frequency of each value in the input.",
    },
    {
      question: "Why is Counting Sort considered stable?",
      options: [
        "Because it uses recursion",
        "Because equal elements preserve their relative order",
        "Because it performs comparisons",
        "Because it sorts in-place",
      ],
      correctAnswer: 1,
      explanation:
        "A stable sorting algorithm keeps equal elements in the same relative order as the input.",
    },
    {
      question: "What is the auxiliary space complexity of Counting Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n + k)",
        "O(n²)",
      ],
      correctAnswer: 2,
      explanation:
        "Extra memory is needed for the count array and output array.",
    },
    {
      question: "What is the first step of Counting Sort?",
      options: [
        "Choose a pivot",
        "Build the count array",
        "Swap adjacent elements",
        "Reverse the array",
      ],
      correctAnswer: 1,
      explanation:
        "The algorithm first counts the frequency of each element.",
    },
    {
      question: "Why are prefix sums calculated in Counting Sort?",
      options: [
        "To remove duplicates",
        "To determine the final position of each element",
        "To reduce memory usage",
        "To compare elements faster",
      ],
      correctAnswer: 1,
      explanation:
        "Prefix sums determine the correct index of each value in the sorted output.",
    },
    {
      question: "Counting Sort becomes inefficient when:",
      options: [
        "The array is already sorted",
        "The range of values is very large",
        "The array contains duplicate values",
        "The array is small",
      ],
      correctAnswer: 1,
      explanation:
        "A large value range requires a large count array, increasing memory usage.",
    },
    {
      question: "Counting Sort is mainly designed for:",
      options: [
        "Strings",
        "Floating-point numbers",
        "Integers within a bounded range",
        "Graphs",
      ],
      correctAnswer: 2,
      explanation:
        "Counting Sort is designed primarily for integers within a limited range.",
    },
    {
      question: "Can standard Counting Sort directly handle negative integers?",
      options: [
        "Yes",
        "No",
        "Only if the array is sorted",
        "Only if duplicates are removed",
      ],
      correctAnswer: 1,
      explanation:
        "Standard Counting Sort assumes non-negative integers. Negative values require shifting the range.",
    },
    {
      question: "Which algorithm commonly uses Counting Sort as a subroutine?",
      options: [
        "Heap Sort",
        "Quick Sort",
        "Radix Sort",
        "Merge Sort",
      ],
      correctAnswer: 2,
      explanation:
        "Radix Sort relies on Counting Sort because it is stable.",
    },
    {
      question: "Which statement about Counting Sort is correct?",
      options: [
        "It compares every pair of elements",
        "It sorts elements by counting their occurrences",
        "It always runs in O(n²)",
        "It only works for sorted arrays",
      ],
      correctAnswer: 1,
      explanation:
        "Counting Sort sorts values based on their frequencies instead of comparing elements.",
    },
    {
  question: "What is the primary purpose of the count array in Counting Sort?",
  options: [
    "Store sorted elements",
    "Store the frequency of each value",
    "Store pivot elements",
    "Store recursive calls"
  ],
  correctAnswer: 1,
  explanation: "The count array records how many times each value appears in the input array."
},
{
  question: "Which type of sorting algorithm is Counting Sort?",
  options: [
    "Comparison-based",
    "Non-comparison-based",
    "Divide and Conquer",
    "Greedy"
  ],
  correctAnswer: 1,
  explanation: "Counting Sort sorts elements using their frequencies instead of comparing them."
},
{
  question: "What happens after the frequencies are counted in Counting Sort?",
  options: [
    "The array is divided into halves",
    "Prefix sums are calculated",
    "The heap is built",
    "The array is reversed"
  ],
  correctAnswer: 1,
  explanation: "After counting frequencies, prefix sums are computed to determine the correct positions of elements."
},
{
  question: "Why is an output array used in Counting Sort?",
  options: [
    "To reduce comparisons",
    "To place elements in their correct sorted positions",
    "To build a heap",
    "To remove duplicates"
  ],
  correctAnswer: 1,
  explanation: "The output array stores elements in their final sorted order while maintaining stability."
},
{
  question: "What is the best-case time complexity of Counting Sort?",
  options: [
    "O(log n)",
    "O(n)",
    "O(n + k)",
    "O(n²)"
  ],
  correctAnswer: 2,
  explanation: "Counting Sort always runs in O(n + k) time regardless of the input order."
},
{
  question: "Which of the following is a limitation of Counting Sort?",
  options: [
    "Cannot sort integers",
    "Requires large memory when the value range is large",
    "Always performs O(n²)",
    "Cannot handle duplicate values"
  ],
  correctAnswer: 1,
  explanation: "If the range of input values is very large, the count array becomes memory-intensive."
},
{
  question: "Can Counting Sort correctly sort duplicate elements?",
  options: [
    "Yes",
    "No",
    "Only if duplicates are adjacent",
    "Only after removing duplicates"
  ],
  correctAnswer: 0,
  explanation: "Yes, Counting Sort correctly sorts duplicate values while preserving their relative order."
},
{
  question: "Which scenario is ideal for using Counting Sort?",
  options: [
    "Sorting integers within a small value range",
    "Sorting floating-point numbers",
    "Sorting large-range values",
    "Sorting graphs"
  ],
  correctAnswer: 0,
  explanation: "Counting Sort is most efficient when sorting integers whose values fall within a limited range."
},
{
  question: "Why is Counting Sort considered a stable sorting algorithm?",
  options: [
    "It performs recursive calls",
    "It preserves the relative order of equal elements",
    "It uses constant memory",
    "It always sorts in-place"
  ],
  correctAnswer: 1,
  explanation: "A stable sorting algorithm keeps equal elements in the same order as they appeared in the original array."
},
{
  question: "Which real-world application is suitable for Counting Sort?",
  options: [
    "Sorting student marks within a fixed range",
    "Sorting floating-point temperatures",
    "Sorting web pages by content",
    "Finding shortest paths in a graph"
  ],
  correctAnswer: 0,
  explanation: "Counting Sort is well suited for sorting values like exam marks, ages, or grades that fall within a known limited range."
}
  ];

  return (
    <QuizEngine
      title="Counting Sort Quiz Challenge"
      questions={questions}
    />
  );
};

export default CountingSortQuiz;