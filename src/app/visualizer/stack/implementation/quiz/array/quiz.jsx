"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackUsingArrayQuiz = () => {
  const questions = [
    {
      question: "Which data structure is used to implement a stack using an array?",
      options: ["Queue", "Array", "Linked List", "Tree"],
      correctAnswer: 1,
      explanation: "A stack can be implemented using an array where elements are stored sequentially."
    },
    {
      question: "Which variable keeps track of the top element in an array-based stack?",
      options: ["front", "rear", "top", "head"],
      correctAnswer: 2,
      explanation: "The 'top' index points to the current top element."
    },
    {
      question: "What is the time complexity of Push in an array-based stack?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N²)"],
      correctAnswer: 0,
      explanation: "Push is performed in constant time."
    },
    {
      question: "What happens if Push is performed when the stack is full?",
      options: ["Underflow", "Overflow", "Nothing", "Stack resets"],
      correctAnswer: 1,
      explanation: "Trying to insert into a full stack causes overflow."
    },
    {
      question: "What is the time complexity of Pop?",
      options: ["O(1)", "O(N)", "O(log N)", "O(N²)"],
      correctAnswer: 0,
      explanation: "Removing the top element takes constant time."
    },
    {
  question: "Which operation returns the top element without removing it?",
  options: ["Push", "Peek", "Pop", "Display"],
  correctAnswer: 1,
  explanation: "Peek returns the top element without modifying the stack."
},
{
  question: "What is the initial value of the 'top' index in an empty array-based stack?",
  options: ["0", "1", "-1", "NULL"],
  correctAnswer: 2,
  explanation: "The top index is initialized to -1 to indicate an empty stack."
},
{
  question: "What condition indicates that the stack is full?",
  options: [
    "top == -1",
    "top == size - 1",
    "top == size",
    "top == 0"
  ],
  correctAnswer: 1,
  explanation: "When top reaches size - 1, no more elements can be inserted."
},
{
  question: "Which of the following is a limitation of implementing a stack using an array?",
  options: [
    "Slow push operation",
    "Fixed size",
    "Cannot perform pop",
    "Requires recursion"
  ],
  correctAnswer: 1,
  explanation: "Array-based stacks have a fixed capacity unless dynamically resized."
},
{
  question: "Which Stack principle is followed by an array implementation?",
  options: [
    "FIFO",
    "LIFO",
    "Priority",
    "Round Robin"
  ],
  correctAnswer: 1,
  explanation: "A stack always follows the Last In, First Out (LIFO) principle."
},
  ];

  return (
    <QuizEngine
      title="Stack Using Array Quiz"
      questions={questions}
    />
  );
};

export default StackUsingArrayQuiz;