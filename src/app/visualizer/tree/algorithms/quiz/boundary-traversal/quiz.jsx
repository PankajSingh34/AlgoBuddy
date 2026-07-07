"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is Boundary Traversal of a Binary Tree?",
    options: [
      "Traversing only the leaf nodes",
      "Traversing nodes on the boundary of the tree in anti-clockwise order",
      "Traversing all internal nodes",
      "Traversing only the root node"
    ],
    correctAnswer: 1,
    explanation:
      "Boundary Traversal visits the boundary nodes of a binary tree in anti-clockwise order."
  },
  {
    question: "Which node is always included first in Boundary Traversal?",
    options: [
      "Left-most leaf",
      "Root node",
      "Right-most node",
      "Last leaf"
    ],
    correctAnswer: 1,
    explanation:
      "Boundary Traversal always starts from the root node."
  },
  {
    question: "Which part is traversed immediately after the root?",
    options: [
      "Right Boundary",
      "Leaf Nodes",
      "Left Boundary",
      "Bottom View"
    ],
    correctAnswer: 2,
    explanation:
      "After visiting the root, the left boundary is traversed (excluding leaf nodes)."
  },
  {
    question: "Which nodes are visited after the Left Boundary?",
    options: [
      "Right Boundary",
      "Leaf Nodes",
      "Root",
      "Top View"
    ],
    correctAnswer: 1,
    explanation:
      "All leaf nodes from left to right are visited after the left boundary."
  },
  {
    question: "In Boundary Traversal, the Right Boundary is visited:",
    options: [
      "Top to Bottom",
      "Bottom to Top",
      "Randomly",
      "Level by Level"
    ],
    correctAnswer: 1,
    explanation:
      "The right boundary is added in reverse order (bottom to top)."
  },
  {
    question: "Leaf nodes are traversed:",
    options: [
      "Right to Left",
      "Top to Bottom",
      "Left to Right",
      "Only on the left subtree"
    ],
    correctAnswer: 2,
    explanation:
      "Leaf nodes are collected from left to right."
  },
  {
    question: "What is the time complexity of Boundary Traversal?",
    options: [
      "O(log n)",
      "O(n)",
      "O(n²)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation:
      "Every node is visited at most once."
  },
  {
    question: "Which traversal is commonly used while collecting leaf nodes?",
    options: [
      "DFS",
      "BFS",
      "Binary Search",
      "Heap Traversal"
    ],
    correctAnswer: 0,
    explanation:
      "Depth-First Search (DFS) is commonly used to collect leaf nodes."
  },
  {
    question: "Which nodes are excluded from the Left and Right Boundary lists?",
    options: [
      "Internal Nodes",
      "Leaf Nodes",
      "Root Node",
      "Parent Nodes"
    ],
    correctAnswer: 1,
    explanation:
      "Leaf nodes are excluded because they are collected separately."
  },
  {
    question: "Boundary Traversal is commonly asked in:",
    options: [
      "Tree visualization problems",
      "Technical interviews",
      "Competitive programming",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Boundary Traversal is a popular interview and competitive programming problem."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Boundary Traversal Quiz"
      questions={questions}
    />
  );
}