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
      "Right → Left → Root"
    ],
    correctAnswer: 1,
    explanation: "Pre-order traversal visits the Root first, followed by the Left subtree and then the Right subtree."
  },
  {
    question: "Which node is visited first during Pre-order Traversal?",
    options: [
      "Left child",
      "Right child",
      "Root node",
      "Leaf node"
    ],
    correctAnswer: 2,
    explanation: "The root node is always visited first in Pre-order traversal."
  },
  {
    question: "Which subtree is completely traversed immediately after the root?",
    options: [
      "Right subtree",
      "Left subtree",
      "Both simultaneously",
      "No subtree"
    ],
    correctAnswer: 1,
    explanation: "After visiting the root, the entire left subtree is traversed before moving to the right subtree."
  },
  {
    question: "Which data structure is commonly used for iterative Pre-order Traversal?",
    options: [
      "Queue",
      "Stack",
      "Heap",
      "Hash Table"
    ],
    correctAnswer: 1,
    explanation: "A stack is used to simulate recursion in iterative Pre-order traversal."
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
    question: "What is the auxiliary space complexity of recursive Pre-order Traversal?",
    options: [
      "O(1)",
      "O(h)",
      "O(n²)",
      "O(log log n)"
    ],
    correctAnswer: 1,
    explanation: "The recursion stack requires O(h) space where h is the tree height."
  },
  {
    question: "Which application commonly uses Pre-order Traversal?",
    options: [
      "Sorting BST elements",
      "Copying or serializing a tree",
      "Deleting a tree",
      "Level-order printing"
    ],
    correctAnswer: 1,
    explanation: "Pre-order traversal is useful for copying and serializing tree structures."
  },
  {
    question: "Which sequence correctly represents a Pre-order traversal?",
    options: [
      "Root → Left → Right",
      "Left → Root → Right",
      "Left → Right → Root",
      "Right → Root → Left"
    ],
    correctAnswer: 0,
    explanation: "Pre-order traversal always follows Root → Left → Right."
  },
  {
    question: "Recursive Pre-order Traversal primarily relies on:",
    options: [
      "Queue",
      "Stack (call stack)",
      "Heap",
      "Linked List"
    ],
    correctAnswer: 1,
    explanation: "Recursive function calls are managed by the system call stack."
  },
  {
    question: "Pre-order Traversal is especially useful when:",
    options: [
      "Printing sorted values",
      "Constructing or saving tree structures",
      "Finding minimum values",
      "Balancing AVL trees"
    ],
    correctAnswer: 1,
    explanation: "Pre-order traversal preserves parent-child relationships, making it useful for tree reconstruction."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Pre-order Traversal Quiz"
      questions={questions}
    />
  );
}