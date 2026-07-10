"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary difference between a B+ Tree and a B-Tree?",
    options: [
      "B+ Trees have only one child per node.",
      "All records are stored only in leaf nodes in a B+ Tree.",
      "B+ Trees are not balanced.",
      "B+ Trees do not support searching."
    ],
    correctAnswer: 1,
    explanation: "In a B+ Tree, internal nodes store only keys, while all records are stored in the leaf nodes."
  },
  {
    question: "Why are B+ Trees widely used in database indexing?",
    options: [
      "They require no balancing.",
      "They support efficient range queries and sequential access.",
      "They always use less memory than arrays.",
      "They eliminate disk access."
    ],
    correctAnswer: 1,
    explanation: "Linked leaf nodes make range queries and sequential traversal much more efficient."
  },
  {
    question: "Where are actual data records stored in a B+ Tree?",
    options: [
      "Internal nodes",
      "Leaf nodes",
      "Root node only",
      "Randomly"
    ],
    correctAnswer: 1,
    explanation: "Only leaf nodes contain the actual records in a B+ Tree."
  },
  {
    question: "What do internal nodes contain in a B+ Tree?",
    options: [
      "Only records",
      "Keys used for searching",
      "Pointers to arrays",
      "Leaf data"
    ],
    correctAnswer: 1,
    explanation: "Internal nodes contain only keys and child pointers."
  },
  {
    question: "Which operation benefits the most from linked leaf nodes?",
    options: [
      "Insertion",
      "Range queries",
      "Deletion",
      "Balancing"
    ],
    correctAnswer: 1,
    explanation: "Sequentially linked leaf nodes make range queries very efficient."
  },
  {
    question: "What is the average search complexity of a B+ Tree?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Like B-Trees, B+ Trees provide logarithmic search complexity."
  },
  {
    question: "Are all leaf nodes in a B+ Tree at the same level?",
    options: [
      "Yes",
      "No",
      "Only if the tree has 3 levels",
      "Only after deletion"
    ],
    correctAnswer: 0,
    explanation: "B+ Trees are height-balanced, so all leaves remain at the same depth."
  },
  {
    question: "Which structure connects the leaf nodes of a B+ Tree?",
    options: [
      "Stack",
      "Queue",
      "Linked List",
      "Hash Table"
    ],
    correctAnswer: 2,
    explanation: "Leaf nodes are linked together to support sequential traversal."
  },
  {
    question: "Compared to a B-Tree, a B+ Tree generally has:",
    options: [
      "Lower fan-out",
      "Higher fan-out",
      "No internal nodes",
      "Only one level"
    ],
    correctAnswer: 1,
    explanation: "Since internal nodes store only keys, they can contain more keys and child pointers."
  },
  {
    question: "B+ Trees are commonly used in:",
    options: [
      "Database indexing",
      "File systems",
      "Operating systems",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "B+ Trees are widely used in databases and modern file systems due to their efficient indexing."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="B+ Tree Quiz"
      questions={questions}
    />
  );
}