"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of a Segment Tree?",
    options: [
      "Sorting elements",
      "Efficient range queries and updates",
      "Graph traversal",
      "String matching"
    ],
    correctAnswer: 1,
    explanation: "Segment Trees efficiently support range queries and point/range updates."
  },
  {
    question: "Which of the following queries is commonly solved using a Segment Tree?",
    options: [
      "Range Sum Query",
      "Graph Coloring",
      "Shortest Path",
      "Topological Sort"
    ],
    correctAnswer: 0,
    explanation: "Segment Trees are widely used for range sum, minimum, and maximum queries."
  },
  {
    question: "What is the time complexity of building a Segment Tree?",
    options: [
      "O(log n)",
      "O(n)",
      "O(n log n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Building the Segment Tree requires visiting every element once."
  },
  {
    question: "What is the time complexity of a range query in a Segment Tree?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Range queries are answered in logarithmic time."
  },
  {
    question: "What is the time complexity of updating a single element in a Segment Tree?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 1,
    explanation: "Only nodes on one root-to-leaf path need updating."
  },
  {
    question: "Which traversal is commonly used to build a Segment Tree recursively?",
    options: [
      "Preorder",
      "Postorder",
      "Recursive Divide and Conquer",
      "Level Order"
    ],
    correctAnswer: 2,
    explanation: "Segment Trees are constructed using divide-and-conquer recursion."
  },
  {
    question: "Which type of tree is a Segment Tree?",
    options: [
      "Binary Tree",
      "AVL Tree",
      "Trie",
      "Heap"
    ],
    correctAnswer: 0,
    explanation: "A Segment Tree is a complete binary tree built over array segments."
  },
  {
    question: "What is the approximate space complexity of a Segment Tree?",
    options: [
      "O(log n)",
      "O(n)",
      "O(2n)",
      "O(4n)"
    ],
    correctAnswer: 3,
    explanation: "Most implementations allocate an array of size around 4n."
  },
  {
    question: "Segment Trees are especially useful when:",
    options: [
      "There are many range queries and updates",
      "The array never changes",
      "Only sorting is required",
      "Searching strings"
    ],
    correctAnswer: 0,
    explanation: "They efficiently handle frequent updates and range queries."
  },
  {
    question: "Which of the following is NOT a common Segment Tree application?",
    options: [
      "Range Minimum Query",
      "Range Maximum Query",
      "Range Sum Query",
      "Breadth-First Search"
    ],
    correctAnswer: 3,
    explanation: "Breadth-First Search is a graph traversal algorithm, not a Segment Tree application."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Segment Tree Quiz"
      questions={questions}
    />
  );
}