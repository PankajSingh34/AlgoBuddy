"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What property must always be maintained while inserting a node into a Binary Search Tree?",
    options: [
      "Left child > Parent and Right child < Parent",
      "Left subtree contains smaller values and Right subtree contains larger values",
      "Both subtrees contain equal values",
      "Nodes are inserted randomly"
    ],
    correctAnswer: 1,
    explanation: "In a BST, every left subtree contains smaller values and every right subtree contains larger values than the parent."
  },
  {
    question: "Where is a new node inserted in a BST?",
    options: [
      "Always at the root",
      "Always as the left child",
      "At the first available position satisfying BST properties",
      "Randomly"
    ],
    correctAnswer: 2,
    explanation: "The node is inserted where it satisfies the BST ordering property."
  },
  {
    question: "What is the average-case time complexity of BST insertion?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 1,
    explanation: "For a balanced BST, insertion takes O(log n)."
  },
  {
    question: "What is the worst-case time complexity of BST insertion?",
    options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
    correctAnswer: 1,
    explanation: "A skewed BST behaves like a linked list, resulting in O(n) insertion."
  },
  {
    question: "If the inserted value is smaller than the current node, where should the algorithm move?",
    options: [
      "Right subtree",
      "Parent node",
      "Left subtree",
      "Root"
    ],
    correctAnswer: 2,
    explanation: "Smaller values are always inserted into the left subtree."
  },
  {
    question: "If the inserted value is greater than the current node, where should the algorithm move?",
    options: [
      "Left subtree",
      "Root",
      "Right subtree",
      "Previous node"
    ],
    correctAnswer: 2,
    explanation: "Greater values are always inserted into the right subtree."
  },
  {
    question: "Which traversal displays inserted elements in sorted order?",
    options: [
      "Preorder",
      "Postorder",
      "Level Order",
      "Inorder"
    ],
    correctAnswer: 3,
    explanation: "Inorder traversal of a BST always produces sorted output."
  },
  {
    question: "What happens if duplicate values are not allowed in a BST?",
    options: [
      "Duplicates are ignored",
      "Duplicates become root",
      "Duplicates go to both sides",
      "Tree becomes invalid"
    ],
    correctAnswer: 0,
    explanation: "Most BST implementations simply ignore duplicate insertions."
  },
  {
    question: "Insertion in a balanced BST primarily depends on:",
    options: [
      "Number of leaf nodes",
      "Height of the tree",
      "Number of edges",
      "Number of internal nodes"
    ],
    correctAnswer: 1,
    explanation: "Insertion time depends on the height of the tree."
  },
  {
    question: "Which data structure concept does BST insertion mainly use?",
    options: [
      "Recursion or Iteration",
      "Hashing",
      "Queue",
      "Stack only"
    ],
    correctAnswer: 0,
    explanation: "BST insertion is commonly implemented recursively or iteratively."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="BST Insertion Quiz"
      questions={questions}
    />
  );
}