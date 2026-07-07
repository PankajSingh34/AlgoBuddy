"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackQuiz = () => {
  const questions = [
    {
      question: "What does the isEmpty operation in a stack determine?",
      options: [
        "The total capacity of the stack",
        "Whether the stack contains any elements",
        "The position of the top element",
        "The time complexity of other operations"
      ],
      correctAnswer: 1,
      explanation:
        "isEmpty checks if the stack has zero elements (true if empty, false otherwise).",
    },
    {
      question: "What does isEmpty() return for a stack with elements [10, 20]?",
      options: ["true", "false", "null", "10"],
      correctAnswer: 1,
      explanation:
        "The stack contains elements, so isEmpty returns false.",
    },
    {
      question: "Why is isEmpty crucial before calling pop() or peek()?",
      options: [
        "To improve time complexity",
        "To prevent stack underflow errors",
        "To resize the stack",
        "To count the elements"
      ],
      correctAnswer: 1,
      explanation:
        "Checking isEmpty first avoids errors when attempting to pop/peek an empty stack.",
    },
    {
      question: "What is the time complexity of isEmpty?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation:
        "isEmpty runs in O(1) time as it only checks if size/length equals zero.",
    },
    {
      question: "How would you implement isEmpty for a stack stored in an array?",
      options: [
        "Check if array[0] === null",
        "Return array.length === 0",
        "Compare top and bottom indices",
        "Count all non-zero elements"
      ],
      correctAnswer: 1,
      explanation:
        "For array-based stacks, isEmpty simply verifies if the length is zero.",
    },
    {
  question: "What value does isEmpty() return when the stack has no elements?",
  options: [
    "true",
    "false",
    "0",
    "-1",
  ],
  correctAnswer: 0,
  explanation:
    "The isEmpty() operation returns true when the stack contains no elements.",
},
{
  question: "What is the time complexity of the isEmpty() operation?",
  options: [
    "O(1)",
    "O(log N)",
    "O(N)",
    "O(N²)",
  ],
  correctAnswer: 0,
  explanation:
    "Checking whether a stack is empty only requires examining the top pointer or size, so it takes constant time.",
},
{
  question: "Which condition is commonly used to check whether an array-based stack is empty?",
  options: [
    "top == -1",
    "top == size",
    "top > size",
    "top == 0",
  ],
  correctAnswer: 0,
  explanation:
    "In an array implementation, the stack is empty when the top index is -1.",
},
{
  question: "Why is the isEmpty() operation important before performing pop()?",
  options: [
    "To increase the stack size",
    "To prevent stack underflow",
    "To sort the stack",
    "To reverse the stack",
  ],
  correctAnswer: 1,
  explanation:
    "Checking isEmpty() before pop() prevents attempting to remove an element from an empty stack, avoiding stack underflow.",
},
{
  question: "Which stack operation commonly uses isEmpty() as a safety check?",
  options: [
    "Pop",
    "Peek",
    "Both Pop and Peek",
    "Push",
  ],
  correctAnswer: 2,
  explanation:
    "Both pop() and peek() should first verify that the stack is not empty before accessing the top element.",
},
  ];

  return <QuizEngine title="Stack Quiz Challenge" questions={questions} />;
};

export default StackQuiz;
