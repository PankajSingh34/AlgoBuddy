"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const jumpSearchQuestions = [
  {
    question: "What is the primary requirement for applying Jump Search?",
    options: [
      "The array must be sorted.",
      "The array must be unsorted.",
      "The array must contain unique elements.",
      "The array must have an even number of elements.",
    ],
    answer: "The array must be sorted.",
    explanation:
      "Jump Search works only on sorted arrays because it skips blocks based on element ordering.",
  },
  {
    question: "What is the optimal jump size for Jump Search?",
    options: ["√n", "n", "log n", "n/2"],
    answer: "√n",
    explanation:
      "The optimal jump size is the square root of the number of elements.",
  },
  {
    question: "What happens after finding the correct block?",
    options: [
      "Binary Search is performed.",
      "Linear Search is performed.",
      "Interpolation Search is performed.",
      "The algorithm stops.",
    ],
    answer: "Linear Search is performed.",
    explanation:
      "After locating the block, Jump Search performs a linear search inside that block.",
  },
  {
    question: "What is the worst-case time complexity of Jump Search?",
    options: ["O(n)", "O(log n)", "O(√n)", "O(n log n)"],
    answer: "O(√n)",
    explanation:
      "Jump Search has a worst-case time complexity of O(√n).",
  },
  {
    question: "What is the best-case time complexity of Jump Search?",
    options: ["O(1)", "O(log n)", "O(√n)", "O(n)"],
    answer: "O(1)",
    explanation:
      "If the target is found immediately, the complexity is O(1).",
  },
  {
    question: "Which searching technique is used after jumping?",
    options: [
      "Linear Search",
      "Binary Search",
      "Ternary Search",
      "Exponential Search",
    ],
    answer: "Linear Search",
    explanation:
      "The target block is searched sequentially using Linear Search.",
  },
  {
    question: "Jump Search is most efficient on:",
    options: [
      "Sorted arrays",
      "Linked Lists",
      "Trees",
      "Graphs",
    ],
    answer: "Sorted arrays",
    explanation:
      "Jump Search relies on sorted order to skip blocks.",
  },
  {
    question: "What is the space complexity of Jump Search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(√n)"],
    answer: "O(1)",
    explanation:
      "Jump Search uses only a few variables regardless of input size.",
  },
  {
    question: "If the target is larger than the last element of a block, what happens?",
    options: [
      "Jump to the next block.",
      "Stop searching.",
      "Restart from the beginning.",
      "Search backwards.",
    ],
    answer: "Jump to the next block.",
    explanation:
      "The algorithm continues jumping until it reaches the correct block.",
  },
  {
    question: "Which search algorithm is generally faster on sorted arrays?",
    options: [
      "Binary Search",
      "Jump Search",
      "Linear Search",
      "Sequential Search",
    ],
    answer: "Binary Search",
    explanation:
      "Binary Search usually performs better with O(log n) time complexity.",
  },
  {
    question: "Jump Search combines which two searching ideas?",
    options: [
      "Jumping and Linear Search",
      "Binary Search and DFS",
      "Recursion and Sorting",
      "Hashing and Searching",
    ],
    answer: "Jumping and Linear Search",
    explanation:
      "It first jumps through blocks and then performs a linear search.",
  },
  {
    question: "Jump Search is better than Linear Search for:",
    options: [
      "Large sorted arrays",
      "Small unsorted arrays",
      "Graphs",
      "Trees",
    ],
    answer: "Large sorted arrays",
    explanation:
      "Skipping blocks makes Jump Search faster than Linear Search on sorted data.",
  },
  {
    question: "Which mathematical function determines the jump size?",
    options: [
      "Square Root",
      "Factorial",
      "Logarithm",
      "Power",
    ],
    answer: "Square Root",
    explanation:
      "The jump length is generally chosen as √n.",
  },
  {
    question: "Jump Search belongs to which category?",
    options: [
      "Searching Algorithm",
      "Sorting Algorithm",
      "Graph Algorithm",
      "Greedy Algorithm",
    ],
    answer: "Searching Algorithm",
    explanation:
      "Jump Search is a searching algorithm for sorted arrays.",
  },
  {
    question: "If the target is smaller than the first element of a block, the algorithm:",
    options: [
      "Searches the previous block.",
      "Stops immediately.",
      "Sorts the array.",
      "Searches the next block.",
    ],
    answer: "Searches the previous block.",
    explanation:
      "The target must be in the previous block if it exists.",
  },
  {
    question: "Which data structure is most suitable for Jump Search?",
    options: [
      "Array",
      "Linked List",
      "Stack",
      "Queue",
    ],
    answer: "Array",
    explanation:
      "Arrays provide efficient indexed access required by Jump Search.",
  },
  {
    question: "What is returned if the target is not found?",
    options: [
      "-1",
      "0",
      "1",
      "NULL",
    ],
    answer: "-1",
    explanation:
      "Returning -1 indicates that the target does not exist in the array.",
  },
  {
    question: "What type of memory access does Jump Search require?",
    options: [
      "Random Access",
      "Sequential Access",
      "Stack Access",
      "Queue Access",
    ],
    answer: "Random Access",
    explanation:
      "Jump Search requires indexed access to jump between positions.",
  },
  {
    question: "Jump Search performs fewer comparisons than:",
    options: [
      "Linear Search",
      "Binary Search",
      "Ternary Search",
      "Interpolation Search",
    ],
    answer: "Linear Search",
    explanation:
      "Jump Search skips blocks, reducing unnecessary comparisons.",
  },
  {
    question: "Which phase comes first in Jump Search?",
    options: [
      "Jump Phase",
      "Linear Search Phase",
      "Sorting Phase",
      "Recursion Phase",
    ],
    answer: "Jump Phase",
    explanation:
      "The algorithm first jumps through the array before performing a linear search.",
  },
];

export default function JumpSearchQuiz() {
  return (
    <QuizEngine
      title="Jump Search Quiz"
      questions={jumpSearchQuestions}
    />
  );
}