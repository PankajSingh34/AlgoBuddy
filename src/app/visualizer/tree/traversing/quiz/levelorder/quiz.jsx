"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the order of Level-order Traversal?",
    options: [
      "Root → Left → Right",
      "Left → Root → Right",
      "Node by node level from top to bottom",
      "Left → Right → Root"
    ],
    correctAnswer: 2,
    explanation: "Level-order Traversal visits nodes level by level, starting from the root."
  },
  {
    question: "Which data structure is primarily used for Level-order Traversal?",
    options: [
      "Stack",
      "Queue",
      "Heap",
      "Hash Table"
    ],
    correctAnswer: 1,
    explanation: "A queue is used to process nodes in First-In-First-Out (FIFO) order."
  },
  {
    question: "Level-order Traversal is also known as:",
    options: [
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Search",
      "Recursive Search"
    ],
    correctAnswer: 1,
    explanation: "Level-order Traversal is the Breadth-First Search (BFS) traversal of a tree."
  },
  {
    question: "Which node is visited first during Level-order Traversal?",
    options: [
      "Left child",
      "Right child",
      "Root node",
      "Deepest node"
    ],
    correctAnswer: 2,
    explanation: "Traversal always starts from the root node."
  },
  {
    question: "After visiting a node in Level-order Traversal, what is typically done?",
    options: [
      "Delete the node",
      "Push its children into the queue",
      "Sort its children",
      "Move to the parent"
    ],
    correctAnswer: 1,
    explanation: "The node's children are enqueued so they can be processed later."
  },
  {
    question: "What is the time complexity of Level-order Traversal?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation: "Every node is visited exactly once, resulting in O(n) time."
  },
  {
    question: "What is the auxiliary space complexity of Level-order Traversal?",
    options: [
      "O(1)",
      "O(h)",
      "O(w)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation: "The queue may store all nodes at the widest level, giving O(w) space where w is the maximum width of the tree."
  },
  {
    question: "Which application commonly uses Level-order Traversal?",
    options: [
      "Printing nodes level by level",
      "Sorting BST elements",
      "Deleting a tree",
      "AVL balancing"
    ],
    correctAnswer: 0,
    explanation: "Level-order Traversal is commonly used to print or process nodes level by level."
  },
  {
    question: "Which traversal explores all nodes at the current depth before moving deeper?",
    options: [
      "Pre-order",
      "In-order",
      "Post-order",
      "Level-order"
    ],
    correctAnswer: 3,
    explanation: "Level-order Traversal processes one level completely before moving to the next."
  },
  {
    question: "What principle does the queue follow in Level-order Traversal?",
    options: [
      "LIFO",
      "FIFO",
      "Priority-based",
      "Random"
    ],
    correctAnswer: 1,
    explanation: "Queues follow the First-In-First-Out (FIFO) principle, which is essential for Breadth-First Search."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Level-order Traversal Quiz"
      questions={questions}
    />
  );
}