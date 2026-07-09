"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the defining property of a Max Heap?",
    options: [
      "Every parent node is less than its children",
      "Every parent node is greater than or equal to its children",
      "Nodes are stored in sorted order",
      "Leaf nodes contain the largest values"
    ],
    correctAnswer: 1,
    explanation:
      "In a Max Heap, every parent node has a value greater than or equal to its children."
  },
  {
    question: "Which element is always stored at the root of a Max Heap?",
    options: [
      "Smallest element",
      "Median element",
      "Largest element",
      "Last inserted element"
    ],
    correctAnswer: 2,
    explanation:
      "The maximum element is always stored at the root."
  },
  {
    question: "What is the time complexity of finding the maximum element in a Max Heap?",
    options: [
      "O(log n)",
      "O(n)",
      "O(1)",
      "O(n log n)"
    ],
    correctAnswer: 2,
    explanation:
      "The largest element is at the root, so it can be accessed in constant time."
  },
  {
    question: "After deleting the root from a Max Heap, which operation restores the heap property?",
    options: [
      "Heapify Up",
      "Heapify Down",
      "Binary Search",
      "Tree Rotation"
    ],
    correctAnswer: 1,
    explanation:
      "Heapify Down restores the Max Heap property after removing the root."
  },
  {
    question: "What is the worst-case time complexity of inserting an element into a Max Heap?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation:
      "The new element may move up to the root during Heapify Up."
  },
  {
    question: "A Max Heap is commonly implemented using:",
    options: [
      "Linked List",
      "Array",
      "Hash Table",
      "Graph"
    ],
    correctAnswer: 1,
    explanation:
      "An array efficiently stores a complete binary tree."
  },
  {
    question: "Which application commonly uses a Max Heap?",
    options: [
      "Priority Queue",
      "Expression Tree",
      "Trie",
      "Binary Search"
    ],
    correctAnswer: 0,
    explanation:
      "Max Heaps are commonly used to implement Priority Queues."
  },
  {
    question: "Which of the following is TRUE about a Max Heap?",
    options: [
      "It is always a Binary Search Tree",
      "Sibling nodes are always sorted",
      "Only the heap property is guaranteed",
      "All levels are completely full"
    ],
    correctAnswer: 2,
    explanation:
      "Only the parent-child heap property is guaranteed; siblings are not necessarily ordered."
  },
  {
    question: "The height of a Max Heap containing n elements is:",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation:
      "A complete binary tree has logarithmic height."
  },
  {
    question: "Which sorting algorithm is based on a Max Heap?",
    options: [
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
      "Insertion Sort"
    ],
    correctAnswer: 2,
    explanation:
      "Heap Sort repeatedly removes the maximum element from a Max Heap."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Heap (Max) Quiz"
      questions={questions}
    />
  );
}