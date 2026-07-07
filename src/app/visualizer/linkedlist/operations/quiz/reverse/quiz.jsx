"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the main goal of reversing a linked list?",
    options: [
      "Sort the linked list",
      "Reverse the direction of all links",
      "Delete all nodes",
      "Find the middle node"
    ],
    correctAnswer: 1,
    explanation:
      "Reversing a linked list changes every node's next pointer to point to its previous node."
  },
  {
    question: "Which pointers are commonly used to reverse a singly linked list iteratively?",
    options: [
      "front, rear",
      "left, right",
      "prev, current, next",
      "head, tail, middle"
    ],
    correctAnswer: 2,
    explanation:
      "The iterative approach uses prev, current, and next pointers."
  },
  {
    question: "What is the time complexity of reversing a linked list?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Each node is visited exactly once while reversing."
  },
  {
    question: "What is the space complexity of the iterative reverse algorithm?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 0,
    explanation:
      "Only three pointers are used regardless of list size."
  },
  {
    question: "After reversing a linked list, which node becomes the new head?",
    options: [
      "The original head",
      "The original second node",
      "The original last node",
      "The middle node"
    ],
    correctAnswer: 2,
    explanation:
      "The last node becomes the first node after reversal."
  },
  {
    question: "What should be stored before changing current.next?",
    options: [
      "Previous node",
      "Tail node",
      "Next node",
      "Head node"
    ],
    correctAnswer: 2,
    explanation:
      "The next node must be saved before modifying the next pointer."
  },
  {
    question: "Which pointer becomes NULL after the linked list is completely reversed?",
    options: [
      "Tail",
      "Previous",
      "Original head's next pointer",
      "Current"
    ],
    correctAnswer: 2,
    explanation:
      "The original head becomes the last node, whose next pointer is NULL."
  },
  {
    question: "Which technique can also be used to reverse a linked list?",
    options: [
      "Binary Search",
      "Recursion",
      "Merge Sort",
      "Breadth First Search"
    ],
    correctAnswer: 1,
    explanation:
      "Linked lists can be reversed recursively as well as iteratively."
  },
  {
    question: "How many times is each node visited during iterative reversal?",
    options: [
      "Once",
      "Twice",
      "Three times",
      "Depends on list size"
    ],
    correctAnswer: 0,
    explanation:
      "Each node is processed exactly one time."
  },
  {
    question: "Which statement about reversing a linked list is correct?",
    options: [
      "Node data is swapped.",
      "Only pointer directions are changed.",
      "The list is sorted.",
      "New nodes are created."
    ],
    correctAnswer: 1,
    explanation:
      "The reversal algorithm changes only the links between nodes; node values remain unchanged."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Linked List Reverse Quiz"
      questions={questions}
    />
  );
}