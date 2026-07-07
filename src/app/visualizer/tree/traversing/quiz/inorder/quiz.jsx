"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the correct order of In-order Traversal?",
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
    question: "In a Binary Search Tree, what does In-order Traversal produce?",
    options: [
      "Descending order",
      "Random order",
      "Ascending sorted order",
      "Level-wise order"
    ],
    correctAnswer: 2,
    explanation: "In-order traversal of a BST always visits nodes in ascending order."
  },
  {
    question: "Which subtree is visited first during In-order Traversal?",
    options: [
      "Right subtree",
      "Left subtree",
      "Root",
      "Leaf nodes"
    ],
    correctAnswer: 1,
    explanation: "The traversal always starts with the left subtree."
  },
  {
    question: "When is the root node processed in In-order Traversal?",
    options: [
      "Before both subtrees",
      "After the left subtree",
      "After the right subtree",
      "Last"
    ],
    correctAnswer: 1,
    explanation: "The root is visited after the left subtree but before the right subtree."
  },
  {
    question: "Which subtree is visited after the root?",
    options: [
      "Left subtree",
      "Right subtree",
      "None",
      "Middle subtree"
    ],
    correctAnswer: 1,
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
    explanation: "Each node is visited exactly once."
  },
  {
    question: "Which data structure is used in iterative In-order Traversal?",
    options: [
      "Queue",
      "Heap",
      "Stack",
      "Hash Table"
    ],
    correctAnswer: 2,
    explanation: "A stack is used to simulate recursive traversal."
  },
  {
    question: "What is the auxiliary space complexity of recursive In-order Traversal?",
    options: [
      "O(1)",
      "O(h)",
      "O(n²)",
      "O(log log n)"
    ],
    correctAnswer: 1,
    explanation: "The recursion stack requires O(h) space, where h is the tree height."
  },
  {
    question: "Which application commonly uses In-order Traversal?",
    options: [
      "Deleting a tree",
      "Printing BST elements in sorted order",
      "Breadth-First Search",
      "Heap construction"
    ],
    correctAnswer: 1,
    explanation: "In-order traversal is commonly used to retrieve BST elements in sorted order."
  },
  {
    question: "Which traversal sequence represents In-order Traversal?",
    options: [
      "Root → Left → Right",
      "Left → Root → Right",
      "Left → Right → Root",
      "Right → Root → Left"
    ],
    correctAnswer: 1,
    explanation: "The correct order is Left → Root → Right."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="In-order Traversal Quiz"
      questions={questions}
    />
  );
}