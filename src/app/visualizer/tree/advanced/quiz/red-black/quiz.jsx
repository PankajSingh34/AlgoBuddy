"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the root node color in a Red-Black Tree?",
    options: ["Red", "Black", "Either Red or Black", "Blue"],
    correctAnswer: 1,
    explanation: "The root of every Red-Black Tree must always be black."
  },
  {
    question: "Which type of Binary Search Tree is a Red-Black Tree?",
    options: [
      "Complete BST",
      "Self-balancing BST",
      "Threaded BST",
      "Skewed BST"
    ],
    correctAnswer: 1,
    explanation: "Red-Black Trees automatically maintain balance after insertions and deletions."
  },
  {
    question: "Can two consecutive red nodes exist in a Red-Black Tree?",
    options: [
      "Yes",
      "No",
      "Only at the root",
      "Only in leaf nodes"
    ],
    correctAnswer: 1,
    explanation: "A red node cannot have a red parent."
  },
  {
    question: "Every path from a node to its descendant NULL nodes must contain:",
    options: [
      "Equal number of red nodes",
      "Equal number of black nodes",
      "Equal height",
      "Equal number of leaves"
    ],
    correctAnswer: 1,
    explanation: "This is called the Black Height property."
  },
  {
    question: "Which operation is used to restore balance after insertion?",
    options: [
      "Sorting",
      "Rotations and recoloring",
      "Searching",
      "Heapify"
    ],
    correctAnswer: 1,
    explanation: "Balancing is achieved using rotations along with recoloring."
  },
  {
    question: "What is the worst-case height of a Red-Black Tree?",
    options: [
      "O(n)",
      "O(log n)",
      "O(n²)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation: "Red-Black Trees guarantee logarithmic height."
  },
  {
    question: "Which color are all NULL (NIL) leaves considered?",
    options: [
      "Red",
      "Black",
      "Green",
      "White"
    ],
    correctAnswer: 1,
    explanation: "All NIL leaves are treated as black nodes."
  },
  {
    question: "Which operation has O(log n) complexity in a Red-Black Tree?",
    options: [
      "Search",
      "Insertion",
      "Deletion",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Search, insertion, and deletion all execute in O(log n)."
  },
  {
    question: "Why are Red-Black Trees preferred over normal BSTs?",
    options: [
      "They require less memory",
      "They always remain balanced",
      "They eliminate recursion",
      "They sort automatically"
    ],
    correctAnswer: 1,
    explanation: "Self-balancing prevents degeneration into a linked list."
  },
  {
    question: "Red-Black Trees are commonly used in:",
    options: [
      "Compilers",
      "Operating Systems",
      "STL map/set implementations",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Red-Black Trees are widely used in standard libraries, operating systems, and compilers."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Red-Black Tree Quiz"
      questions={questions}
    />
  );
}