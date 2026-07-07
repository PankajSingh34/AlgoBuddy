"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the maximum number of children a node can have in a Binary Tree?",
    options: ["1", "2", "3", "Unlimited"],
    correctAnswer: 1,
    explanation: "Each node in a Binary Tree can have at most two children."
  },
  {
    question: "Which node is located at the top of a Binary Tree?",
    options: ["Leaf Node", "Root Node", "Internal Node", "Parent Node"],
    correctAnswer: 1,
    explanation: "The Root Node is the first and topmost node of a Binary Tree."
  },
  {
    question: "A node with no children is called:",
    options: ["Root Node", "Internal Node", "Leaf Node", "Parent Node"],
    correctAnswer: 2,
    explanation: "Leaf nodes do not have any children."
  },
  {
    question: "The number of edges from the root to a node is called:",
    options: ["Height", "Depth", "Degree", "Width"],
    correctAnswer: 1,
    explanation: "Depth is the number of edges from the root to a node."
  },
  {
    question: "The height of a Binary Tree is measured from:",
    options: [
      "Leaf to Root",
      "Root to Deepest Leaf",
      "Middle Node",
      "Any Random Node"
    ],
    correctAnswer: 1,
    explanation: "Height is the longest path from the root to a leaf."
  },
  {
    question: "How many edges are present in a Binary Tree with N nodes?",
    options: ["N", "N-1", "N+1", "2N"],
    correctAnswer: 1,
    explanation: "Every tree with N nodes has exactly N−1 edges."
  },
  {
    question: "Which traversal visits Root, Left, Right?",
    options: ["Inorder", "Postorder", "Preorder", "Level Order"],
    correctAnswer: 2,
    explanation: "Preorder traversal follows Root → Left → Right."
  },
  {
    question: "Which traversal visits Left, Root, Right?",
    options: ["Inorder", "Preorder", "Postorder", "Level Order"],
    correctAnswer: 0,
    explanation: "Inorder traversal follows Left → Root → Right."
  },
  {
    question: "Which traversal visits Left, Right, Root?",
    options: ["Inorder", "Postorder", "Preorder", "Level Order"],
    correctAnswer: 1,
    explanation: "Postorder traversal follows Left → Right → Root."
  },
  {
    question: "What is the degree of a leaf node?",
    options: ["2", "1", "0", "Depends"],
    correctAnswer: 2,
    explanation: "Leaf nodes have no children, so their degree is 0."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Binary Tree Structure & Properties Quiz"
      questions={questions}
    />
  );
}