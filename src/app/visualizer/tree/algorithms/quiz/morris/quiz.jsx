"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary advantage of Morris Traversal?",
    options: [
      "It uses recursion.",
      "It performs tree traversal without using recursion or a stack.",
      "It sorts the tree.",
      "It balances the tree."
    ],
    correctAnswer: 1,
    explanation:
      "Morris Traversal visits nodes without recursion or an explicit stack by temporarily modifying tree links."
  },
  {
    question: "What is the auxiliary space complexity of Morris Traversal?",
    options: [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Morris Traversal uses constant extra space."
  },
  {
    question: "Which tree pointer is temporarily modified during Morris Traversal?",
    options: [
      "Left pointer",
      "Parent pointer",
      "Right pointer",
      "Root pointer"
    ],
    correctAnswer: 2,
    explanation:
      "The right pointer of the inorder predecessor is temporarily linked to the current node."
  },
  {
    question: "Morris Traversal is primarily used to perform:",
    options: [
      "Level Order Traversal",
      "Inorder Traversal",
      "Breadth First Search",
      "Heap Traversal"
    ],
    correctAnswer: 1,
    explanation:
      "The original Morris algorithm performs Inorder Traversal without extra space."
  },
  {
    question: "What is the time complexity of Morris Traversal?",
    options: [
      "O(log n)",
      "O(n)",
      "O(n²)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation:
      "Every edge is traversed at most twice, resulting in O(n) time."
  },
  {
    question: "Why is Morris Traversal considered efficient?",
    options: [
      "It avoids recursion and stack usage.",
      "It reduces the number of tree nodes.",
      "It balances the tree automatically.",
      "It sorts the tree."
    ],
    correctAnswer: 0,
    explanation:
      "Its major advantage is constant auxiliary space."
  },
  {
    question: "After visiting a node, the temporary threaded link is:",
    options: [
      "Deleted permanently",
      "Ignored",
      "Restored to its original NULL value",
      "Converted into a left pointer"
    ],
    correctAnswer: 2,
    explanation:
      "Temporary links are always removed to restore the original tree."
  },
  {
    question: "Morris Traversal relies on finding the:",
    options: [
      "Root node",
      "Leaf node",
      "Inorder predecessor",
      "Maximum node"
    ],
    correctAnswer: 2,
    explanation:
      "The algorithm repeatedly finds the inorder predecessor of the current node."
  },
  {
    question: "Which traversal can also be implemented using Morris Traversal with slight modifications?",
    options: [
      "Preorder Traversal",
      "Level Order Traversal",
      "Boundary Traversal",
      "Vertical Order Traversal"
    ],
    correctAnswer: 0,
    explanation:
      "Morris Traversal can be adapted to perform Preorder Traversal."
  },
  {
    question: "Morris Traversal is commonly used when:",
    options: [
      "Memory usage must be minimized",
      "The tree must be balanced",
      "Only leaf nodes are required",
      "The tree is stored in an array"
    ],
    correctAnswer: 0,
    explanation:
      "Morris Traversal is ideal when O(1) auxiliary space is required."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Morris Traversal Quiz"
      questions={questions}
    />
  );
}