"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the order of nodes visited in In-order Traversal?",
    options: [
      "Root → Left → Right",
      "Left → Root → Right",
      "Left → Right → Root",
      "Right → Root → Left"
    ],
    correctAnswer: 1,
    explanation: "In-order traversal visits the Left subtree, then the Root, and finally the Right subtree."
  },
  {
    question: "What is the main property of In-order Traversal in a Binary Search Tree?",
    options: [
      "Produces reverse order",
      "Produces sorted order",
      "Visits root first",
      "Visits leaves first"
    ],
    correctAnswer: 1,
    explanation: "In-order traversal of a BST always visits nodes in ascending order."
  },
  {
    question: "Which subtree is visited first during In-order Traversal?",
    options: [
      "Right subtree",
      "Root",
      "Left subtree",
      "Leaf nodes"
    ],
    correctAnswer: 2,
    explanation: "The traversal always begins with the left subtree."
  },
  {
    question: "Which node is visited after the left subtree?",
    options: [
      "Leaf node",
      "Root node",
      "Right subtree",
      "Parent node"
    ],
    correctAnswer: 1,
    explanation: "After completing the left subtree, the current root node is visited."
  },
  {
    question: "Which subtree is visited last?",
    options: [
      "Root",
      "Left subtree",
      "Right subtree",
      "Middle subtree"
    ],
    correctAnswer: 2,
    explanation: "The right subtree is visited after the root."
  },
  {
    question: "What is the time complexity of In-order Traversal?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation: "Every node is visited exactly once."
  },
  {
    question: "What is the auxiliary space complexity of recursive In-order Traversal?",
    options: [
      "O(1)",
      "O(log n) average (O(h))",
      "O(n²)",
      "O(n³)"
    ],
    correctAnswer: 1,
    explanation: "The recursion stack depends on the tree height (h)."
  },
  {
    question: "Which data structure is used internally in recursive In-order Traversal?",
    options: [
      "Queue",
      "Heap",
      "Stack",
      "Hash Table"
    ],
    correctAnswer: 2,
    explanation: "Recursive calls are managed using the system call stack."
  },
  {
    question: "Which application commonly uses In-order Traversal?",
    options: [
      "Sorting BST elements",
      "Level-order printing",
      "Graph traversal",
      "Heap construction"
    ],
    correctAnswer: 0,
    explanation: "In-order traversal retrieves BST elements in sorted order."
  },
  {
    question: "Which traversal is best for obtaining ascending values from a BST?",
    options: [
      "Pre-order",
      "Post-order",
      "In-order",
      "Level-order"
    ],
    correctAnswer: 2,
    explanation: "Only In-order traversal guarantees ascending order in a BST."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="BST In-order Traversal Quiz"
      questions={questions}
    />
  );
}