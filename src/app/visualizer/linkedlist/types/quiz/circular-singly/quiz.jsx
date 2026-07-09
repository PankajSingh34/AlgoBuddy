"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const CircularSinglyLinkedListQuiz = () => {
  const questions = [
    {
      question: "What is the defining characteristic of a Circular Singly Linked List?",
      options: [
        "Each node has two pointers.",
        "The last node points back to the first node.",
        "The first node points to NULL.",
        "Nodes are stored in contiguous memory."
      ],
      correctAnswer: 1,
      explanation: "In a Circular Singly Linked List, the last node's next pointer points back to the head node."
    },
    {
      question: "What does the last node's next pointer reference?",
      options: [
        "NULL",
        "The previous node",
        "The head node",
        "A random node"
      ],
      correctAnswer: 2,
      explanation: "The last node connects back to the head, making the list circular."
    },
    {
      question: "Which traversal condition is used in a Circular Singly Linked List?",
      options: [
        "Until current == NULL",
        "Until current reaches the head again",
        "Until current == tail",
        "Infinite loop"
      ],
      correctAnswer: 1,
      explanation: "Traversal stops when the current node reaches the head again."
    },
    {
      question: "What is an advantage of a Circular Singly Linked List?",
      options: [
        "Supports backward traversal",
        "Easy implementation of round-robin scheduling",
        "Requires no pointers",
        "Provides random access"
      ],
      correctAnswer: 1,
      explanation: "Circular lists are widely used in round-robin CPU scheduling."
    },
    {
      question: "What is the time complexity of inserting a node at the beginning (with a tail pointer)?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "Using a tail pointer allows insertion at the beginning in constant time."
    },
    {
      question: "Which application commonly uses a Circular Singly Linked List?",
      options: [
        "Browser history",
        "Round Robin CPU Scheduling",
        "Binary Search",
        "Heap Sort"
      ],
      correctAnswer: 1,
      explanation: "Round Robin scheduling repeatedly cycles through processes using a circular list."
    },
    {
      question: "What is the biggest disadvantage of a Circular Singly Linked List?",
      options: [
        "Cannot insert nodes",
        "Cannot traverse backward",
        "Consumes no memory",
        "Cannot delete nodes"
      ],
      correctAnswer: 1,
      explanation: "Like a singly linked list, backward traversal is not possible."
    },
    {
      question: "Which pointer is typically maintained for efficient insertion at both ends?",
      options: [
        "Middle pointer",
        "Tail pointer",
        "Current pointer",
        "Index pointer"
      ],
      correctAnswer: 1,
      explanation: "A tail pointer makes insertions at the beginning and end more efficient."
    },
    {
      question: "What is the time complexity of searching for an element?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "The list may need to be traversed completely."
    },
    {
      question: "Which statement about a Circular Singly Linked List is true?",
      options: [
        "The last node points to NULL.",
        "The first node stores two pointers.",
        "The last node links back to the head node.",
        "Nodes are stored sequentially in memory."
      ],
      correctAnswer: 2,
      explanation: "The defining feature is that the last node links back to the head."
    }
  ];

  return (
    <QuizEngine
      title="Circular Singly Linked List Quiz"
      questions={questions}
    />
  );
};

export default CircularSinglyLinkedListQuiz;