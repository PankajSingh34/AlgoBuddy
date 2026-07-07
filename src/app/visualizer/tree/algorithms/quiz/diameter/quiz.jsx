"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the diameter of a binary tree?",
    options: [
      "The maximum value in the tree",
      "The longest path between any two nodes",
      "The height of the root",
      "The number of leaf nodes"
    ],
    correctAnswer: 1,
    explanation:
      "The diameter is the length of the longest path between any two nodes in the tree."
  },
  {
    question: "The diameter of a tree may or may not pass through:",
    options: [
      "The root node",
      "A leaf node",
      "The left subtree",
      "The right subtree"
    ],
    correctAnswer: 0,
    explanation:
      "The longest path doesn't always pass through the root."
  },
  {
    question: "Which value is commonly computed while finding the diameter?",
    options: [
      "Width",
      "Height",
      "Depth only",
      "Level"
    ],
    correctAnswer: 1,
    explanation:
      "The height of left and right subtrees is required to compute the diameter."
  },
  {
    question: "The diameter through a node equals:",
    options: [
      "Left Height + Right Height",
      "Height × Width",
      "Depth + Height",
      "Left Nodes + Right Nodes"
    ],
    correctAnswer: 0,
    explanation:
      "Diameter passing through a node equals the height of its left subtree plus the height of its right subtree."
  },
  {
    question: "What is the time complexity of the optimized diameter algorithm?",
    options: [
      "O(n²)",
      "O(log n)",
      "O(n)",
      "O(1)"
    ],
    correctAnswer: 2,
    explanation:
      "The optimized solution computes height and diameter together in one traversal."
  },
  {
    question: "Which traversal style is commonly used for the recursive diameter algorithm?",
    options: [
      "Level Order",
      "Preorder",
      "Postorder",
      "Inorder"
    ],
    correctAnswer: 2,
    explanation:
      "Postorder traversal ensures subtree heights are known before processing the parent."
  },
  {
    question: "If a tree contains only one node, its diameter is:",
    options: [
      "0",
      "1",
      "2",
      "Undefined"
    ],
    correctAnswer: 0,
    explanation:
      "A single node has no edges, so its diameter is 0."
  },
  {
    question: "The diameter of a tree is measured using:",
    options: [
      "Edges",
      "Only nodes",
      "Levels",
      "Leaves"
    ],
    correctAnswer: 0,
    explanation:
      "Most implementations define diameter as the number of edges on the longest path."
  },
  {
    question: "Which recursive value is returned after processing each node?",
    options: [
      "Width",
      "Height",
      "Diameter",
      "Depth"
    ],
    correctAnswer: 1,
    explanation:
      "Each recursive call returns the height of the current subtree."
  },
  {
    question: "Finding the diameter of a tree is commonly used in:",
    options: [
      "Network design",
      "Tree optimization",
      "Graph analysis",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Diameter algorithms are useful in networking, graph theory, and tree-based optimization problems."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Diameter of Binary Tree Quiz"
      questions={questions}
    />
  );
}