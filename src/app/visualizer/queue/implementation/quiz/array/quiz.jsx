"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueArrayQuiz = () => {
  const questions = [
    {
      question: "Which data structure is commonly used to implement a queue using an array?",
      options: [
        "Static array with front and rear pointers",
        "Binary Tree",
        "Stack",
        "Hash Table"
      ],
      correctAnswer: 0,
      explanation:
        "A queue implemented using an array maintains front and rear indices."
    },
    {
      question: "Which pointer indicates the first element in an array-based queue?",
      options: ["rear", "front", "top", "head"],
      correctAnswer: 1,
      explanation:
        "The front pointer always points to the first element."
    },
    {
      question: "Where is a new element inserted in an array queue?",
      options: [
        "Front",
        "Middle",
        "Rear",
        "Random position"
      ],
      correctAnswer: 2,
      explanation:
        "New elements are always inserted at the rear."
    },
    {
      question: "Which condition causes queue overflow?",
      options: [
        "rear == front",
        "rear == capacity - 1",
        "front == -1",
        "rear < front"
      ],
      correctAnswer: 1,
      explanation:
        "When the rear reaches the last array index, overflow occurs."
    },
    {
      question: "Which condition indicates an empty queue?",
      options: [
        "front == rear",
        "front == -1",
        "rear == capacity",
        "front == capacity"
      ],
      correctAnswer: 1,
      explanation:
        "Initially, both pointers are generally set to -1."
    },
    {
      question: "What is the time complexity of enqueue in an array queue?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: 0,
      explanation:
        "Enqueue simply inserts at the rear."
    },
    {
      question: "What is the time complexity of dequeue in an array queue?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: 0,
      explanation:
        "Removing the front element takes constant time."
    },
    {
      question: "Which drawback exists in a simple linear array queue?",
      options: [
        "Duplicate values",
        "Memory wastage after dequeue",
        "Slow searching",
        "Cannot store integers"
      ],
      correctAnswer: 1,
      explanation:
        "Freed positions cannot be reused efficiently in a linear queue."
    },
    {
      question: "Which queue implementation solves the memory wastage problem?",
      options: [
        "Priority Queue",
        "Circular Queue",
        "Deque",
        "Stack"
      ],
      correctAnswer: 1,
      explanation:
        "Circular queues reuse empty positions."
    },
    {
      question: "What is the initial value of front and rear in many implementations?",
      options: [
        "0",
        "1",
        "-1",
        "capacity"
      ],
      correctAnswer: 2,
      explanation:
        "Both pointers usually start at -1 before insertion."
    }
  ];

  return (
    <QuizEngine
      title="Queue Using Array Quiz"
      questions={questions}
    />
  );
};

export default QueueArrayQuiz;