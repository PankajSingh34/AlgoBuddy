"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueLinkedListQuiz = () => {
  const questions = [
    {
      question: "Which data structure is used to implement a linked list queue?",
      options: [
        "Array",
        "Linked List",
        "Binary Tree",
        "Stack"
      ],
      correctAnswer: 1,
      explanation:
        "A linked list stores queue elements dynamically."
    },
    {
      question: "Which pointer represents the beginning of the queue?",
      options: [
        "rear",
        "front",
        "tail",
        "current"
      ],
      correctAnswer: 1,
      explanation:
        "The front pointer always points to the first node."
    },
    {
      question: "Which pointer represents the last node?",
      options: [
        "front",
        "rear",
        "head",
        "next"
      ],
      correctAnswer: 1,
      explanation:
        "The rear pointer always points to the newest node."
    },
    {
      question: "Where is a new node inserted?",
      options: [
        "Front",
        "Middle",
        "Rear",
        "Anywhere"
      ],
      correctAnswer: 2,
      explanation:
        "New nodes are inserted at the rear."
    },
    {
      question: "Which node is removed during dequeue?",
      options: [
        "Rear node",
        "Middle node",
        "Front node",
        "Last inserted node"
      ],
      correctAnswer: 2,
      explanation:
        "The front node is removed first."
    },
    {
      question: "What is the time complexity of enqueue?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation:
        "Maintaining a rear pointer allows O(1) insertion."
    },
    {
      question: "What is the time complexity of dequeue?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation:
        "The front node is removed in constant time."
    },
    {
      question: "Which advantage does a linked list queue have over an array queue?",
      options: [
        "Requires fixed memory",
        "Dynamic memory allocation",
        "Stores only integers",
        "Cannot overflow"
      ],
      correctAnswer: 1,
      explanation:
        "Linked lists grow dynamically as needed."
    },
    {
      question: "When does overflow occur in a linked list queue?",
      options: [
        "When rear reaches the end",
        "When front equals rear",
        "When system memory is exhausted",
        "Never"
      ],
      correctAnswer: 2,
      explanation:
        "Overflow only occurs if memory allocation fails."
    },
    {
      question: "Which real-world application commonly uses linked list queues?",
      options: [
        "Printer scheduling",
        "Expression parsing",
        "Binary search",
        "Sorting arrays"
      ],
      correctAnswer: 0,
      explanation:
        "Printer and task scheduling often use linked-list-based queues."
    }
  ];

  return (
    <QuizEngine
      title="Queue Using Linked List Quiz"
      questions={questions}
    />
  );
};

export default QueueLinkedListQuiz;