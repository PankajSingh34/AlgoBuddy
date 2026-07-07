"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Which technique is most commonly used to find the middle node of a linked list?",
    options: [
      "Binary Search",
      "Fast and Slow Pointer",
      "Sliding Window",
      "Recursion"
    ],
    correctAnswer: 1,
    explanation:
      "The Fast and Slow Pointer technique finds the middle node efficiently in one traversal."
  },
  {
    question: "How many nodes does the fast pointer move in each iteration?",
    options: [
      "One",
      "Two",
      "Three",
      "Four"
    ],
    correctAnswer: 1,
    explanation:
      "The fast pointer advances two nodes while the slow pointer advances one."
  },
  {
    question: "How many nodes does the slow pointer move in each iteration?",
    options: [
      "One",
      "Two",
      "Three",
      "Zero"
    ],
    correctAnswer: 0,
    explanation:
      "The slow pointer moves one node at a time."
  },
  {
    question: "When does the slow pointer reach the middle node?",
    options: [
      "When the fast pointer reaches the end of the list",
      "When the slow pointer reaches NULL",
      "When both pointers are equal initially",
      "After half of the nodes are deleted"
    ],
    correctAnswer: 0,
    explanation:
      "When the fast pointer reaches the end, the slow pointer is positioned at the middle."
  },
  {
    question: "What is the time complexity of finding the middle node using the Fast and Slow Pointer technique?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "The linked list is traversed only once."
  },
  {
    question: "What is the space complexity of the Fast and Slow Pointer approach?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 0,
    explanation:
      "Only two pointers are used regardless of the list size."
  },
  {
    question: "In an even-length linked list, where does the standard Fast and Slow Pointer algorithm usually stop?",
    options: [
      "First middle node",
      "Second middle node",
      "Last node",
      "Head node"
    ],
    correctAnswer: 1,
    explanation:
      "The common implementation returns the second middle node for even-length lists."
  },
  {
    question: "Which pointer determines when traversal should stop?",
    options: [
      "Slow pointer",
      "Head pointer",
      "Tail pointer",
      "Fast pointer"
    ],
    correctAnswer: 3,
    explanation:
      "The loop continues while the fast pointer and its next pointer are not NULL."
  },
  {
    question: "Which linked list problem commonly uses the Fast and Slow Pointer technique besides finding the middle node?",
    options: [
      "Merge Sort",
      "Cycle Detection",
      "Heap Construction",
      "Binary Search"
    ],
    correctAnswer: 1,
    explanation:
      "Floyd's Cycle Detection Algorithm also uses fast and slow pointers."
  },
  {
    question: "What is the primary advantage of the Fast and Slow Pointer approach over counting nodes first?",
    options: [
      "Uses recursion",
      "Requires two traversals",
      "Finds the middle in a single traversal",
      "Uses binary search"
    ],
    correctAnswer: 2,
    explanation:
      "The Fast and Slow Pointer technique finds the middle node in just one pass through the linked list."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Linked List Middle Node Quiz"
      questions={questions}
    />
  );
}