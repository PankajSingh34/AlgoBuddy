"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Which Binary Tree has every node with either 0 or 2 children?",
    options: [
      "Complete Binary Tree",
      "Perfect Binary Tree",
      "Full Binary Tree",
      "Balanced Binary Tree"
    ],
    correctAnswer: 2,
    explanation: "A Full Binary Tree allows only 0 or 2 children per node."
  },
  {
    question: "Which Binary Tree has all levels completely filled except possibly the last?",
    options: [
      "Perfect Binary Tree",
      "Complete Binary Tree",
      "Degenerate Tree",
      "Balanced Tree"
    ],
    correctAnswer: 1,
    explanation: "Complete Binary Trees fill every level except possibly the last."
  },
  {
    question: "A Perfect Binary Tree has:",
    options: [
      "Only one child per node",
      "All internal nodes with two children and all leaves at the same level",
      "Uneven height",
      "Random structure"
    ],
    correctAnswer: 1,
    explanation: "Perfect Binary Trees have all leaves at the same depth."
  },
  {
    question: "Which Binary Tree resembles a linked list?",
    options: [
      "Perfect Tree",
      "Balanced Tree",
      "Degenerate Tree",
      "Complete Tree"
    ],
    correctAnswer: 2,
    explanation: "A Degenerate Tree has only one child per node."
  },
  {
    question: "Which Binary Tree keeps height approximately logarithmic?",
    options: [
      "Balanced Binary Tree",
      "Degenerate Tree",
      "Perfect Tree",
      "Random Tree"
    ],
    correctAnswer: 0,
    explanation: "Balanced Trees maintain nearly equal subtree heights."
  },
  {
    question: "A left-skewed tree has:",
    options: [
      "Only right children",
      "Both children",
      "Only left children",
      "No children"
    ],
    correctAnswer: 2,
    explanation: "Every node has only a left child."
  },
  {
    question: "A right-skewed tree has:",
    options: [
      "Only right children",
      "Only left children",
      "Both children",
      "No children"
    ],
    correctAnswer: 0,
    explanation: "Every node has only a right child."
  },
  {
    question: "Which Binary Tree is commonly used to implement priority queues?",
    options: [
      "AVL Tree",
      "Binary Heap",
      "Red-Black Tree",
      "BST"
    ],
    correctAnswer: 1,
    explanation: "Priority queues are commonly implemented using Binary Heaps."
  },
  {
    question: "Which Binary Tree is self-balancing?",
    options: [
      "AVL Tree",
      "Degenerate Tree",
      "Complete Tree",
      "Perfect Tree"
    ],
    correctAnswer: 0,
    explanation: "AVL Trees automatically maintain balance."
  },
  {
    question: "Which statement about a Complete Binary Tree is TRUE?",
    options: [
      "Every node has two children",
      "Leaves must be at different levels",
      "Nodes in the last level are filled from left to right",
      "It always has equal subtree heights"
    ],
    correctAnswer: 2,
    explanation: "In a Complete Binary Tree, the last level is filled from left to right."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Binary Tree Types Quiz"
      questions={questions}
    />
  );
}