"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the defining property of a Max Heap?",
    options: [
      "Every parent node is smaller than its children",
      "Every parent node is greater than or equal to its children",
      "The tree is always a Binary Search Tree",
      "All leaf nodes are sorted"
    ],
    correctAnswer: 1,
    explanation: "In a Max Heap, every parent node has a value greater than or equal to its children."
  },
  {
    question: "What is the defining property of a Min Heap?",
    options: [
      "Every parent node is smaller than or equal to its children",
      "Every parent node is greater than its children",
      "Leaf nodes contain the smallest values",
      "The tree is always balanced"
    ],
    correctAnswer: 0,
    explanation: "In a Min Heap, every parent node has a value less than or equal to its children."
  },
  {
    question: "Which type of binary tree is used to implement a Heap?",
    options: [
      "Perfect Binary Tree",
      "Complete Binary Tree",
      "Binary Search Tree",
      "AVL Tree"
    ],
    correctAnswer: 1,
    explanation: "A Heap is always implemented as a Complete Binary Tree."
  },
  {
    question: "Which data structure is commonly used to store a Heap?",
    options: [
      "Linked List",
      "Array",
      "Stack",
      "Hash Table"
    ],
    correctAnswer: 1,
    explanation: "Heaps are efficiently stored in arrays without explicit pointers."
  },
  {
    question: "What is the time complexity of inserting an element into a Heap?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 1,
    explanation: "Insertion may require heapifying upward, resulting in O(log n)."
  },
  {
    question: "What is the time complexity of deleting the root element from a Heap?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Deleting the root requires heapifying downward, which takes O(log n)."
  },
  {
    question: "Which algorithm is commonly implemented using a Heap?",
    options: [
      "Merge Sort",
      "Heap Sort",
      "Quick Sort",
      "Insertion Sort"
    ],
    correctAnswer: 1,
    explanation: "Heap Sort uses a Binary Heap to efficiently sort elements."
  },
  {
    question: "Which operation returns the highest-priority element in a Max Heap?",
    options: [
      "Peek",
      "Push",
      "Search",
      "Traverse"
    ],
    correctAnswer: 0,
    explanation: "The root node contains the maximum element and can be accessed using peek."
  },
  {
    question: "Which application commonly uses Heaps?",
    options: [
      "Priority Queues",
      "Breadth-First Search",
      "Trie Searching",
      "Binary Search"
    ],
    correctAnswer: 0,
    explanation: "Priority Queues are commonly implemented using Binary Heaps."
  },
  {
    question: "What is the time complexity of accessing the root element of a Heap?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 0,
    explanation: "The root element is stored at the first position, making access constant time."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Heap Tree Quiz"
      questions={questions}
    />
  );
}