"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the height of a tree?",
    options: [
      "The number of nodes in the tree",
      "The length of the longest path from the root to a leaf",
      "The number of leaf nodes",
      "The diameter of the tree"
    ],
    correctAnswer: 1,
    explanation:
      "The height of a tree is the number of edges (or sometimes nodes) on the longest path from the root to a leaf."
  },
  {
    question: "What is the height of an empty tree?",
    options: [
      "-1",
      "0",
      "1",
      "Undefined"
    ],
    correctAnswer: 0,
    explanation:
      "In most implementations, the height of an empty tree is defined as -1."
  },
  {
    question: "What is the height of a tree containing only the root node?",
    options: [
      "0",
      "1",
      "2",
      "-1"
    ],
    correctAnswer: 0,
    explanation:
      "A single-node tree has a height of 0 because there are no edges below the root."
  },
  {
    question: "Which traversal is commonly used to compute the height recursively?",
    options: [
      "Preorder",
      "Inorder",
      "Postorder",
      "Level Order"
    ],
    correctAnswer: 2,
    explanation:
      "Postorder traversal computes the heights of child subtrees before processing the parent."
  },
  {
    question: "The height of a node is calculated as:",
    options: [
      "min(left, right) + 1",
      "max(left, right) + 1",
      "left + right",
      "left - right"
    ],
    correctAnswer: 1,
    explanation:
      "The height of a node equals the maximum height of its children plus one."
  },
  {
    question: "What is the time complexity of computing the height of a binary tree?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Each node is visited once while computing the height."
  },
  {
    question: "Which data structure is used implicitly in the recursive solution?",
    options: [
      "Queue",
      "Stack",
      "Heap",
      "Hash Map"
    ],
    correctAnswer: 1,
    explanation:
      "Recursive calls use the system call stack."
  },
  {
    question: "A balanced binary tree generally has a height of:",
    options: [
      "O(log n)",
      "O(n)",
      "O(n²)",
      "O(1)"
    ],
    correctAnswer: 0,
    explanation:
      "Balanced trees maintain logarithmic height."
  },
  {
    question: "Why is tree height important?",
    options: [
      "It determines search efficiency",
      "It determines insertion order",
      "It counts leaf nodes",
      "It stores parent nodes"
    ],
    correctAnswer: 0,
    explanation:
      "Operations like search, insertion, and deletion often depend on the tree's height."
  },
  {
    question: "Which application commonly requires tree height calculation?",
    options: [
      "AVL Tree balancing",
      "Heap operations",
      "Expression trees",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Tree height is fundamental in AVL Trees, Heaps, expression trees, and many other tree algorithms."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Height of Tree Quiz"
      questions={questions}
    />
  );
}