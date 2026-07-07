"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackUsingLinkedListQuiz = () => {
  const questions = [
    {
      question: "Which pointer represents the top of a linked-list stack?",
      options: ["head", "tail", "rear", "front"],
      correctAnswer: 0,
      explanation: "The head node acts as the top of the stack."
    },
    {
      question: "What is the time complexity of Push in a linked-list stack?",
      options: ["O(1)", "O(N)", "O(log N)", "O(N²)"],
      correctAnswer: 0,
      explanation: "Insertion at the head is constant time."
    },
    {
      question: "Which memory allocation is used in a linked-list stack?",
      options: ["Static", "Dynamic", "Fixed", "Sequential"],
      correctAnswer: 1,
      explanation: "Nodes are created dynamically."
    },
    {
      question: "What error occurs when Pop is performed on an empty stack?",
      options: ["Overflow", "Segmentation", "Underflow", "Timeout"],
      correctAnswer: 2,
      explanation: "Removing from an empty stack causes underflow."
    },
    {
      question: "What is one advantage of a linked-list stack over an array stack?",
      options: [
        "Requires fixed memory",
        "Dynamic size",
        "Slower Push",
        "Needs contiguous memory"
      ],
      correctAnswer: 1,
      explanation: "Linked-list stacks grow dynamically as needed."
    },
    {
  question: "Which operation inserts a new node at the beginning of the linked list stack?",
  options: ["Push", "Pop", "Peek", "Search"],
  correctAnswer: 0,
  explanation: "Push inserts a new node at the head of the linked list."
},
{
  question: "Why does a linked-list stack not suffer from overflow until memory is exhausted?",
  options: [
    "Because it uses recursion",
    "Because it grows dynamically",
    "Because it uses arrays",
    "Because it stores fewer elements"
  ],
  correctAnswer: 1,
  explanation: "Nodes are allocated dynamically, allowing the stack to grow as long as memory is available."
},
{
  question: "Which pointer is updated after a Push operation in a linked-list stack?",
  options: [
    "rear",
    "front",
    "head (top)",
    "tail"
  ],
  correctAnswer: 2,
  explanation: "The head pointer is updated to point to the newly inserted node."
},
{
  question: "What is removed during a Pop operation in a linked-list stack?",
  options: [
    "Last node",
    "Middle node",
    "Head node",
    "Tail node"
  ],
  correctAnswer: 2,
  explanation: "The top (head) node is removed from the linked-list stack."
},
{
  question: "Compared to an array implementation, a linked-list stack mainly provides:",
  options: [
    "Lower memory usage in all cases",
    "Dynamic memory allocation",
    "Faster searching",
    "Automatic sorting"
  ],
  correctAnswer: 1,
  explanation: "Linked lists allow dynamic memory allocation, avoiding the fixed-size limitation of arrays."
},
  ];

  return (
    <QuizEngine
      title="Stack Using Linked List Quiz"
      questions={questions}
    />
  );
};

export default StackUsingLinkedListQuiz;