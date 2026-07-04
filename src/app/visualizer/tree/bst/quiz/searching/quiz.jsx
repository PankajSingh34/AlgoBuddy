"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary advantage of searching in a Binary Search Tree compared to a normal Binary Tree?",
    options: [
      "It always takes O(1) time",
      "It uses less memory",
      "The BST property allows efficient searching",
      "It does not require recursion"
    ],
    correctAnswer: 2,
    explanation: "The BST ordering property allows us to eliminate half of the search path at each step."
  },
  {
    question: "If the search key is smaller than the current node, where should the search continue?",
    options: [
      "Right subtree",
      "Left subtree",
      "Parent node",
      "Root node"
    ],
    correctAnswer: 1,
    explanation: "Smaller values are always located in the left subtree."
  },
  {
    question: "If the search key is greater than the current node, where should the search continue?",
    options: [
      "Left subtree",
      "Parent node",
      "Right subtree",
      "Root node"
    ],
    correctAnswer: 2,
    explanation: "Greater values are always located in the right subtree."
  },
  {
    question: "What is the average-case time complexity of searching in a balanced BST?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Balanced BSTs have logarithmic height, resulting in O(log n) search."
  },
  {
    question: "What is the worst-case time complexity of searching in a skewed BST?",
    options: [
      "O(log n)",
      "O(1)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 2,
    explanation: "A skewed BST behaves like a linked list, requiring O(n) search."
  },
  {
    question: "When does the search operation stop successfully?",
    options: [
      "When the root is reached",
      "When the target value matches the current node",
      "When a leaf node is found",
      "When both children exist"
    ],
    correctAnswer: 1,
    explanation: "The search is successful when the current node contains the target value."
  },
  {
    question: "What indicates that an element is not present in the BST?",
    options: [
      "The traversal reaches NULL",
      "The root changes",
      "The tree becomes empty",
      "The parent node is reached"
    ],
    correctAnswer: 0,
    explanation: "If the search reaches a NULL pointer, the element does not exist."
  },
  {
    question: "Which traversal of a BST always produces sorted output?",
    options: [
      "Preorder",
      "Postorder",
      "Level Order",
      "Inorder"
    ],
    correctAnswer: 3,
    explanation: "Inorder traversal visits nodes in ascending order."
  },
  {
    question: "Searching in a BST mainly depends on:",
    options: [
      "Number of leaf nodes",
      "Height of the tree",
      "Number of edges",
      "Tree width"
    ],
    correctAnswer: 1,
    explanation: "The search complexity is proportional to the height of the tree."
  },
  {
    question: "Which implementation approach is commonly used for BST searching?",
    options: [
      "Recursion or Iteration",
      "Dynamic Programming",
      "Breadth First Search only",
      "Hashing"
    ],
    correctAnswer: 0,
    explanation: "BST searching can be implemented using either recursion or iteration."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="BST Searching Quiz"
      questions={questions}
    />
  );
}