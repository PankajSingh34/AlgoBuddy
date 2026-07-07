"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the first step in the Heap Sort algorithm?",
    options: [
      "Build a Max Heap",
      "Build a Min Heap",
      "Sort the array",
      "Reverse the array"
    ],
    correctAnswer: 0,
    explanation:
      "Heap Sort begins by converting the input array into a Max Heap."
  },
  {
    question: "Heap Sort is based on which data structure?",
    options: [
      "Queue",
      "Binary Heap",
      "Trie",
      "Graph"
    ],
    correctAnswer: 1,
    explanation:
      "Heap Sort uses a Binary Heap (typically a Max Heap) to sort elements."
  },
  {
    question: "What is the worst-case time complexity of Heap Sort?",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(log n)",
      "O(n)"
    ],
    correctAnswer: 1,
    explanation:
      "Heap Sort performs heap construction and repeated heapify operations, resulting in O(n log n)."
  },
  {
    question: "What is the best-case time complexity of Heap Sort?",
    options: [
      "O(n)",
      "O(log n)",
      "O(n log n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Heap Sort has O(n log n) complexity in the best, average, and worst cases."
  },
  {
    question: "Heap Sort sorts the array in ascending order by using:",
    options: [
      "Min Heap",
      "Max Heap",
      "AVL Tree",
      "Trie"
    ],
    correctAnswer: 1,
    explanation:
      "A Max Heap repeatedly places the largest element at the end of the array."
  },
  {
    question: "Which operation is repeatedly performed after removing the root element?",
    options: [
      "Binary Search",
      "Heapify Down",
      "Tree Rotation",
      "Insertion"
    ],
    correctAnswer: 1,
    explanation:
      "After swapping the root with the last element, Heapify Down restores the heap property."
  },
  {
    question: "Is Heap Sort a stable sorting algorithm?",
    options: [
      "Yes",
      "No",
      "Only for integers",
      "Only for strings"
    ],
    correctAnswer: 1,
    explanation:
      "Heap Sort is not stable because equal elements may change their relative order."
  },
  {
    question: "What is the auxiliary space complexity of Heap Sort?",
    options: [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Heap Sort is an in-place sorting algorithm and requires only constant extra space."
  },
  {
    question: "Which of the following is an advantage of Heap Sort?",
    options: [
      "Stable sorting",
      "Guaranteed O(n log n) performance",
      "Requires additional arrays",
      "Works only on linked lists"
    ],
    correctAnswer: 1,
    explanation:
      "Heap Sort guarantees O(n log n) performance regardless of input."
  },
  {
    question: "Heap Sort is commonly used when:",
    options: [
      "Predictable worst-case performance is required",
      "Only stable sorting is needed",
      "The data is already sorted",
      "Working exclusively with linked lists"
    ],
    correctAnswer: 0,
    explanation:
      "Heap Sort is useful when guaranteed O(n log n) worst-case time is important."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Heap Sort Quiz"
      questions={questions}
    />
  );
}