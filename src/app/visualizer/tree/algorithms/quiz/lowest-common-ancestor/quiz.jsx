"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What does LCA stand for in Trees?",
    options: [
      "Lowest Common Ancestor",
      "Largest Common Ancestor",
      "Longest Child Algorithm",
      "Lowest Child Algorithm",
    ],
    correctAnswer: 0,
    explanation:
      "LCA stands for Lowest Common Ancestor, the deepest common ancestor of two nodes.",
  },
  {
    question: "The Lowest Common Ancestor of two nodes is:",
    options: [
      "The root node",
      "The deepest node that is an ancestor of both nodes",
      "The smallest valued node",
      "The parent of the root",
    ],
    correctAnswer: 1,
    explanation:
      "The LCA is the deepest node that has both target nodes as descendants.",
  },
  {
    question: "Which traversal is commonly used in recursive LCA algorithms?",
    options: [
      "Preorder",
      "Postorder",
      "Level Order",
      "Morris Traversal",
    ],
    correctAnswer: 1,
    explanation:
      "Recursive LCA solutions typically use postorder traversal.",
  },
  {
    question: "What is the time complexity of the standard recursive LCA algorithm in a binary tree?",
    options: [
      "O(log n)",
      "O(n)",
      "O(n log n)",
      "O(1)",
    ],
    correctAnswer: 1,
    explanation:
      "Every node may be visited once, giving O(n) complexity.",
  },
  {
    question: "In a Binary Search Tree, LCA can be found efficiently using:",
    options: [
      "Heap Property",
      "BST Property",
      "Breadth First Search",
      "Sorting",
    ],
    correctAnswer: 1,
    explanation:
      "The BST ordering property helps locate the LCA in O(h) time.",
  },
  {
    question: "If one node is an ancestor of the other, then the LCA is:",
    options: [
      "The root",
      "The descendant node",
      "The ancestor node",
      "Undefined",
    ],
    correctAnswer: 2,
    explanation:
      "A node is considered an ancestor of itself, so it becomes the LCA.",
  },
  {
    question: "Which data structure is NOT required in the recursive LCA solution?",
    options: [
      "Call Stack",
      "Binary Tree",
      "Queue",
      "Tree Nodes",
    ],
    correctAnswer: 2,
    explanation:
      "The recursive solution doesn't require a queue.",
  },
  {
    question: "Which algorithm property is used while returning from recursive calls?",
    options: [
      "Backtracking",
      "Greedy",
      "Dynamic Programming",
      "Hashing",
    ],
    correctAnswer: 0,
    explanation:
      "The recursive LCA algorithm works by backtracking from child nodes.",
  },
  {
    question: "If the two target nodes lie in different subtrees of a node, then that node is:",
    options: [
      "Leaf",
      "Lowest Common Ancestor",
      "Parent of Root",
      "Balanced Node",
    ],
    correctAnswer: 1,
    explanation:
      "The first node where both targets split into different branches is their LCA.",
  },
  {
    question: "Which application commonly uses Lowest Common Ancestor algorithms?",
    options: [
      "Version Control Systems",
      "Network Routing",
      "Genealogy Trees",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "LCA algorithms are useful in genealogy, routing, compiler analysis, and many tree-based applications.",
  },
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Lowest Common Ancestor Quiz"
      questions={questions}
    />
  );
}