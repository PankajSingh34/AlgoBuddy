"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const HeapSortQuiz = () => {
  const questions = [
    {
      question: "What data structure is Heap Sort based on?",
      options: [
        "Queue",
        "Heap",
        "Stack",
        "Linked List"
      ],
      correctAnswer: 1,
      explanation:
        "Heap Sort is based on the Heap data structure, usually implemented as a Binary Max Heap."
    },
    {
      question: "What is the worst-case time complexity of Heap Sort?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort has a worst-case time complexity of O(n log n)."
    },
    {
      question: "Which type of heap is used for sorting an array in ascending order?",
      options: [
        "Min Heap",
        "Max Heap",
        "AVL Tree",
        "Binary Search Tree"
      ],
      correctAnswer: 1,
      explanation:
        "A Max Heap is used so the largest element is repeatedly placed at the end."
    },
    {
      question: "What is the auxiliary space complexity of Heap Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation:
        "Heap Sort is an in-place sorting algorithm and uses constant extra space."
    },
    {
      question: "Is Heap Sort a stable sorting algorithm?",
      options: [
        "Yes",
        "No",
        "Only for integers",
        "Depends on the input"
      ],
      correctAnswer: 1,
      explanation:
        "Heap Sort is not stable because equal elements may not preserve their relative order."
    },
    {
      question: "What is the first step of Heap Sort?",
      options: [
        "Choose a pivot",
        "Build a Max Heap",
        "Merge subarrays",
        "Reverse the array"
      ],
      correctAnswer: 1,
      explanation:
        "The algorithm first converts the input array into a Max Heap."
    },
    {
      question: "After building the Max Heap, what happens next?",
      options: [
        "Delete the smallest element",
        "Swap the root with the last element",
        "Split the array",
        "Insert a new value"
      ],
      correctAnswer: 1,
      explanation:
        "The largest element at the root is swapped with the last element, then heapify is performed."
    },
    {
      question: "Heap Sort uses which tree structure?",
      options: [
        "AVL Tree",
        "Binary Heap",
        "Trie",
        "Red-Black Tree"
      ],
      correctAnswer: 1,
      explanation:
        "Heap Sort uses a Binary Heap, which is a complete binary tree."
    },
    {
      question: "In a Max Heap, the parent node is:",
      options: [
        "Smaller than its children",
        "Greater than or equal to its children",
        "Equal to its children",
        "Always a leaf node"
      ],
      correctAnswer: 1,
      explanation:
        "Every parent node in a Max Heap is greater than or equal to its children."
    },
    {
      question: "Heap Sort belongs to which category?",
      options: [
        "Comparison-based sorting",
        "Non-comparison sorting",
        "Hashing algorithm",
        "Searching algorithm"
      ],
      correctAnswer: 0,
      explanation:
        "Heap Sort is a comparison-based sorting algorithm."
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
        "Heap Sort performs O(n log n) in the best, average, and worst cases."
    },
    {
      question: "Which operation is repeatedly used in Heap Sort?",
      options: [
        "Merge",
        "Partition",
        "Heapify",
        "Insertion"
      ],
      correctAnswer: 2,
      explanation:
        "Heapify restores the heap property after every swap."
    },
    {
      question: "Heap Sort guarantees which time complexity?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort always guarantees O(n log n) performance."
    },
    {
      question: "Heap Sort is mainly preferred because it:",
      options: [
        "Is stable",
        "Needs no comparisons",
        "Provides guaranteed O(n log n) performance",
        "Uses recursion only"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort has guaranteed O(n log n) time complexity regardless of input."
    },
    {
      question: "Which statement about Heap Sort is correct?",
      options: [
        "It is stable",
        "It requires O(n) extra memory",
        "It is an in-place comparison sorting algorithm",
        "It works only for integers"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort is an in-place comparison sorting algorithm."
    },
    {
  question: "What is the primary purpose of the Heapify operation?",
  options: [
    "To sort the entire array",
    "To maintain the heap property",
    "To merge two heaps",
    "To reverse the heap"
  ],
  correctAnswer: 1,
  explanation: "Heapify restores the heap property by ensuring every parent node satisfies the heap condition with its children."
},
{
  question: "Which element is stored at the root of a Max Heap?",
  options: [
    "The smallest element",
    "The middle element",
    "The largest element",
    "A random element"
  ],
  correctAnswer: 2,
  explanation: "In a Max Heap, the largest element is always stored at the root."
},
{
  question: "How many child nodes can each node have in a Binary Heap?",
  options: [
    "One",
    "Two",
    "Three",
    "Unlimited"
  ],
  correctAnswer: 1,
  explanation: "A Binary Heap is a complete binary tree where each node can have at most two children."
},
{
  question: "Which property must a Max Heap satisfy?",
  options: [
    "Parent is smaller than children",
    "Parent is greater than or equal to its children",
    "Children are always equal",
    "Leaf nodes contain the largest values"
  ],
  correctAnswer: 1,
  explanation: "In a Max Heap, every parent node must be greater than or equal to its child nodes."
},
{
  question: "How many phases does Heap Sort mainly consist of?",
  options: [
    "One",
    "Two",
    "Three",
    "Four"
  ],
  correctAnswer: 1,
  explanation: "Heap Sort has two main phases: building the heap and repeatedly extracting the maximum element."
},
{
  question: "What happens after swapping the root with the last element during Heap Sort?",
  options: [
    "The algorithm stops",
    "The heap property is restored using Heapify",
    "The array is divided into halves",
    "The heap is rebuilt from scratch"
  ],
  correctAnswer: 1,
  explanation: "After each swap, Heapify is applied to restore the Max Heap property."
},
{
  question: "Which traversal is used by Heap Sort?",
  options: [
    "Inorder Traversal",
    "Preorder Traversal",
    "No tree traversal is required",
    "Level-order Traversal"
  ],
  correctAnswer: 2,
  explanation: "Heap Sort manipulates the heap using array indices and Heapify, without performing traditional tree traversals."
},
{
  question: "Why is Heap Sort considered an in-place algorithm?",
  options: [
    "It creates a second array",
    "It uses only constant extra memory",
    "It requires recursion only",
    "It avoids comparisons"
  ],
  correctAnswer: 1,
  explanation: "Heap Sort rearranges elements within the original array and requires only O(1) auxiliary space."
},
{
  question: "Which sorting algorithm also guarantees O(n log n) time but requires additional memory?",
  options: [
    "Bubble Sort",
    "Selection Sort",
    "Merge Sort",
    "Insertion Sort"
  ],
  correctAnswer: 2,
  explanation: "Merge Sort guarantees O(n log n) time but requires O(n) extra space, unlike Heap Sort."
},
{
  question: "Which scenario is most suitable for using Heap Sort?",
  options: [
    "When guaranteed O(n log n) performance and O(1) extra space are required",
    "When stable sorting is required",
    "When sorting only small arrays",
    "When no comparisons are allowed"
  ],
  correctAnswer: 0,
  explanation: "Heap Sort is ideal when guaranteed O(n log n) performance and constant extra memory are important, even though it is not stable."
}
  ];

  return (
    <QuizEngine
      title="Heap Sort Quiz Challenge"
      questions={questions}
    />
  );
};

export default HeapSortQuiz;