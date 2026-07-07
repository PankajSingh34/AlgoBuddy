"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is a Heap?",
    options: [
      "A linear data structure",
      "A complete binary tree that satisfies the heap property",
      "A balanced BST",
      "A graph"
    ],
    correctAnswer: 1,
    explanation:
      "A Heap is a complete binary tree that satisfies either the Min Heap or Max Heap property."
  },
  {
    question: "In a Min Heap, the value of the parent node is:",
    options: [
      "Greater than or equal to its children",
      "Less than or equal to its children",
      "Equal to its children",
      "Always the largest element"
    ],
    correctAnswer: 1,
    explanation:
      "Every parent node in a Min Heap has a value less than or equal to its children."
  },
  {
    question: "In a Max Heap, the root node contains:",
    options: [
      "The smallest element",
      "The median element",
      "The largest element",
      "A random element"
    ],
    correctAnswer: 2,
    explanation:
      "The largest element is always stored at the root of a Max Heap."
  },
  {
    question: "A Heap is implemented using:",
    options: [
      "Linked List",
      "Array",
      "Graph",
      "Hash Table"
    ],
    correctAnswer: 1,
    explanation:
      "Heaps are efficiently represented using arrays because they are complete binary trees."
  },
  {
    question: "The height of a Heap containing n nodes is:",
    options: [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation:
      "Since a Heap is a complete binary tree, its height is logarithmic."
  },
  {
    question: "Insertion into a Heap requires:",
    options: [
      "Heapify Up",
      "Heapify Down",
      "DFS",
      "Sorting"
    ],
    correctAnswer: 0,
    explanation:
      "After insertion, Heapify Up restores the heap property."
  },
  {
    question: "Deleting the root from a Heap requires:",
    options: [
      "Heapify Down",
      "Heapify Up",
      "Binary Search",
      "Tree Rotation"
    ],
    correctAnswer: 0,
    explanation:
      "After replacing the root with the last element, Heapify Down restores the heap property."
  },
  {
    question: "Which Heap is commonly used for Priority Queues?",
    options: [
      "Min Heap",
      "Max Heap",
      "Both Min Heap and Max Heap",
      "AVL Tree"
    ],
    correctAnswer: 2,
    explanation:
      "Priority Queues can be implemented using either Min Heaps or Max Heaps depending on the requirement."
  },
  {
    question: "What is the time complexity of inserting into a Heap?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 1,
    explanation:
      "Insertion may require moving up the tree, taking O(log n)."
  },
  {
    question: "Which of the following is NOT an application of Heaps?",
    options: [
      "Priority Queue",
      "Heap Sort",
      "Graph Algorithms",
      "Binary Search"
    ],
    correctAnswer: 3,
    explanation:
      "Binary Search operates on sorted arrays and does not use a Heap."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Heap (Min/Max) Quiz"
      questions={questions}
    />
  );
}