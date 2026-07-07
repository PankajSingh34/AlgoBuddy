"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const DoublyLinkedListQuiz = () => {
  const questions = [
    {
      question: "What is the main advantage of a Doubly Linked List over a Singly Linked List?",
      options: [
        "It requires less memory",
        "It allows traversal in both directions",
        "It stores elements in sorted order",
        "It supports random access"
      ],
      correctAnswer: 1,
      explanation: "Each node has both previous and next pointers, allowing forward and backward traversal."
    },
    {
      question: "How many pointers does each node in a Doubly Linked List contain?",
      options: [
        "One",
        "Two",
        "Three",
        "Four"
      ],
      correctAnswer: 1,
      explanation: "Each node contains one previous pointer and one next pointer."
    },
    {
      question: "Which pointer of the first node is NULL?",
      options: [
        "next",
        "previous",
        "both",
        "neither"
      ],
      correctAnswer: 1,
      explanation: "The previous pointer of the first node is NULL."
    },
    {
      question: "Which pointer of the last node is NULL?",
      options: [
        "previous",
        "next",
        "both",
        "head"
      ],
      correctAnswer: 1,
      explanation: "The next pointer of the last node is NULL."
    },
    {
      question: "What is the time complexity of inserting a node at the beginning?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "Only a few pointer updates are required."
    },
    {
      question: "Which operation becomes easier in a Doubly Linked List compared to a Singly Linked List?",
      options: [
        "Binary Search",
        "Backward traversal",
        "Sorting",
        "Hashing"
      ],
      correctAnswer: 1,
      explanation: "The previous pointer enables backward traversal."
    },
    {
      question: "What is the major disadvantage of a Doubly Linked List?",
      options: [
        "Cannot insert nodes",
        "Extra memory required for previous pointers",
        "Cannot delete nodes",
        "Cannot traverse"
      ],
      correctAnswer: 1,
      explanation: "Each node stores an additional previous pointer."
    },
    {
      question: "Which application commonly uses a Doubly Linked List?",
      options: [
        "Browser Back and Forward navigation",
        "Binary Search",
        "Heap Sort",
        "Graph Coloring"
      ],
      correctAnswer: 0,
      explanation: "Web browsers use Doubly Linked Lists for back and forward navigation."
    },
    {
      question: "What is the time complexity of deleting a known node in a Doubly Linked List?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "Pointers can be updated directly without traversal."
    },
    {
      question: "Which statement about a Doubly Linked List is true?",
      options: [
        "Nodes can only be traversed forward.",
        "Each node stores previous and next pointers.",
        "Nodes are stored in contiguous memory.",
        "It does not support insertion."
      ],
      correctAnswer: 1,
      explanation: "Each node maintains links to both the previous and next nodes."
    }
  ];

  return (
    <QuizEngine
      title="Doubly Linked List Quiz"
      questions={questions}
    />
  );
};

export default DoublyLinkedListQuiz;