"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const fibonacciSearchQuestions = [
  {
    question: "What is the primary requirement for Fibonacci Search?",
    options: [
      "The array must be sorted.",
      "The array must be unsorted.",
      "The array must contain duplicate elements.",
      "The array must have an odd number of elements.",
    ],
    answer: "The array must be sorted.",
    explanation:
      "Fibonacci Search works only on sorted arrays because it relies on ordered elements.",
  },
  {
    question: "Which mathematical sequence is used in Fibonacci Search?",
    options: [
      "Fibonacci Sequence",
      "Prime Numbers",
      "Arithmetic Progression",
      "Geometric Progression",
    ],
    answer: "Fibonacci Sequence",
    explanation:
      "The algorithm uses Fibonacci numbers to determine probe positions.",
  },
  {
    question: "What is the average time complexity of Fibonacci Search?",
    options: ["O(n)", "O(log n)", "O(√n)", "O(n log n)"],
    answer: "O(log n)",
    explanation:
      "Fibonacci Search has logarithmic average-case complexity.",
  },
  {
    question: "What is the worst-case time complexity of Fibonacci Search?",
    options: ["O(log n)", "O(n)", "O(√n)", "O(1)"],
    answer: "O(log n)",
    explanation:
      "Its worst-case complexity is also O(log n).",
  },
  {
    question: "What is the best-case time complexity of Fibonacci Search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(√n)"],
    answer: "O(1)",
    explanation:
      "If the target is found immediately, the search completes in constant time.",
  },
  {
    question: "Fibonacci Search is mainly an alternative to:",
    options: [
      "Binary Search",
      "Linear Search",
      "Jump Search",
      "Hash Search",
    ],
    answer: "Binary Search",
    explanation:
      "Fibonacci Search is another logarithmic search algorithm for sorted arrays.",
  },
  {
    question: "What is the space complexity of Fibonacci Search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(√n)"],
    answer: "O(1)",
    explanation:
      "It uses only a constant amount of extra memory.",
  },
  {
    question: "Which data structure is best suited for Fibonacci Search?",
    options: ["Array", "Stack", "Queue", "Graph"],
    answer: "Array",
    explanation:
      "Arrays provide indexed access required by the algorithm.",
  },
  {
    question: "Which operation does Fibonacci Search avoid compared to Binary Search?",
    options: [
      "Division",
      "Addition",
      "Comparison",
      "Assignment",
    ],
    answer: "Division",
    explanation:
      "It uses Fibonacci numbers instead of repeatedly dividing the search range.",
  },
  {
    question: "If the target is not found, Fibonacci Search returns:",
    options: ["-1", "0", "1", "NULL"],
    answer: "-1",
    explanation:
      "Returning -1 indicates the element is absent.",
  },
  {
    question: "Fibonacci Search works efficiently on:",
    options: [
      "Sorted arrays",
      "Linked Lists",
      "Graphs",
      "Trees",
    ],
    answer: "Sorted arrays",
    explanation:
      "The array must be sorted before applying Fibonacci Search.",
  },
  {
    question: "Which of the following is NOT required by Fibonacci Search?",
    options: [
      "Recursion",
      "Sorted data",
      "Comparisons",
      "Indexed access",
    ],
    answer: "Recursion",
    explanation:
      "The algorithm can be implemented iteratively.",
  },
  {
    question: "Fibonacci Search belongs to which category?",
    options: [
      "Searching Algorithm",
      "Sorting Algorithm",
      "Greedy Algorithm",
      "Graph Algorithm",
    ],
    answer: "Searching Algorithm",
    explanation:
      "It is a searching algorithm for sorted collections.",
  },
  {
    question: "What happens when the current element is smaller than the target?",
    options: [
      "Search moves to the right.",
      "Search moves to the left.",
      "Search stops.",
      "Array is sorted again.",
    ],
    answer: "Search moves to the right.",
    explanation:
      "The algorithm eliminates the left portion and searches the right.",
  },
  {
    question: "What happens when the current element is greater than the target?",
    options: [
      "Search moves to the left.",
      "Search moves to the right.",
      "Search stops.",
      "Array is reversed.",
    ],
    answer: "Search moves to the left.",
    explanation:
      "The right portion is discarded when the current value is larger.",
  },
  {
    question: "Which complexity class does Fibonacci Search belong to?",
    options: [
      "Logarithmic",
      "Linear",
      "Quadratic",
      "Exponential",
    ],
    answer: "Logarithmic",
    explanation:
      "Fibonacci Search has O(log n) complexity.",
  },
  {
    question: "Which sequence determines the probe index?",
    options: [
      "Fibonacci numbers",
      "Prime numbers",
      "Even numbers",
      "Odd numbers",
    ],
    answer: "Fibonacci numbers",
    explanation:
      "Probe positions are determined using Fibonacci values.",
  },
  {
    question: "Compared to Binary Search, Fibonacci Search is especially useful when:",
    options: [
      "Division operations are expensive.",
      "The array is unsorted.",
      "The data contains duplicates.",
      "The data is stored in a linked list.",
    ],
    answer: "Division operations are expensive.",
    explanation:
      "Fibonacci Search relies on addition and subtraction rather than division.",
  },
  {
    question: "Which search algorithm also requires a sorted array?",
    options: [
      "Binary Search",
      "Linear Search",
      "Sequential Search",
      "DFS",
    ],
    answer: "Binary Search",
    explanation:
      "Both Binary Search and Fibonacci Search require sorted input.",
  },
  {
    question: "What is the primary advantage of Fibonacci Search?",
    options: [
      "Efficient searching in sorted arrays using Fibonacci numbers.",
      "Works on unsorted arrays.",
      "Requires no comparisons.",
      "Sorts the array before searching.",
    ],
    answer: "Efficient searching in sorted arrays using Fibonacci numbers.",
    explanation:
      "It efficiently searches sorted arrays by leveraging the Fibonacci sequence.",
  },
];

export default function FibonacciSearchQuiz() {
  return (
    <QuizEngine
      title="Fibonacci Search Quiz"
      questions={fibonacciSearchQuestions}
    />
  );
}