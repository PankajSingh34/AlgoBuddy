"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What does AVL stand for?",
    options: [
      "Automatic Variable Level",
      "Adelson-Velsky and Landis",
      "Advanced Vertex List",
      "Array Value Logic"
    ],
    correctAnswer: 1,
    explanation:
      "AVL Trees are named after their inventors, Adelson-Velsky and Landis."
  },
  {
    question: "AVL Tree is a type of:",
    options: [
      "Binary Heap",
      "Binary Search Tree",
      "Trie",
      "B-Tree"
    ],
    correctAnswer: 1,
    explanation:
      "An AVL Tree is a self-balancing Binary Search Tree."
  },
  {
    question: "What is the balance factor of a node?",
    options: [
      "Left Height + Right Height",
      "Left Height - Right Height",
      "Left Height × Right Height",
      "Node Value - Height"
    ],
    correctAnswer: 1,
    explanation:
      "Balance Factor = Height(Left Subtree) − Height(Right Subtree)."
  },
  {
    question: "What balance factor values are allowed in an AVL Tree?",
    options: [
      "-1, 0, +1",
      "0, 1, 2",
      "-2, -1, 0",
      "Any integer"
    ],
    correctAnswer: 0,
    explanation:
      "A node is balanced if its balance factor is -1, 0, or +1."
  },
  {
    question: "Which operation restores balance in an AVL Tree?",
    options: [
      "Sorting",
      "Rotation",
      "Swapping",
      "Searching"
    ],
    correctAnswer: 1,
    explanation:
      "Rotations are performed to restore balance after insertion or deletion."
  },
  {
    question: "How many basic rotations exist in AVL Trees?",
    options: [
      "2",
      "3",
      "4",
      "5"
    ],
    correctAnswer: 2,
    explanation:
      "The four rotations are LL, RR, LR, and RL."
  },
  {
    question: "Which rotation is used for a Left-Left imbalance?",
    options: [
      "Left Rotation",
      "Right Rotation",
      "Left-Right Rotation",
      "Right-Left Rotation"
    ],
    correctAnswer: 1,
    explanation:
      "A Right Rotation fixes an LL imbalance."
  },
  {
    question: "What is the worst-case time complexity of searching in an AVL Tree?",
    options: [
      "O(n)",
      "O(log n)",
      "O(n log n)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation:
      "AVL Trees remain balanced, so search takes O(log n)."
  },
  {
    question: "Why are AVL Trees faster than ordinary BSTs in searching?",
    options: [
      "They use hashing",
      "They are always balanced",
      "They store fewer nodes",
      "They don't use recursion"
    ],
    correctAnswer: 1,
    explanation:
      "Balanced height ensures logarithmic search time."
  },
  {
    question: "Which operation may require multiple rotations?",
    options: [
      "Insertion",
      "Deletion",
      "Traversal",
      "Searching"
    ],
    correctAnswer: 1,
    explanation:
      "Deletion can propagate imbalance upward and require multiple rotations."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="AVL Tree Quiz"
      questions={questions}
    />
  );
}