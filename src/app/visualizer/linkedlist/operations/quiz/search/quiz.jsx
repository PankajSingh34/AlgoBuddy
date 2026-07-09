"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the time complexity of searching for an element in a singly linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation: "A linked list must be traversed sequentially until the element is found or the end is reached."
  },
  {
    question: "From which node does searching in a linked list begin?",
    options: [
      "Tail node",
      "Middle node",
      "Head node",
      "Random node"
    ],
    correctAnswer: 2,
    explanation: "Searching always starts from the head node."
  },
  {
    question: "What happens if the searched element is not present in the linked list?",
    options: [
      "The list is deleted",
      "The traversal reaches NULL",
      "The list is reversed",
      "A new node is created"
    ],
    correctAnswer: 1,
    explanation: "If the traversal reaches NULL without finding the value, the element is not present."
  },
  {
    question: "Which searching technique is generally used in a linked list?",
    options: [
      "Binary Search",
      "Linear Search",
      "Interpolation Search",
      "Jump Search"
    ],
    correctAnswer: 1,
    explanation: "Linked lists are searched using linear traversal."
  },
  {
    question: "Why can't Binary Search be efficiently applied to a linked list?",
    options: [
      "Linked lists cannot store integers",
      "Random access is not available",
      "Pointers are too slow",
      "Binary Search requires recursion"
    ],
    correctAnswer: 1,
    explanation: "Binary Search requires direct access to the middle element, which linked lists do not provide."
  },
  {
    question: "Which pointer is commonly used while searching a linked list?",
    options: [
      "temp/current",
      "tail",
      "rear",
      "previous"
    ],
    correctAnswer: 0,
    explanation: "A temporary pointer is used to traverse the linked list."
  },
  {
    question: "If the target value is found at the first node, how many comparisons are required?",
    options: [
      "0",
      "1",
      "n",
      "n/2"
    ],
    correctAnswer: 1,
    explanation: "Only one comparison is needed when the first node contains the target value."
  },
  {
    question: "In the worst case, how many nodes must be visited while searching?",
    options: [
      "1",
      "log₂n",
      "All nodes",
      "Half of the nodes"
    ],
    correctAnswer: 2,
    explanation: "If the element is last or absent, every node is visited."
  },
  {
    question: "Which linked list operation is performed repeatedly during searching?",
    options: [
      "Insertion",
      "Deletion",
      "Traversal",
      "Sorting"
    ],
    correctAnswer: 2,
    explanation: "Searching requires traversing the linked list node by node."
  },
  {
    question: "What is the average time complexity of searching in a linked list?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 2,
    explanation: "On average, approximately half of the nodes are traversed, giving O(n) complexity."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Linked List Search Quiz"
      questions={questions}
    />
  );
}