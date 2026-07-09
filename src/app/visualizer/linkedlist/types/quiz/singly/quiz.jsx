"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const SinglyLinkedListQuiz = () => {
  const questions = [
    {
      question: "What is the main characteristic of a Singly Linked List?",
      options: [
        "Each node stores only data",
        "Each node stores data and a pointer to the next node",
        "Each node stores pointers to both previous and next nodes",
        "Nodes are stored in contiguous memory"
      ],
      correctAnswer: 1,
      explanation: "Each node in a Singly Linked List contains data and a pointer to the next node."
    },
    {
      question: "Which node marks the end of a Singly Linked List?",
      options: [
        "The first node",
        "The node whose next pointer is NULL",
        "The middle node",
        "The node with the largest value"
      ],
      correctAnswer: 1,
      explanation: "The last node's next pointer is NULL, indicating the end of the list."
    },
    {
      question: "What is the time complexity of inserting a node at the beginning?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "Insertion at the head only updates one pointer, making it O(1)."
    },
    {
      question: "What is the time complexity of searching for an element in a Singly Linked List?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "The list may need to be traversed node by node."
    },
    {
      question: "Which pointer is required to traverse a Singly Linked List?",
      options: [
        "Front pointer",
        "Head pointer",
        "Rear pointer",
        "Tail pointer"
      ],
      correctAnswer: 1,
      explanation: "Traversal begins from the head node."
    },
    {
      question: "What is the biggest disadvantage of a Singly Linked List?",
      options: [
        "Cannot store integers",
        "Cannot traverse backward",
        "Consumes no memory",
        "Requires sorting"
      ],
      correctAnswer: 1,
      explanation: "Traversal is possible only in the forward direction."
    },
    {
      question: "Which operation requires traversing the list before execution?",
      options: [
        "Insert at beginning",
        "Delete first node",
        "Insert at end (without tail pointer)",
        "Create head node"
      ],
      correctAnswer: 2,
      explanation: "Without a tail pointer, the entire list must be traversed."
    },
    {
      question: "Which application commonly uses a Singly Linked List?",
      options: [
        "Music playlist",
        "Hash Table",
        "Polynomial representation",
        "Binary Search"
      ],
      correctAnswer: 2,
      explanation: "Polynomial manipulation commonly uses linked lists."
    },
    {
      question: "Which pointer is updated after deleting the first node?",
      options: [
        "Head",
        "Tail",
        "Rear",
        "NULL"
      ],
      correctAnswer: 0,
      explanation: "The head pointer moves to the second node."
    },
    {
      question: "What is the space complexity of storing n nodes in a Singly Linked List?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "Each node occupies memory, giving O(n) space complexity."
    }
  ];

  return (
    <QuizEngine
      title="Singly Linked List Quiz"
      questions={questions}
    />
  );
};

export default SinglyLinkedListQuiz;