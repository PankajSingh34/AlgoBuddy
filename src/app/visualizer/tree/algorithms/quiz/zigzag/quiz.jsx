"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is Zigzag Traversal of a Binary Tree?",
    options: [
      "Traversing only left children",
      "Traversing level by level while alternating direction",
      "Traversing leaf nodes only",
      "Traversing in sorted order"
    ],
    correctAnswer: 1,
    explanation:
      "Zigzag Traversal visits tree levels alternately from left-to-right and right-to-left."
  },
  {
    question: "Zigzag Traversal is also known as:",
    options: [
      "Diagonal Traversal",
      "Spiral Traversal",
      "Boundary Traversal",
      "Morris Traversal"
    ],
    correctAnswer: 1,
    explanation:
      "Zigzag Traversal is commonly called Spiral Traversal."
  },
  {
    question: "Which traversal forms the basis of Zigzag Traversal?",
    options: [
      "Inorder Traversal",
      "Preorder Traversal",
      "Level Order Traversal",
      "Postorder Traversal"
    ],
    correctAnswer: 2,
    explanation:
      "Zigzag Traversal is a modified Level Order (Breadth-First Search) traversal."
  },
  {
    question: "Which data structure is commonly used to perform Zigzag Traversal?",
    options: [
      "Queue",
      "Stack",
      "Queue with direction tracking",
      "Hash Map"
    ],
    correctAnswer: 2,
    explanation:
      "A queue performs level-order traversal while direction is alternated after every level."
  },
  {
    question: "The direction changes:",
    options: [
      "After every node",
      "After every level",
      "After every subtree",
      "Only once"
    ],
    correctAnswer: 1,
    explanation:
      "Traversal direction alternates after completing each level."
  },
  {
    question: "What is the time complexity of Zigzag Traversal?",
    options: [
      "O(log n)",
      "O(n)",
      "O(n²)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation:
      "Every node is visited exactly once."
  },
  {
    question: "What is the auxiliary space complexity in the worst case?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "The queue may contain an entire level of the tree."
  },
  {
    question: "The root node is visited:",
    options: [
      "Last",
      "First",
      "In the middle",
      "Randomly"
    ],
    correctAnswer: 1,
    explanation:
      "Like all BFS-based traversals, Zigzag Traversal begins with the root."
  },
  {
    question: "Which traversal direction is typically used for the second level?",
    options: [
      "Left to Right",
      "Right to Left",
      "Top to Bottom",
      "Bottom to Top"
    ],
    correctAnswer: 1,
    explanation:
      "After traversing the first level left-to-right, the second level is traversed right-to-left."
  },
  {
    question: "Zigzag Traversal is commonly asked in:",
    options: [
      "Tree visualization problems",
      "Technical interviews",
      "Competitive programming",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Zigzag Traversal is a popular interview and competitive programming problem."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Zigzag Traversal Quiz"
      questions={questions}
    />
  );
}