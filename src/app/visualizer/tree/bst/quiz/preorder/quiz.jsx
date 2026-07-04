"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the correct order of Pre-order Traversal?",
    options: [
      "Left → Root → Right",
      "Root → Left → Right",
      "Left → Right → Root",
      "Right → Root → Left"
    ],
    correctAnswer: 1,
    explanation: "Pre-order traversal visits the Root first, followed by the Left subtree and then the Right subtree."
  },
  {
    question: "Which node is visited first during Pre-order Traversal?",
    options: [
      "Left child",
      "Root node",
      "Right child",
      "Leaf node"
    ],
    correctAnswer: 1,
    explanation: "The root node is always processed before its children."
  },
  {
    question: "Which subtree is visited after the root?",
    options: [
      "Right subtree",
      "Left subtree",
      "Middle subtree",
      "None"
    ],
    correctAnswer: 1,
    explanation: "The left subtree is completely traversed before moving to the right subtree."
  },
  {
    question: "Which subtree is visited last in Pre-order Traversal?",
    options: [
      "Left subtree",
      "Root",
      "Right subtree",
      "Leaf nodes"
    ],
    correctAnswer: 2,
    explanation: "The right subtree is visited after the left subtree."
  },
  {
    question: "What is the time complexity of Pre-order Traversal?",
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
    question: "Which data structure supports recursive Pre-order Traversal?",
    options: [
      "Queue",
      "Heap",
      "Stack",
      "Graph"
    ],
    correctAnswer: 2,
    explanation: "Recursive function calls use the system call stack."
  },
  {
    question: "Which application commonly uses Pre-order Traversal?",
    options: [
      "Deleting a tree",
      "Creating a copy of a tree",
      "Sorting BST values",
      "Level-order printing"
    ],
    correctAnswer: 1,
    explanation: "Pre-order traversal is commonly used to copy or serialize a tree."
  },
  {
    question: "In a BST, does Pre-order Traversal produce sorted output?",
    options: [
      "Always",
      "Never",
      "Only for balanced trees",
      "Only for AVL trees"
    ],
    correctAnswer: 1,
    explanation: "Only In-order traversal produces sorted output in a BST."
  },
  {
    question: "What is the auxiliary space complexity of recursive Pre-order Traversal?",
    options: [
      "O(1)",
      "O(h)",
      "O(n²)",
      "O(log log n)"
    ],
    correctAnswer: 1,
    explanation: "The recursion stack depends on the tree height (h)."
  },
  {
    question: "Which traversal sequence correctly represents Pre-order?",
    options: [
      "Root → Left → Right",
      "Left → Root → Right",
      "Left → Right → Root",
      "Right → Left → Root"
    ],
    correctAnswer: 0,
    explanation: "Pre-order traversal follows Root → Left → Right."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="BST Pre-order Traversal Quiz"
      questions={questions}
    />
  );
}