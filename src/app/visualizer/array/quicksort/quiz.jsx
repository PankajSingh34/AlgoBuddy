"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QuickSortQuiz = () => {
  const questions = [
    {
      question: "What is the fundamental principle behind Quick Sort?",
      options: [
        "Merging two sorted lists into one",
        "Building a heap structure from the array",
        "Dividing the array around a pivot element",
        "Finding the minimum element repeatedly"
      ],
      correctAnswer: 2,
      explanation: "Quick Sort uses a divide-and-conquer approach by selecting a pivot element and partitioning the array into elements less than and greater than the pivot."
    },
    {
      question: "What is the average-case time complexity of Quick Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      correctAnswer: 1,
      explanation: "With good pivot selection that creates balanced partitions, Quick Sort averages O(n log n) time complexity."
    },
    {
      question: "Which pivot selection strategy helps avoid the worst-case O(n²) scenario?",
      options: [
        "Always choosing the first element",
        "Always choosing the last element",
        "Median-of-three method",
        "Always choosing the middle element"
      ],
      correctAnswer: 2,
      explanation: "The median-of-three strategy (choosing the median of first, middle, and last elements) helps prevent consistently bad pivot choices that lead to unbalanced partitions."
    },
    {
      question: "What is the space complexity of Quick Sort in the average case?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n log n)"
      ],
      correctAnswer: 2,
      explanation: "Quick Sort requires O(log n) space for the call stack in the average case due to recursive calls, but can degrade to O(n) in worst-case scenarios."
    },
    {
      question: "In the array [10, 80, 30, 90, 40, 50, 70], if we choose the last element as pivot, what is the array after the first partition?",
      options: [
        "[10, 30, 40, 50, 70, 80, 90]",
        "[10, 30, 40] [50] [70, 80, 90]",
        "[10, 30, 40, 50] [70] [80, 90]",
        "[10, 80, 30, 90, 40, 50, 70]"
      ],
      correctAnswer: 2,
      explanation: "With pivot=70, elements less than 70 (10,30,40,50) go left, elements greater (80,90) go right, and 70 is in its final position."
    },
    {
      question: "Which of these is NOT an advantage of Quick Sort?",
      options: [
        "Excellent average-case performance",
        "Stable sorting (maintains relative order of equal elements)",
        "In-place sorting (requires minimal additional memory)",
        "Cache-efficient due to sequential memory access"
      ],
      correctAnswer: 1,
      explanation: "Quick Sort is not stable - the relative order of equal elements may change during partitioning."
    },
    {
      question: "What causes Quick Sort's worst-case O(n²) time complexity?",
      options: [
        "When the array contains duplicate elements",
        "When the pivot consistently creates highly unbalanced partitions",
        "When the array size is very small",
        "When using extra space for merging"
      ],
      correctAnswer: 1,
      explanation: "The worst case occurs when the pivot selection consistently creates partitions of size n-1 and 0 (extremely unbalanced), leading to n nested calls."
    },
    {
      question: "Why is Quick Sort often preferred over Merge Sort for in-memory sorting?",
      options: [
        "It has better worst-case time complexity",
        "It is a stable sorting algorithm",
        "It has better cache performance due to sequential access",
        "It requires less code to implement"
      ],
      correctAnswer: 2,
      explanation: "Quick Sort's sequential memory access pattern makes it more cache-friendly than Merge Sort, contributing to its better real-world performance despite having the same average time complexity."
    },
    {
      question: "Which of these standard library implementations typically uses Quick Sort?",
      options: [
        "Python's sorted() function",
        "Java's Arrays.sort() for primitive types",
        "C++ STL's stable_sort()",
        "JavaScript's Array.prototype.sort()"
      ],
      correctAnswer: 1,
      explanation: "Java's Arrays.sort() uses a dual-pivot Quick Sort for primitive types (which don't need stability), while object sorting uses a stable Merge Sort variant."
    },
    {
      question: "What is the primary purpose of the partition step in Quick Sort?",
      options: [
        "To divide the array into exactly equal halves",
        "To place the pivot element in its correct final position",
        "To sort the array in one pass",
        "To identify duplicate elements in the array"
      ],
      correctAnswer: 1,
      explanation: "The partition step's main goal is to place the pivot in its correct sorted position while arranging other elements to be less than or greater than the pivot."
    },
    {
  question: "What is the main strategy used by Quick Sort?",
  options: [
    "Greedy",
    "Divide and Conquer",
    "Dynamic Programming",
    "Backtracking"
  ],
  correctAnswer: 1,
  explanation: "Quick Sort follows the Divide and Conquer approach by selecting a pivot and partitioning the array around it."
},
{
  question: "What is the average-case time complexity of Quick Sort?",
  options: [
    "O(n²)",
    "O(log n)",
    "O(n log n)",
    "O(n)"
  ],
  correctAnswer: 2,
  explanation: "Quick Sort has an average-case time complexity of O(n log n), making it one of the fastest practical sorting algorithms."
},
{
  question: "What is the worst-case time complexity of Quick Sort?",
  options: [
    "O(n)",
    "O(n²)",
    "O(log n)",
    "O(n log n)"
  ],
  correctAnswer: 1,
  explanation: "Quick Sort performs O(n²) in the worst case when poor pivot choices repeatedly create highly unbalanced partitions."
},
{
  question: "What is the role of the pivot element in Quick Sort?",
  options: [
    "It stores the smallest element",
    "It divides the array into smaller partitions",
    "It merges sorted arrays",
    "It keeps the array balanced"
  ],
  correctAnswer: 1,
  explanation: "The pivot is used to partition the array so that smaller elements are placed before it and larger elements after it."
},
{
  question: "Which statement about Quick Sort is correct?",
  options: [
    "It is always stable",
    "It requires O(n) extra space",
    "It is generally one of the fastest comparison-based sorting algorithms",
    "It only works on linked lists"
  ],
  correctAnswer: 2,
  explanation: "Quick Sort is widely used because of its excellent average-case performance, although the standard implementation is not stable."
},
{
  question: "What is the base case of the Quick Sort algorithm?",
  options: [
    "When the array has one or zero elements",
    "When the array is already sorted",
    "When two elements remain",
    "When the pivot is the largest element"
  ],
  correctAnswer: 0,
  explanation: "Quick Sort stops recursively dividing when the subarray contains one or zero elements, as it is already sorted."
},
{
  question: "Which operation is performed during the partition step of Quick Sort?",
  options: [
    "Merge two sorted arrays",
    "Compare and arrange elements around the pivot",
    "Find the minimum element",
    "Reverse the array"
  ],
  correctAnswer: 1,
  explanation: "The partition step rearranges elements so those smaller than the pivot come before it and larger ones come after it."
},
{
  question: "Which pivot selection strategy can improve Quick Sort's performance?",
  options: [
    "Random pivot",
    "Median-of-three pivot",
    "Middle element pivot",
    "All of the above"
  ],
  correctAnswer: 3,
  explanation: "Random, median-of-three, and middle-element pivot strategies all help reduce the chances of worst-case performance."
},
{
  question: "Is the standard implementation of Quick Sort stable?",
  options: [
    "Yes",
    "No",
    "Only for integers",
    "Only for sorted arrays"
  ],
  correctAnswer: 1,
  explanation: "The standard implementation of Quick Sort is not stable because equal elements may change their relative order."
},
{
  question: "What is the average auxiliary space complexity of Quick Sort?",
  options: [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n²)"
  ],
  correctAnswer: 1,
  explanation: "Quick Sort uses O(log n) auxiliary space on average due to recursive function calls."
},
{
  question: "Why is Quick Sort considered an in-place sorting algorithm?",
  options: [
    "It uses only a small amount of extra memory",
    "It creates multiple temporary arrays",
    "It stores all elements in another array",
    "It never swaps elements"
  ],
  correctAnswer: 0,
  explanation: "Quick Sort rearranges elements within the original array and requires only a small recursion stack."
},
{
  question: "Which situation can lead to the worst-case performance of Quick Sort?",
  options: [
    "Balanced partitions",
    "Random pivot selection",
    "Highly unbalanced partitions",
    "Duplicate elements only"
  ],
  correctAnswer: 2,
  explanation: "Worst-case performance occurs when each partition leaves one side almost empty, resulting in O(n²) time complexity."
},
{
  question: "Which sorting algorithm generally has better cache performance than Merge Sort?",
  options: [
    "Bubble Sort",
    "Selection Sort",
    "Quick Sort",
    "Insertion Sort"
  ],
  correctAnswer: 2,
  explanation: "Quick Sort accesses memory more sequentially, making it more cache-friendly and often faster in practice."
},
{
  question: "How many recursive calls are typically made in Quick Sort after partitioning?",
  options: [
    "One",
    "Two",
    "Three",
    "Four"
  ],
  correctAnswer: 1,
  explanation: "After partitioning, Quick Sort recursively sorts the left and right subarrays, resulting in two recursive calls."
},
{
  question: "Which scenario is most suitable for using Quick Sort?",
  options: [
    "Large in-memory datasets",
    "External sorting on disk",
    "Very small arrays only",
    "Linked lists only"
  ],
  correctAnswer: 0,
  explanation: "Quick Sort is widely used for large in-memory datasets because of its excellent average-case performance and cache efficiency."
}
  ];

  return <QuizEngine title="Quick Sort Quiz Challenge" questions={questions} />;
};

export default QuickSortQuiz;
