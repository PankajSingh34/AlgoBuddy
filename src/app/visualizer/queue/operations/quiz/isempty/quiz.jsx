"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What does the isEmpty operation in a queue determine?",
      options: [
        "The total capacity of the queue",
        "Whether the queue contains any elements",
        "The position of the front element",
        "The time complexity of other operations"
      ],
      correctAnswer: 1,
      explanation: "isEmpty checks if the queue has zero elements (returns true if empty, false otherwise)."
    },
    {
      question: "What does isEmpty() return for a queue with elements [10, 20]?",
      options: ["true", "false", "null", "10"],
      correctAnswer: 1,
      explanation: "The queue contains elements, so isEmpty returns false."
    },
    {
      question: "Why is isEmpty crucial before calling dequeue()?",
      options: [
        "To improve time complexity",
        "To prevent queue underflow errors",
        "To resize the queue",
        "To count the elements"
      ],
      correctAnswer: 1,
      explanation: "Checking isEmpty first avoids errors when attempting to dequeue from an empty queue."
    },
    {
      question: "What is the time complexity of isEmpty?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "isEmpty runs in O(1) time as it only checks if front == rear or head == null."
    },
    {
      question: "How would you implement isEmpty for a linked list-based queue?",
      options: [
        "Check if head.next == null",
        "Check if head == null",
        "Count all nodes",
        "Compare head and tail values"
      ],
      correctAnswer: 1,
      explanation: "For linked list queues, isEmpty simply verifies if the head pointer is null."
    },
    {
  question: "What does isEmpty() return when the queue has no elements?",
  options: [
    "false",
    "true",
    "0",
    "-1"
  ],
  correctAnswer: 1,
  explanation: "If the queue contains no elements, isEmpty() returns true."
},
{
  question: "Which condition indicates an empty queue in an array-based implementation?",
  options: [
    "rear == size - 1",
    "front == -1 || front > rear",
    "rear == front + 1",
    "front == size"
  ],
  correctAnswer: 1,
  explanation: "A queue is empty when front is -1 initially or when front becomes greater than rear after all elements are removed."
},
{
  question: "When is the isEmpty() operation commonly used?",
  options: [
    "Before performing dequeue",
    "Before sorting the queue",
    "Before resizing the queue",
    "Before searching the queue"
  ],
  correctAnswer: 0,
  explanation: "Checking isEmpty() before dequeue prevents attempting to remove an element from an empty queue."
},
{
  question: "Which queue operation benefits the most from checking isEmpty() first?",
  options: [
    "Enqueue",
    "Peek (Front)",
    "Both Dequeue and Peek",
    "Display"
  ],
  correctAnswer: 2,
  explanation: "Both dequeue and peek require at least one element in the queue, so checking isEmpty() is important."
},
{
  question: "What is the main purpose of the isEmpty() operation?",
  options: [
    "To count the number of elements",
    "To determine whether the queue contains any elements",
    "To remove the first element",
    "To insert a new element"
  ],
  correctAnswer: 1,
  explanation: "The purpose of isEmpty() is to determine whether the queue currently has any elements."
},
  ];

  return <QuizEngine title="Queue isEmpty Operation Quiz" questions={questions} />;
};

export default QueueQuiz;
