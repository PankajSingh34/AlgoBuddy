"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const exponentialSearchQuestions = [
  {
    question: "What is the primary requirement for Exponential Search?",
    options: [
      "The array must be sorted.",
      "The array must be unsorted.",
      "The array must contain duplicate elements.",
      "The array must be circular.",
    ],
    answer: "The array must be sorted.",
    explanation:
      "Exponential Search works only on sorted arrays because it performs Binary Search on a selected range.",
  },
  {
    question: "What is the first step of Exponential Search?",
    options: [
      "Check the first element.",
      "Perform Binary Search.",
      "Sort the array.",
      "Jump by √n positions.",
    ],
    answer: "Check the first element.",
    explanation:
      "The algorithm first checks if the target is at index 0.",
  },
  {
    question: "How does Exponential Search expand the search range?",
    options: [
      "By doubling the index.",
      "By adding 1 each time.",
      "By adding √n.",
      "By halving the range.",
    ],
    answer: "By doubling the index.",
    explanation:
      "The search index grows exponentially (1, 2, 4, 8, ...).",
  },
  {
    question: "Which algorithm is used after the search range is identified?",
    options: [
      "Binary Search",
      "Linear Search",
      "Jump Search",
      "Interpolation Search",
    ],
    answer: "Binary Search",
    explanation:
      "Binary Search is applied within the identified range.",
  },
  {
    question: "What is the best-case time complexity of Exponential Search?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(√n)",
    ],
    answer: "O(1)",
    explanation:
      "If the target is the first element, only one comparison is required.",
  },
  {
    question: "What is the average-case time complexity of Exponential Search?",
    options: [
      "O(log n)",
      "O(n)",
      "O(√n)",
      "O(n log n)",
    ],
    answer: "O(log n)",
    explanation:
      "Both range finding and Binary Search together take logarithmic time.",
  },
  {
    question: "What is the worst-case time complexity of Exponential Search?",
    options: [
      "O(log n)",
      "O(n)",
      "O(√n)",
      "O(1)",
    ],
    answer: "O(log n)",
    explanation:
      "The algorithm performs logarithmic range expansion followed by Binary Search.",
  },
  {
    question: "What is the space complexity of Exponential Search?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(√n)",
    ],
    answer: "O(1)",
    explanation:
      "Only a constant amount of extra memory is used.",
  },
  {
    question: "Exponential Search is most suitable for:",
    options: [
      "Sorted arrays with unknown size.",
      "Graphs.",
      "Linked Lists.",
      "Stacks.",
    ],
    answer: "Sorted arrays with unknown size.",
    explanation:
      "It is commonly used for searching in infinite or unbounded sorted arrays.",
  },
  {
    question: "Which sequence represents the index expansion?",
    options: [
      "1, 2, 4, 8, 16...",
      "1, 3, 5, 7...",
      "2, 3, 5, 7...",
      "1, 4, 9, 16...",
    ],
    answer: "1, 2, 4, 8, 16...",
    explanation:
      "The index doubles during range expansion.",
  },
  {
    question: "Exponential Search belongs to which category?",
    options: [
      "Searching Algorithm",
      "Sorting Algorithm",
      "Greedy Algorithm",
      "Dynamic Programming",
    ],
    answer: "Searching Algorithm",
    explanation:
      "It is a searching algorithm for sorted arrays.",
  },
  {
    question: "What happens after the search range is found?",
    options: [
      "Binary Search is performed.",
      "Merge Sort is applied.",
      "The search stops.",
      "Linear Search is applied.",
    ],
    answer: "Binary Search is performed.",
    explanation:
      "Binary Search efficiently searches within the identified range.",
  },
  {
    question: "Which of the following algorithms is closely related to Exponential Search?",
    options: [
      "Binary Search",
      "Bubble Sort",
      "Selection Sort",
      "DFS",
    ],
    answer: "Binary Search",
    explanation:
      "Exponential Search internally uses Binary Search.",
  },
  {
    question: "If the target is greater than the current value during range expansion, what happens?",
    options: [
      "The index is doubled.",
      "The search ends.",
      "The index is halved.",
      "The array is sorted.",
    ],
    answer: "The index is doubled.",
    explanation:
      "The search range expands exponentially until it includes the target.",
  },
  {
    question: "Which search algorithm first determines a search range before searching?",
    options: [
      "Exponential Search",
      "Linear Search",
      "Binary Search",
      "Sequential Search",
    ],
    answer: "Exponential Search",
    explanation:
      "It first identifies a suitable range before applying Binary Search.",
  },
  {
    question: "Can Exponential Search work efficiently on unsorted arrays?",
    options: [
      "No",
      "Yes",
      "Only if duplicates exist",
      "Only for small arrays",
    ],
    answer: "No",
    explanation:
      "The array must be sorted.",
  },
  {
    question: "Which operation is repeatedly performed during range expansion?",
    options: [
      "Doubling the index",
      "Halving the array",
      "Swapping elements",
      "Sorting the array",
    ],
    answer: "Doubling the index",
    explanation:
      "The index increases exponentially.",
  },
  {
    question: "Which data structure is best suited for Exponential Search?",
    options: [
      "Array",
      "Queue",
      "Stack",
      "Tree",
    ],
    answer: "Array",
    explanation:
      "Arrays provide constant-time indexed access.",
  },
  {
    question: "If the target is not found, the algorithm returns:",
    options: [
      "-1",
      "0",
      "1",
      "NULL",
    ],
    answer: "-1",
    explanation:
      "Returning -1 indicates the element is absent.",
  },
  {
    question: "What is the main advantage of Exponential Search?",
    options: [
      "Quickly finds a search range before Binary Search.",
      "Works on unsorted arrays.",
      "Requires no comparisons.",
      "Uses recursion only.",
    ],
    answer: "Quickly finds a search range before Binary Search.",
    explanation:
      "Its exponential range expansion makes it efficient for large sorted arrays and unknown-sized datasets.",
  },
];

export default function ExponentialSearchQuiz() {
  return (
    <QuizEngine
      title="Exponential Search Quiz"
      questions={exponentialSearchQuestions}
    />
  );
}