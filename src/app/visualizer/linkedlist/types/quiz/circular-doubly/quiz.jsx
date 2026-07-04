"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const CircularDoublyLinkedListQuiz = () => {
  const questions = [
    {
      question: "What is the defining feature of a Circular Doubly Linked List?",
      options: [
        "Each node stores only one pointer.",
        "The last node points to NULL.",
        "The last node links to the first node and the first node links back to the last node.",
        "Nodes are stored in contiguous memory."
      ],
      correctAnswer: 2,
      explanation: "A Circular Doubly Linked List connects both ends, allowing continuous traversal in both directions."
    },
    {
      question: "How many pointers does each node in a Circular Doubly Linked List contain?",
      options: [
        "One",
        "Two",
        "Three",
        "Four"
      ],
      correctAnswer: 1,
      explanation: "Each node contains a previous pointer and a next pointer."
    },
    {
      question: "What does the next pointer of the last node point to?",
      options: [
        "NULL",
        "The previous node",
        "The head node",
        "Itself"
      ],
      correctAnswer: 2,
      explanation: "The last node's next pointer points back to the head, forming a circle."
    },
    {
      question: "What does the previous pointer of the head node point to?",
      options: [
        "NULL",
        "The last node",
        "The second node",
        "Itself"
      ],
      correctAnswer: 1,
      explanation: "The head's previous pointer points to the last node."
    },
    {
      question: "Which traversal is supported in a Circular Doubly Linked List?",
      options: [
        "Only forward",
        "Only backward",
        "Both forward and backward",
        "Random traversal only"
      ],
      correctAnswer: 2,
      explanation: "The previous and next pointers allow traversal in both directions."
    },
    {
      question: "Which application commonly uses a Circular Doubly Linked List?",
      options: [
        "Music playlist with Next and Previous controls",
        "Binary Search",
        "Merge Sort",
        "Hash Table"
      ],
      correctAnswer: 0,
      explanation: "Media players often use Circular Doubly Linked Lists to navigate songs in both directions."
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
      explanation: "Insertion only requires updating a few pointers."
    },
    {
      question: "What is the time complexity of deleting a known node?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "Given the node, deletion only requires pointer updates."
    },
    {
      question: "What is the main disadvantage of a Circular Doubly Linked List?",
      options: [
        "Cannot traverse backward",
        "Requires extra memory for previous pointers",
        "Cannot insert nodes",
        "Does not support deletion"
      ],
      correctAnswer: 1,
      explanation: "Each node stores an additional previous pointer, increasing memory usage."
    },
    {
      question: "Which statement about a Circular Doubly Linked List is correct?",
      options: [
        "The last node points to NULL.",
        "Traversal stops when NULL is reached.",
        "Both ends of the list are connected, allowing continuous traversal.",
        "Only one pointer is stored in each node."
      ],
      correctAnswer: 2,
      explanation: "The list forms a closed loop, enabling traversal in both forward and backward directions."
    }
  ];

  return (
    <QuizEngine
      title="Circular Doubly Linked List Quiz"
      questions={questions}
    />
  );
};

export default CircularDoublyLinkedListQuiz;