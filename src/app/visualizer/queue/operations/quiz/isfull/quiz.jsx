"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What does the isFull operation determine in a queue?",
      options: [
        "Whether the queue contains any elements",
        "Whether the queue has reached its maximum capacity",
        "The position of the front element",
        "The time complexity of other operations"
      ],
      correctAnswer: 1,
      explanation: "isFull checks if the queue has reached its maximum capacity in fixed-size implementations."
    },
    {
      question: "In which type of queue implementation is isFull most commonly needed?",
      options: [
        "Linked list-based queues",
        "Dynamic arrays",
        "Array-based queues with fixed capacity",
        "All queue implementations"
      ],
      correctAnswer: 2,
      explanation: "isFull is crucial for array-based queues with fixed capacity to prevent overflow."
    },
    {
      question: "What is the time complexity of the isFull operation?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "isFull runs in O(1) constant time as it only requires simple pointer comparisons."
    },
    {
      question: "In a circular array implementation, when is the queue considered full?",
      options: [
        "When front == 0",
        "When rear == capacity - 1",
        "When (rear + 1) % capacity == front",
        "When front == rear"
      ],
      correctAnswer: 2,
      explanation: "In circular arrays, the queue is full when the next position after rear equals front."
    },
    {
      question: "What would isFull() return for a queue with capacity 3 containing [10, 20, 30]?",
      options: ["true", "false", "null", "Error"],
      correctAnswer: 0,
      explanation: "The queue has reached its maximum capacity of 3 elements, so isFull returns true."
    },
    {
  question: "What happens if you try to enqueue an element into a full queue?",
  options: [
    "The element is inserted at the front",
    "The oldest element is removed automatically",
    "A queue overflow error occurs",
    "The queue doubles its size automatically"
  ],
  correctAnswer: 2,
  explanation: "Attempting to enqueue into a full fixed-size queue results in a queue overflow."
},
{
  question: "Which operation is typically performed before enqueueing into a fixed-size queue?",
  options: [
    "isEmpty()",
    "isFull()",
    "peek()",
    "dequeue()"
  ],
  correctAnswer: 1,
  explanation: "The isFull() operation is used to ensure there is space before inserting a new element."
},
{
  question: "In a linear array-based queue of size 5, when is the queue considered full?",
  options: [
    "rear == 4",
    "front == 0",
    "front == rear",
    "rear == front"
  ],
  correctAnswer: 0,
  explanation: "In a linear queue, when the rear reaches the last index (size - 1), the queue is full."
},
{
  question: "Why is the isFull() operation generally unnecessary in a linked list-based queue?",
  options: [
    "Because linked lists automatically sort elements",
    "Because linked lists grow dynamically until memory is exhausted",
    "Because linked lists never use enqueue",
    "Because linked lists remove elements automatically"
  ],
  correctAnswer: 1,
  explanation: "Linked list-based queues do not have a fixed capacity, so they grow dynamically until system memory is exhausted."
},
{
  question: "What is the primary purpose of the isFull() operation?",
  options: [
    "To determine whether the queue has reached its storage limit",
    "To count the number of elements in the queue",
    "To remove the front element",
    "To display all queue elements"
  ],
  correctAnswer: 0,
  explanation: "The purpose of isFull() is to check whether a fixed-size queue has reached its maximum capacity."
},
  ];

  return <QuizEngine title="Queue isFull Operation Quiz" questions={questions} />;
};

export default QueueQuiz;
