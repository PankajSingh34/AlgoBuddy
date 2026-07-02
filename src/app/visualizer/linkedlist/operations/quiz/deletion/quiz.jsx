"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Which node is removed during deletion at the beginning of a linked list?",
    options: [
      "The last node",
      "The middle node",
      "The head node",
      "A random node"
    ],
    correctAnswer: 2,
    explanation:
      "Deletion at the beginning removes the head node, and the head pointer is updated to the next node."
  },
  {
    question: "What is the time complexity of deleting the first node in a singly linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 0,
    explanation:
      "Only the head pointer needs to be updated, so deletion takes constant time."
  },
  {
    question: "Before deleting the last node of a singly linked list, what must be found?",
    options: [
      "The first node",
      "The middle node",
      "The second last node",
      "The head node"
    ],
    correctAnswer: 2,
    explanation:
      "The second last node is needed so its next pointer can be updated to NULL."
  },
  {
    question: "What is the time complexity of deleting the last node without a tail pointer?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation:
      "The list must be traversed to locate the second last node."
  },
  {
    question: "Which pointer is updated after deleting the head node?",
    options: [
      "tail",
      "head",
      "prev",
      "rear"
    ],
    correctAnswer: 1,
    explanation:
      "The head pointer is updated to the second node after deletion."
  },
  {
    question: "What should be done before deleting a node from memory?",
    options: [
      "Disconnect it from the linked list",
      "Reverse the list",
      "Sort the list",
      "Delete the tail first"
    ],
    correctAnswer: 0,
    explanation:
      "Pointers must first be updated so the remaining list stays connected."
  },
  {
    question: "Deleting a node after a given node requires updating which pointer?",
    options: [
      "head",
      "tail",
      "current.next",
      "front"
    ],
    correctAnswer: 2,
    explanation:
      "The current node's next pointer is updated to skip the deleted node."
  },
  {
    question: "What happens when the only node in a linked list is deleted?",
    options: [
      "The list becomes empty",
      "The tail becomes NULL only",
      "The node remains accessible",
      "Nothing changes"
    ],
    correctAnswer: 0,
    explanation:
      "Both head and tail become NULL after deleting the only node."
  },
  {
    question: "Which linked list allows deleting a node more efficiently when its previous node is known?",
    options: [
      "Array",
      "Stack",
      "Singly Linked List",
      "Doubly Linked List"
    ],
    correctAnswer: 3,
    explanation:
      "A doubly linked list provides access to both previous and next nodes."
  },
  {
    question: "Why is deleting the first node generally faster than deleting the last node?",
    options: [
      "No traversal is required",
      "It uses binary search",
      "The node is automatically removed",
      "It requires recursion"
    ],
    correctAnswer: 0,
    explanation:
      "Deleting the first node only updates the head pointer, making it O(1)."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Linked List Deletion Quiz"
      questions={questions}
    />
  );
}