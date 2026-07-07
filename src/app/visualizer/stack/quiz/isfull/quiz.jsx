"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackQuiz = () => {
  const questions = [
    {
      question: "What is the primary purpose of the 'isFull' operation in a stack?",
      options: [
        "To count the number of elements in the stack",
        "To check if the stack has reached its maximum capacity",
        "To remove the top element when the stack is full",
        "To dynamically resize the stack"
      ],
      correctAnswer: 1,
      explanation:
        "The 'isFull' operation checks whether a fixed-size stack can accept more elements (returns true if full).",
    },
    {
      question: "For which type of stack implementation is 'isFull' most relevant?",
      options: [
        "Dynamic stacks (e.g., linked lists)",
        "Fixed-size stacks (e.g., arrays)",
        "Both equally",
        "Stacks with unlimited capacity"
      ],
      correctAnswer: 1,
      explanation:
        "'isFull' is critical for fixed-size implementations (like arrays) to prevent overflow. Dynamic stacks rarely need it.",
    },
    {
      question: "What does isFull() return for a dynamic stack (no fixed size)?",
      options: [
        "Always true",
        "Always false",
        "Depends on current elements",
        "Throws an error"
      ],
      correctAnswer: 1,
      explanation:
        "Dynamic stacks (e.g., linked lists) can theoretically grow indefinitely, so isFull() typically returns false.",
    },
    {
      question: "Given a stack with max capacity 3: [8, 5], what does isFull() return?",
      options: ["true", "false", "null", "Throws overflow error"],
      correctAnswer: 1,
      explanation:
        "The stack has 2/3 elements, so isFull() returns false (not yet full).",
    },
    {
      question: "Why is 'isFull' crucial before push operations in fixed-size stacks?",
      options: [
        "To improve time complexity",
        "To prevent stack overflow errors",
        "To count elements efficiently",
        "To convert the stack to dynamic"
      ],
      correctAnswer: 1,
      explanation:
        "Checking isFull() before push() avoids overflow errors in fixed-capacity stacks.",
    },
    {
  question: "What value does isFull() return when the stack has reached its maximum capacity?",
  options: [
    "true",
    "false",
    "-1",
    "0",
  ],
  correctAnswer: 0,
  explanation:
    "The isFull() operation returns true when no more elements can be pushed onto the stack.",
},
{
  question: "In an array-based stack of size N, when is the stack considered full?",
  options: [
    "top == N",
    "top == N - 1",
    "top == 0",
    "top == -1",
  ],
  correctAnswer: 1,
  explanation:
    "The highest valid index in an array of size N is N - 1, so the stack is full when top equals N - 1.",
},
{
  question: "Which stack operation should check isFull() before execution?",
  options: [
    "Push",
    "Pop",
    "Peek",
    "isEmpty",
  ],
  correctAnswer: 0,
  explanation:
    "The push operation must ensure the stack is not full before inserting a new element.",
},
{
  question: "What problem occurs if push() is performed on a full stack without checking isFull()?",
  options: [
    "Stack Underflow",
    "Stack Overflow",
    "Memory Leak",
    "Infinite Loop",
  ],
  correctAnswer: 1,
  explanation:
    "Attempting to push onto a full stack causes a stack overflow condition.",
},
{
  question: "What is the time complexity of the isFull() operation?",
  options: [
    "O(1)",
    "O(log N)",
    "O(N)",
    "O(N²)",
  ],
  correctAnswer: 0,
  explanation:
    "The isFull() operation only compares the top index with the stack capacity, making it a constant-time operation.",
},
  ];

  return <QuizEngine title="Stack Quiz Challenge" questions={questions} />;
};

export default StackQuiz;
