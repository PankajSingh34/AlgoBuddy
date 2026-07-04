"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the correct order of Post-order Traversal?",
    options: [
      "Root → Left → Right",
      "Left → Root → Right",
      "Left → Right → Root",
      "Right → Left → Root"
    ],
    correctAnswer: 2,
    explanation: "Post-order traversal visits the Left subtree, then the Right subtree, and finally the Root."
  },
  {
    question: "Which node is visited last during Post-order Traversal?",
    options: [
      "Leaf node",
      "Left child",
      "Right child",
      "Root node"
    ],
    correctAnswer: 3,
    explanation: "The root node is always visited after both subtrees."
  },
  {
    question: "Which subtree is visited first in Post-order Traversal?",
    options: [
      "Right subtree",
      "Root",
      "Left subtree",
      "Middle subtree"
    ],
    correctAnswer: 2,
    explanation: "The traversal begins with the left subtree."
  },
  {
    question: "Which subtree is visited after the left subtree?",
    options: [
      "Root",
      "Right subtree",
      "Leaf nodes",
      "Parent node"
    ],
    correctAnswer: 1,
    explanation: "After the left subtree, the right subtree is traversed."
  },
  {
    question: "What is the time complexity of Post-order Traversal?",
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
    question: "Which data structure supports recursive Post-order Traversal?",
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
    question: "Which application commonly uses Post-order Traversal?",
    options: [
      "Sorting BST elements",
      "Deleting or freeing a tree",
      "Level-order traversal",
      "Searching in BST"
    ],
    correctAnswer: 1,
    explanation: "Post-order traversal deletes child nodes before deleting the parent."
  },
  {
    question: "What is the auxiliary space complexity of recursive Post-order Traversal?",
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
    question: "Does Post-order Traversal produce sorted output in a BST?",
    options: [
      "Yes",
      "No",
      "Only in AVL Trees",
      "Only for Complete Binary Trees"
    ],
    correctAnswer: 1,
    explanation: "Only In-order traversal produces sorted output in a Binary Search Tree."
  },
  {
    question: "Which sequence correctly represents Post-order Traversal?",
    options: [
      "Root → Left → Right",
      "Left → Root → Right",
      "Left → Right → Root",
      "Right → Root → Left"
    ],
    correctAnswer: 2,
    explanation: "Post-order traversal follows Left → Right → Root."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="BST Post-order Traversal Quiz"
      questions={questions}
    />
  );
}