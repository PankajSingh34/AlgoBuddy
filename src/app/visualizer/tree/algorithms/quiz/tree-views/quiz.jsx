"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What does the Left View of a binary tree represent?",
    options: [
      "All leaf nodes",
      "The first node visible from the left side at each level",
      "The last node at each level",
      "Only the root node"
    ],
    correctAnswer: 1,
    explanation:
      "The Left View consists of the first node encountered at every level when viewed from the left."
  },
  {
    question: "What does the Right View of a binary tree represent?",
    options: [
      "All right child nodes",
      "The last node visible from the right side at each level",
      "Only leaf nodes",
      "The root and its right child"
    ],
    correctAnswer: 1,
    explanation:
      "The Right View contains the last visible node at every level."
  },
  {
    question: "Which traversal is commonly used to compute Left and Right Views?",
    options: [
      "Depth-First Search",
      "Level Order Traversal",
      "Inorder Traversal",
      "Postorder Traversal"
    ],
    correctAnswer: 1,
    explanation:
      "Level Order Traversal (BFS) naturally processes nodes level by level."
  },
  {
    question: "The Top View of a binary tree contains:",
    options: [
      "The highest node for each horizontal distance",
      "All root-to-leaf paths",
      "Only left subtree nodes",
      "Only right subtree nodes"
    ],
    correctAnswer: 0,
    explanation:
      "The Top View shows the first node encountered at every horizontal distance."
  },
  {
    question: "The Bottom View of a binary tree contains:",
    options: [
      "The deepest node for each horizontal distance",
      "Only leaf nodes",
      "Only internal nodes",
      "The root node"
    ],
    correctAnswer: 0,
    explanation:
      "Bottom View keeps the last (deepest) node for every horizontal distance."
  },
  {
    question: "Which data structure is commonly used while computing Top View?",
    options: [
      "Queue and Hash Map",
      "Stack",
      "Heap",
      "Priority Queue"
    ],
    correctAnswer: 0,
    explanation:
      "A queue performs level-order traversal while a map stores horizontal distances."
  },
  {
    question: "Horizontal Distance (HD) of the root node is:",
    options: [
      "-1",
      "0",
      "1",
      "Depends on the tree"
    ],
    correctAnswer: 1,
    explanation:
      "The root node is assigned a horizontal distance of 0."
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
      "Each left child decreases the horizontal distance by 1."
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
      "Each right child increases the horizontal distance by 1."
  },
  {
    question: "Tree Views are commonly used in:",
    options: [
      "Visualization problems",
      "Interview coding questions",
      "Tree analysis",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Tree Views are widely used in visualization, competitive programming, and interviews."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Tree Views Quiz"
      questions={questions}
    />
  );
}