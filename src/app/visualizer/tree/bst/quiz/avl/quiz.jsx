"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of an AVL Tree?",
    options: [
      "To store duplicate values",
      "To maintain a balanced Binary Search Tree",
      "To reduce memory usage",
      "To perform breadth-first traversal"
    ],
    correctAnswer: 1,
    explanation: "AVL Trees automatically maintain balance after insertion and deletion, ensuring efficient operations."
  },
  {
    question: "Who invented the AVL Tree?",
    options: [
      "Donald Knuth",
      "Adelson-Velsky and Landis",
      "Alan Turing",
      "Edsger Dijkstra"
    ],
    correctAnswer: 1,
    explanation: "AVL stands for Adelson-Velsky and Landis, the inventors of the AVL Tree."
  },
  {
    question: "What is the balance factor of a node?",
    options: [
      "Height of left subtree + Height of right subtree",
      "Height of left subtree − Height of right subtree",
      "Number of children",
      "Depth − Height"
    ],
    correctAnswer: 1,
    explanation: "Balance Factor = Height(Left Subtree) − Height(Right Subtree)."
  },
  {
    question: "Which balance factor values are allowed in an AVL Tree?",
    options: [
      "-2, -1, 0",
      "-1, 0, +1",
      "0, +1, +2",
      "Only 0"
    ],
    correctAnswer: 1,
    explanation: "Every node in an AVL Tree must have a balance factor of -1, 0, or +1."
  },
  {
    question: "Which rotation is performed for a Left-Left (LL) imbalance?",
    options: [
      "Left Rotation",
      "Right Rotation",
      "Left-Right Rotation",
      "Right-Left Rotation"
    ],
    correctAnswer: 1,
    explanation: "A Right Rotation fixes a Left-Left imbalance."
  },
  {
    question: "Which rotation is performed for a Right-Right (RR) imbalance?",
    options: [
      "Left Rotation",
      "Right Rotation",
      "Left-Right Rotation",
      "Right-Left Rotation"
    ],
    correctAnswer: 0,
    explanation: "A Left Rotation fixes a Right-Right imbalance."
  },
  {
    question: "Which rotation fixes a Left-Right (LR) imbalance?",
    options: [
      "Single Left Rotation",
      "Single Right Rotation",
      "Left Rotation followed by Right Rotation",
      "Right Rotation followed by Left Rotation"
    ],
    correctAnswer: 2,
    explanation: "An LR imbalance is corrected using a Left Rotation on the child followed by a Right Rotation on the parent."
  },
  {
    question: "Which rotation fixes a Right-Left (RL) imbalance?",
    options: [
      "Right Rotation followed by Left Rotation",
      "Left Rotation followed by Right Rotation",
      "Single Right Rotation",
      "Single Left Rotation"
    ],
    correctAnswer: 0,
    explanation: "An RL imbalance is corrected using a Right Rotation on the child followed by a Left Rotation on the parent."
  },
  {
    question: "What is the average time complexity of searching in an AVL Tree?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "AVL Trees remain balanced, giving O(log n) search complexity."
  },
  {
    question: "Why are AVL Trees generally faster than ordinary BSTs for searching?",
    options: [
      "They use hashing",
      "They always remain height-balanced",
      "They allow duplicate keys",
      "They store nodes in arrays"
    ],
    correctAnswer: 1,
    explanation: "Because AVL Trees maintain balance, their height remains logarithmic, resulting in faster search, insertion, and deletion."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="AVL Balancing Quiz"
      questions={questions}
    />
  );
}