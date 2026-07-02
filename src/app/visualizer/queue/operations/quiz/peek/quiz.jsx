"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What does the peek front operation do in a queue?",
      options: [
        "Removes the front element",
        "Adds an element to the front",
        "Retrieves the front element without removing it",
        "Priority-Based"
      ],
      correctAnswer: 2,
      explanation: "Peek retrieves the front element but doesn't remove it."
    },
    {
      question: "What is the main difference between peekFront() and dequeue()?",
      options: [
        "peekFront() removes the element, dequeue() does not",
        "dequeue() accesses the rear",
        "peekFront() leaves the queue unchanged",
        "They are the same"
      ],
      correctAnswer: 2,
      explanation: "peekFront() retrieves without removal; dequeue() removes the front element."
    },
    {
      question: "What will the queue look like after calling peekFront() on [A, B, C, D]",
      options: ["[B, C, D]", "[A, B, C]", "[A, B, C, D]", "[D, C, B, A]"],
      correctAnswer: 2,
      explanation: "peekFront() does not modify the queue."
    },
    {
      question: "What is the time complexity of the peek operation?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "Direct access makes it constant time."
    },
    {
      question: "In an array-based queue, how is peekFront() typically implemented?",
      options: [
        "Return array[0]",
        "Return array[front]",
        "Return array[rear]",
        "Remove array[front]"
      ],
      correctAnswer: 1,
      explanation: "The front index gives the first element."
    },
    {
  question: "What happens if peekFront() is called on an empty queue?",
  options: [
    "Returns the rear element",
    "Causes a queue underflow or returns an error",
    "Adds a new element",
    "Returns 0"
  ],
  correctAnswer: 1,
  explanation: "Calling peekFront() on an empty queue results in an underflow error or an invalid value depending on the implementation."
},
{
  question: "Which element is returned by peekFront()?",
  options: [
    "The last inserted element",
    "The rear element",
    "The front element",
    "The middle element"
  ],
  correctAnswer: 2,
  explanation: "peekFront() always returns the element at the front of the queue."
},
{
  question: "Which queue operation modifies the queue?",
  options: [
    "peekFront()",
    "isEmpty()",
    "dequeue()",
    "isFull()"
  ],
  correctAnswer: 2,
  explanation: "dequeue() removes the front element, while peekFront(), isEmpty(), and isFull() only inspect the queue."
},
{
  question: "Why is peekFront() useful before performing dequeue()?",
  options: [
    "It sorts the queue",
    "It allows you to inspect the next element without removing it",
    "It inserts a new element",
    "It changes the rear pointer"
  ],
  correctAnswer: 1,
  explanation: "peekFront() lets you view the next element to be removed while keeping the queue unchanged."
},
{
  question: "Which statement about peekFront() is correct?",
  options: [
    "It always removes the front element",
    "It changes the size of the queue",
    "It returns the front element without changing the queue",
    "It always returns the rear element"
  ],
  correctAnswer: 2,
  explanation: "peekFront() simply accesses the front element without modifying the queue or its size."
},
  ];

  return <QuizEngine title="Queue Peek Operation Quiz" questions={questions} />;
};

export default QueueQuiz;
