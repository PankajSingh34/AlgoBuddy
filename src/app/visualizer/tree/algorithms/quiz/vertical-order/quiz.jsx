"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is Vertical Order Traversal in a Binary Tree?",
    options: [
      "Visiting nodes level by level",
      "Grouping nodes based on their horizontal distance from the root",
      "Traversing only leaf nodes",
      "Traversing only the left subtree"
    ],
    correctAnswer: 1,
    explanation:
      "Vertical Order Traversal groups nodes according to their horizontal distance (HD) from the root."
  },
  {
    question: "What is the Horizontal Distance (HD) of the root node?",
    options: [
      "-1",
      "0",
      "1",
      "Depends on the tree"
    ],
    correctAnswer: 1,
    explanation:
      "The root is always assigned a horizontal distance of 0."
  },
  {
    question: "Moving to the left child changes the Horizontal Distance by:",
    options: [
      "+1",
      "-1",
      "0",
      "+2"
    ],
    correctAnswer: 1,
    explanation:
      "The left child decreases the horizontal distance by 1."
  },
  {
    question: "Moving to the right child changes the Horizontal Distance by:",
    options: [
      "-1",
      "0",
      "+1",
      "+2"
    ],
    correctAnswer: 2,
    explanation:
      "The right child increases the horizontal distance by 1."
  },
  {
    question: "Which traversal technique is commonly used for Vertical Order Traversal?",
    options: [
      "Depth-First Search only",
      "Breadth-First Search (Level Order)",
      "Postorder Traversal",
      "Morris Traversal"
    ],
    correctAnswer: 1,
    explanation:
      "Level Order Traversal ensures nodes are processed level by level for each horizontal distance."
  },
  {
    question: "Which data structure is commonly used to group nodes by horizontal distance?",
    options: [
      "Queue and Map",
      "Stack",
      "Heap",
      "Linked List"
    ],
    correctAnswer: 0,
    explanation:
      "A queue performs BFS while a map stores nodes according to their horizontal distance."
  },
  {
    question: "What is the time complexity of Vertical Order Traversal?",
    options: [
      "O(log n)",
      "O(n)",
      "O(n²)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation:
      "Each node is visited exactly once during traversal."
  },
  {
    question: "Why is Breadth-First Search preferred over DFS for Vertical Order Traversal?",
    options: [
      "It uses less memory",
      "It naturally preserves top-to-bottom ordering",
      "It is always faster",
      "DFS cannot visit all nodes"
    ],
    correctAnswer: 1,
    explanation:
      "BFS processes nodes level by level, preserving the correct vertical order."
  },
  {
    question: "Which tree view problem is closely related to Vertical Order Traversal?",
    options: [
      "Top View",
      "Bottom View",
      "Left View",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Top View, Bottom View, and Vertical Order all rely on horizontal distances."
  },
  {
    question: "Vertical Order Traversal is commonly used in:",
    options: [
      "Binary tree visualization",
      "Interview coding questions",
      "Competitive programming",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Vertical Order Traversal is a common tree algorithm in interviews and competitive programming."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Vertical Order Traversal Quiz"
      questions={questions}
    />
  );
}