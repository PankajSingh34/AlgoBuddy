"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of a B-Tree?",
    options: [
      "Sorting arrays",
      "Efficient storage and retrieval of large amounts of data",
      "Graph traversal",
      "String matching"
    ],
    correctAnswer: 1,
    explanation: "B-Trees are designed for efficient searching, insertion, and deletion in large datasets, especially on disks."
  },
  {
    question: "Where are B-Trees commonly used?",
    options: [
      "Operating Systems",
      "Database Management Systems",
      "Computer Graphics",
      "Machine Learning"
    ],
    correctAnswer: 1,
    explanation: "B-Trees are widely used in databases and file systems for indexing."
  },
  {
    question: "A B-Tree is primarily optimized for:",
    options: [
      "Main memory",
      "Disk storage",
      "GPU memory",
      "Cache memory"
    ],
    correctAnswer: 1,
    explanation: "B-Trees minimize disk accesses by storing multiple keys per node."
  },
  {
    question: "Each node in a B-Tree can contain:",
    options: [
      "Only one key",
      "Multiple keys",
      "Only two keys",
      "No keys"
    ],
    correctAnswer: 1,
    explanation: "Unlike BSTs, B-Trees allow multiple keys in each node."
  },
  {
    question: "What happens when a B-Tree node becomes full during insertion?",
    options: [
      "The tree becomes invalid",
      "The node is split",
      "The insertion is rejected",
      "The root is deleted"
    ],
    correctAnswer: 1,
    explanation: "A full node is split and its middle key is promoted."
  },
  {
    question: "What is the average search complexity of a B-Tree?",
    options: [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Searching in a balanced B-Tree requires logarithmic time."
  },
  {
    question: "Why are B-Trees preferred over Binary Search Trees for databases?",
    options: [
      "They use less memory",
      "They reduce disk I/O operations",
      "They don't require balancing",
      "They are recursive"
    ],
    correctAnswer: 1,
    explanation: "Multiple keys per node reduce the tree height and disk accesses."
  },
  {
    question: "What is the maximum number of children for a B-Tree node of order m?",
    options: [
      "m",
      "m-1",
      "2m",
      "m+1"
    ],
    correctAnswer: 0,
    explanation: "A B-Tree of order m can have at most m children."
  },
  {
    question: "What property do all leaf nodes of a B-Tree share?",
    options: [
      "They have different depths",
      "They are at the same level",
      "They contain only one key",
      "They have no parent"
    ],
    correctAnswer: 1,
    explanation: "All leaf nodes are maintained at the same depth, keeping the tree balanced."
  },
  {
    question: "Which operation may require node merging in a B-Tree?",
    options: [
      "Searching",
      "Traversal",
      "Deletion",
      "Insertion"
    ],
    correctAnswer: 2,
    explanation: "Deletion may require merging nodes to maintain B-Tree properties."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="B-Tree Quiz"
      questions={questions}
    />
  );
}