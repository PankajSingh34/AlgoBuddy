"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Which node is the easiest to delete in a Binary Search Tree?",
    options: [
      "Root node",
      "Leaf node",
      "Node with two children",
      "Internal node"
    ],
    correctAnswer: 1,
    explanation: "A leaf node has no children, so it can simply be removed."
  },
  {
    question: "How many cases are there for deleting a node in a BST?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
    explanation: "Deletion has three cases: leaf node, one child, and two children."
  },
  {
    question: "When deleting a node with one child, what happens?",
    options: [
      "Delete both nodes",
      "Replace the node with its child",
      "Delete the child",
      "Rebuild the tree"
    ],
    correctAnswer: 1,
    explanation: "The child takes the deleted node's position."
  },
  {
    question: "When deleting a node with two children, which node commonly replaces it?",
    options: [
      "Random node",
      "Parent node",
      "Inorder Successor or Inorder Predecessor",
      "Leaf node"
    ],
    correctAnswer: 2,
    explanation: "The inorder successor (or predecessor) preserves BST properties."
  },
  {
    question: "The inorder successor is:",
    options: [
      "Largest node in left subtree",
      "Smallest node in right subtree",
      "Root node",
      "Parent node"
    ],
    correctAnswer: 1,
    explanation: "The inorder successor is the minimum value in the right subtree."
  },
  {
    question: "Average-case deletion complexity in a balanced BST is:",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Balanced BST deletion requires traversing tree height."
  },
  {
    question: "Worst-case deletion complexity in a skewed BST is:",
    options: [
      "O(log n)",
      "O(n)",
      "O(1)",
      "O(n log n)"
    ],
    correctAnswer: 1,
    explanation: "A skewed BST behaves like a linked list."
  },
  {
    question: "Deleting the root node with two children generally requires:",
    options: [
      "AVL Rotation",
      "Finding inorder successor/predecessor",
      "Sorting the tree",
      "Deleting the entire subtree"
    ],
    correctAnswer: 1,
    explanation: "The inorder successor/predecessor replaces the deleted root."
  },
  {
    question: "Which traversal still gives sorted order after correct deletion?",
    options: [
      "Preorder",
      "Postorder",
      "Inorder",
      "Level Order"
    ],
    correctAnswer: 2,
    explanation: "A correctly maintained BST always gives sorted output in inorder."
  },
  {
    question: "BST deletion mainly depends on:",
    options: [
      "Number of nodes",
      "Tree height",
      "Number of leaves",
      "Node colors"
    ],
    correctAnswer: 1,
    explanation: "Deletion complexity depends on the height of the tree."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="BST Deletion Quiz"
      questions={questions}
    />
  );
}