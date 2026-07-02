"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is another name for a Fenwick Tree?",
    options: [
      "AVL Tree",
      "Binary Indexed Tree",
      "Segment Tree",
      "Trie"
    ],
    correctAnswer: 1,
    explanation: "Fenwick Tree is also known as a Binary Indexed Tree (BIT)."
  },
  {
    question: "What is the primary purpose of a Fenwick Tree?",
    options: [
      "Sorting arrays",
      "Efficient prefix sum queries and updates",
      "Graph traversal",
      "Binary searching"
    ],
    correctAnswer: 1,
    explanation: "Fenwick Trees efficiently support prefix sum queries and point updates."
  },
  {
    question: "What is the time complexity of updating an element in a Fenwick Tree?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 1,
    explanation: "Updates require traversing parent indices, giving O(log n) complexity."
  },
  {
    question: "What is the time complexity of a prefix sum query?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Fenwick Trees compute prefix sums in logarithmic time."
  },
  {
    question: "Which operation is NOT commonly supported directly by a Fenwick Tree?",
    options: [
      "Point Update",
      "Prefix Sum Query",
      "Range Sum Query (using two prefix sums)",
      "Level-order Traversal"
    ],
    correctAnswer: 3,
    explanation: "Level-order traversal is unrelated to Fenwick Trees."
  },
  {
    question: "Fenwick Trees are generally implemented using:",
    options: [
      "Linked List",
      "Array",
      "Hash Table",
      "Graph"
    ],
    correctAnswer: 1,
    explanation: "Fenwick Trees are efficiently represented using an array."
  },
  {
    question: "Which bitwise operation is commonly used in Fenwick Tree implementation?",
    options: [
      "index & (-index)",
      "index | (-index)",
      "index ^ (-index)",
      "index >> 2"
    ],
    correctAnswer: 0,
    explanation: "The expression index & (-index) extracts the least significant set bit."
  },
  {
    question: "Compared to a Segment Tree, a Fenwick Tree usually:",
    options: [
      "Uses more memory",
      "Uses less memory",
      "Cannot perform updates",
      "Cannot answer queries"
    ],
    correctAnswer: 1,
    explanation: "Fenwick Trees are more space-efficient than Segment Trees."
  },
  {
    question: "Fenwick Trees are best suited for:",
    options: [
      "Dynamic Programming",
      "Prefix sum computations",
      "Shortest path algorithms",
      "Tree balancing"
    ],
    correctAnswer: 1,
    explanation: "Fenwick Trees are designed specifically for prefix sums and updates."
  },
  {
    question: "The space complexity of a Fenwick Tree is:",
    options: [
      "O(log n)",
      "O(n)",
      "O(n²)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation: "Fenwick Trees require an array of size n, resulting in O(n) space."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Fenwick Tree Quiz"
      questions={questions}
    />
  );
}