"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const RadixSortQuiz = () => {
  const questions = [
    {
      question: "What is the main idea behind Radix Sort?",
      options: [
        "Compare adjacent elements",
        "Sort numbers digit by digit",
        "Divide the array into halves",
        "Build a binary heap",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort processes numbers one digit at a time, usually from least significant digit to most significant digit.",
    },
    {
      question: "Radix Sort is primarily used for:",
      options: [
        "Floating-point numbers",
        "Strings only",
        "Integers with fixed-length digits",
        "Graphs",
      ],
      correctAnswer: 2,
      explanation:
        "Radix Sort works best for integers or fixed-length keys.",
    },
    {
      question: "Which sorting algorithm is commonly used internally in Radix Sort?",
      options: [
        "Bubble Sort",
        "Selection Sort",
        "Counting Sort",
        "Quick Sort",
      ],
      correctAnswer: 2,
      explanation:
        "Counting Sort is commonly used as the stable sorting algorithm for each digit.",
    },
    {
      question: "Why must the internal sorting algorithm be stable?",
      options: [
        "To reduce memory usage",
        "To preserve the order of equal digits",
        "To increase comparisons",
        "To remove duplicates",
      ],
      correctAnswer: 1,
      explanation:
        "A stable sort preserves the relative order of equal elements, which is essential for Radix Sort.",
    },
    {
      question: "What is the average time complexity of Radix Sort?",
      options: [
        "O(n²)",
        "O(n log n)",
        "O(d × (n + k))",
        "O(log n)",
      ],
      correctAnswer: 2,
      explanation:
        "The complexity depends on the number of digits (d) and the digit range (k).",
    },
    {
      question: "In LSD Radix Sort, processing begins from:",
      options: [
        "Most significant digit",
        "Middle digit",
        "Least significant digit",
        "Random digit",
      ],
      correctAnswer: 2,
      explanation:
        "LSD Radix Sort starts from the least significant digit.",
    },
    {
      question: "What does MSD stand for in Radix Sort?",
      options: [
        "Minimum Significant Digit",
        "Most Significant Digit",
        "Main Sorted Digit",
        "Maximum Sorted Digit",
      ],
      correctAnswer: 1,
      explanation:
        "MSD means Most Significant Digit.",
    },
    {
      question: "Radix Sort is classified as:",
      options: [
        "Comparison-based sorting",
        "Non-comparison sorting",
        "Recursive sorting",
        "Tree-based sorting",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort does not compare elements directly.",
    },
    {
      question: "Which of the following is an advantage of Radix Sort?",
      options: [
        "Always uses O(1) memory",
        "Very efficient for fixed-length integers",
        "Works only for sorted arrays",
        "Requires no auxiliary space",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort performs very well for integers with a limited number of digits.",
    },
    {
      question: "Which statement about Radix Sort is true?",
      options: [
        "It always performs comparisons",
        "It is a stable sorting algorithm",
        "It only works for linked lists",
        "It has O(n²) complexity",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort is stable when its internal sorting algorithm is stable.",
    },
    {
      question: "What does 'd' represent in Radix Sort complexity?",
      options: [
        "Number of digits",
        "Depth of recursion",
        "Number of comparisons",
        "Array size",
      ],
      correctAnswer: 0,
      explanation:
        "d represents the maximum number of digits.",
    },
    {
      question: "What does 'k' represent in O(d × (n + k))?",
      options: [
        "Number of recursive calls",
        "Range of each digit",
        "Heap size",
        "Pivot position",
      ],
      correctAnswer: 1,
      explanation:
        "k is the number of possible digit values (usually 10).",
    },
    {
      question: "Which base is most commonly used in decimal Radix Sort?",
      options: [
        "2",
        "8",
        "10",
        "16",
      ],
      correctAnswer: 2,
      explanation:
        "Decimal Radix Sort uses base 10.",
    },
    {
      question: "Radix Sort performs best when:",
      options: [
        "Numbers have similar digit lengths",
        "The array is reverse sorted",
        "The array contains floating-point values",
        "The input is recursive",
      ],
      correctAnswer: 0,
      explanation:
        "Radix Sort is efficient when the number of digits is limited.",
    },
    {
      question: "Which statement about Radix Sort is correct?",
      options: [
        "It compares every pair of elements",
        "It sorts numbers digit by digit using a stable sort",
        "It always uses recursion",
        "It only works for negative numbers",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort processes one digit at a time using a stable sorting algorithm.",
    },
    {
  question: "What is the first step in LSD Radix Sort?",
  options: [
    "Sort by the most significant digit",
    "Sort by the least significant digit",
    "Find the largest number",
    "Reverse the array"
  ],
  correctAnswer: 1,
  explanation: "LSD (Least Significant Digit) Radix Sort begins by sorting numbers according to their least significant digit."
},
{
  question: "Which property of Counting Sort makes it suitable for Radix Sort?",
  options: [
    "It is recursive",
    "It is stable",
    "It uses no extra space",
    "It is comparison-based"
  ],
  correctAnswer: 1,
  explanation: "Counting Sort is stable, ensuring that the relative order of equal elements is preserved across digit passes."
},
{
  question: "Which type of sorting algorithm is Radix Sort?",
  options: [
    "Comparison-based",
    "Non-comparison-based",
    "Divide and Conquer",
    "Greedy"
  ],
  correctAnswer: 1,
  explanation: "Radix Sort does not compare elements directly. Instead, it sorts them based on their individual digits."
},
{
  question: "What happens after each digit is processed in Radix Sort?",
  options: [
    "The array becomes completely sorted",
    "The numbers are grouped according to the processed digit",
    "The largest element is removed",
    "The array is divided into halves"
  ],
  correctAnswer: 1,
  explanation: "Each pass groups numbers according to the current digit while preserving the order established in previous passes."
},
{
  question: "Which of the following is a limitation of Radix Sort?",
  options: [
    "It cannot sort integers",
    "It is inefficient when the number of digits is very large",
    "It is unstable",
    "It always performs O(n²)"
  ],
  correctAnswer: 1,
  explanation: "Radix Sort becomes less efficient as the number of digits increases because it requires one pass per digit."
},
{
  question: "Can Radix Sort correctly sort duplicate values?",
  options: [
    "Yes",
    "No",
    "Only if duplicates are adjacent",
    "Only for positive integers"
  ],
  correctAnswer: 0,
  explanation: "Yes, Radix Sort correctly sorts duplicate values while preserving their relative order when using a stable sorting algorithm."
},
{
  question: "Which data type is NOT naturally suitable for standard Radix Sort?",
  options: [
    "Positive integers",
    "Fixed-length strings",
    "Floating-point numbers",
    "Employee IDs"
  ],
  correctAnswer: 2,
  explanation: "Standard Radix Sort is designed for fixed-length keys like integers or strings, not floating-point numbers."
},
{
  question: "How many passes does LSD Radix Sort perform?",
  options: [
    "One",
    "Equal to the number of digits in the largest element",
    "Equal to the number of elements",
    "log₂(n)"
  ],
  correctAnswer: 1,
  explanation: "LSD Radix Sort performs one pass for each digit in the largest number."
},
{
  question: "Which of the following is a real-world application of Radix Sort?",
  options: [
    "Sorting phone numbers",
    "Searching graphs",
    "Finding shortest paths",
    "Balancing binary trees"
  ],
  correctAnswer: 0,
  explanation: "Radix Sort is commonly used for sorting fixed-length numeric values such as phone numbers, IDs, and ZIP codes."
},
{
  question: "When is Radix Sort generally preferred over comparison-based sorting algorithms?",
  options: [
    "When sorting fixed-length integers with a limited digit range",
    "When sorting floating-point numbers",
    "When recursion must be avoided",
    "When memory usage must always be O(1)"
  ],
  correctAnswer: 0,
  explanation: "Radix Sort is especially efficient for sorting fixed-length integers or keys with a small number of digits."
}
  ];

  return (
    <QuizEngine
      title="Radix Sort Quiz Challenge"
      questions={questions}
    />
  );
};

export default RadixSortQuiz;