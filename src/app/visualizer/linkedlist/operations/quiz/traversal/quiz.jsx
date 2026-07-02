"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the purpose of traversing a linked list?",
    options: [
      "To sort the linked list",
      "To visit every node one by one",
      "To reverse the linked list",
      "To delete all nodes"
    ],
    correctAnswer: 1,
    explanation:
      "Traversal means visiting each node sequentially from the head to the end."
  },
  {
    question: "Which node is visited first during traversal?",
    options: [
      "Tail node",
      "Middle node",
      "Head node",
      "Last inserted node"
    ],
    correctAnswer: 2,
    explanation:
      "Traversal always starts from the head node."
  },
  {
    question: "Which pointer is commonly used to traverse a linked list?",
    options: [
      "rear",
      "tail",
      "temp/current",
      "front"
    ],
    correctAnswer: 2,
    explanation:
      "A temporary pointer moves from one node to the next."
  },
  {
    question: "What condition is used to stop traversal in a singly linked list?",
    options: [
      "current == head",
      "current == NULL",
      "tail == NULL",
      "current == previous"
    ],
    correctAnswer: 1,
    explanation:
      "Traversal stops when the current pointer becomes NULL."
  },
  {
    question: "What is the time complexity of traversing an entire linked list?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Every node is visited exactly once."
  },
  {
    question: "Which operation is NOT performed during traversal?",
    options: [
      "Reading node values",
      "Moving to the next node",
      "Following next pointers",
      "Random access to any node"
    ],
    correctAnswer: 3,
    explanation:
      "Linked lists do not support random access."
  },
  {
    question: "If a linked list is empty, what is the value of the head pointer?",
    options: [
      "0",
      "1",
      "NULL",
      "Tail"
    ],
    correctAnswer: 2,
    explanation:
      "An empty linked list has a NULL head pointer."
  },
  {
    question: "How many times is each node visited during a complete traversal?",
    options: [
      "Twice",
      "Once",
      "Three times",
      "Depends on sorting"
    ],
    correctAnswer: 1,
    explanation:
      "Each node is visited exactly one time."
  },
  {
    question: "Which operation commonly requires traversal?",
    options: [
      "Searching",
      "Binary Search",
      "Heapify",
      "Merge Sort"
    ],
    correctAnswer: 0,
    explanation:
      "Searching requires visiting nodes one by one."
  },
  {
    question: "Which statement about linked list traversal is correct?",
    options: [
      "Nodes can be accessed directly by index.",
      "Traversal always starts from the head node.",
      "Traversal starts from the tail node.",
      "Traversal requires recursion."
    ],
    correctAnswer: 1,
    explanation:
      "Traversal begins from the head and follows the next pointers until NULL."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Linked List Traversal Quiz"
      questions={questions}
    />
  );
}