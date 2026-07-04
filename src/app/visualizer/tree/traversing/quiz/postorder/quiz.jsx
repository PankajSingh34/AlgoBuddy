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
    question: "Which node is always visited last in Post-order Traversal?",
    options: [
      "Left child",
      "Right child",
      "Root node",
      "Leaf node"
    ],
    correctAnswer: 2,
    explanation: "The root node is visited after both left and right subtrees."
  },
  {
    question: "Which subtree is visited first in Post-order Traversal?",
    options: [
      "Right subtree",
      "Left subtree",
      "Root",
      "Middle subtree"
    ],
    correctAnswer: 1,
    explanation: "Traversal begins with the left subtree."
  },
  {
    question: "Which subtree is visited immediately after the left subtree?",
    options: [
      "Root",
      "Right subtree",
      "Leaf nodes",
      "Parent node"
    ],
    correctAnswer: 1,
    explanation: "After completing the left subtree, the traversal continues with the right subtree."
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
    explanation: "Every node is visited exactly once, resulting in O(n) time."
  },
  {
    question: "Which data structure is commonly used for iterative Post-order Traversal?",
    options: [
      "Queue",
      "Heap",
      "Stack",
      "Hash Table"
    ],
    correctAnswer: 2,
    explanation: "A stack is commonly used to implement iterative Post-order Traversal."
  },
  {
    question: "Which application commonly uses Post-order Traversal?",
    options: [
      "Printing BST values in sorted order",
      "Deleting an entire tree",
      "Finding the minimum node",
      "Level-order printing"
    ],
    correctAnswer: 1,
    explanation: "Post-order Traversal is commonly used when deleting or freeing every node of a tree."
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
    explanation: "The recursion stack requires O(h) space, where h is the height of the tree."
  },
  {
    question: "Which traversal sequence correctly represents Post-order?",
    options: [
      "Root → Left → Right",
      "Left → Root → Right",
      "Left → Right → Root",
      "Right → Root → Left"
    ],
    correctAnswer: 2,
    explanation: "Post-order Traversal always follows Left → Right → Root."
  },
  {
    question: "Post-order Traversal is most suitable when:",
    options: [
      "The parent must be processed before its children",
      "Child nodes must be processed before their parent",
      "Nodes should be visited level by level",
      "Elements need to be sorted"
    ],
    correctAnswer: 1,
    explanation: "Post-order ensures both child subtrees are processed before the parent node."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Post-order Traversal Quiz"
      questions={questions}
    />
  );
}