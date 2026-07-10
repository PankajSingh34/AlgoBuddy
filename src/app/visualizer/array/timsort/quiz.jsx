"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const TimSortQuiz = () => {
  const questions = [
    {
      question: "What type of algorithm is Tim Sort?",
      options: [
        "A pure comparison sort",
        "A distribution sort",
        "A hybrid stable sorting algorithm",
        "An in-place unstable sort"
      ],
      correctAnswer: 2,
      explanation: "Tim Sort is a hybrid algorithm, derived from merge sort and insertion sort, and it is stable, meaning it preserves the relative order of equal elements."
    },
    {
      question: "Tim Sort was originally designed for which programming language?",
      options: [
        "Java",
        "Python",
        "C++",
        "JavaScript"
      ],
      correctAnswer: 1,
      explanation: "Tim Sort was invented by Tim Peters in 2002 for use in the Python programming language. It's now also used in Java, Android, and Swift."
    },
    {
      question: "What are the two main sorting algorithms that Tim Sort combines?",
      options: [
        "Quick Sort and Heap Sort",
        "Bubble Sort and Selection Sort",
        "Merge Sort and Insertion Sort",
        "Radix Sort and Counting Sort"
      ],
      correctAnswer: 2,
      explanation: "Tim Sort uses Insertion Sort to sort small chunks of the array (called runs) and Merge Sort to merge these runs together."
    },
    {
      question: "What is a 'natural run' in the context of Tim Sort?",
      options: [
        "A randomly selected part of the array",
        "A contiguous subsequence of the data that is already ordered",
        "The first half of the array",
        "Any subsequence with an even number of elements"
      ],
      correctAnswer: 1,
      explanation: "Tim Sort is adaptive and performs exceptionally well on partially sorted data by identifying existing sorted sequences, known as natural runs."
    },
    {
      question: "What is the worst-case time complexity of Tim Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      correctAnswer: 1,
      explanation: "Like Merge Sort, Tim Sort's worst-case time complexity is guaranteed to be O(n log n), making it very efficient for large datasets."
    },
    {
      question: "What is the best-case time complexity of Tim Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 0,
      explanation: "In the best-case scenario (an already sorted array), Tim Sort can achieve linear time complexity, O(n), because it only needs to identify the single run."
    },
    {
      question: "Why is Tim Sort considered an adaptive sorting algorithm?",
      options: [
        "It adapts its strategy based on the size of the input array",
        "It performs well on data that is already partially sorted",
        "It can sort different data types",
        "It adapts the number of threads based on CPU cores"
      ],
      correctAnswer: 1,
      explanation: "Tim Sort is adaptive because it takes advantage of existing order ('runs') in the data, making it much faster for partially or fully sorted arrays."
    },
    {
      question: "What is the purpose of 'minrun' in Tim Sort?",
      options: [
        "It's the minimum size for the entire array to be sorted",
        "It's a threshold; runs smaller than minrun are extended and sorted with Insertion Sort",
        "It's the maximum number of runs allowed on the stack",
        "It defines the pivot for merging"
      ],
      correctAnswer: 1,
      explanation: "Minrun is a calculated size. Any identified run smaller than this value is lengthened and then sorted using Insertion Sort, which is efficient for small lists."
    },
    {
      question: "How does Tim Sort merge runs?",
      options: [
        "It always merges the two largest runs first",
        "It merges runs randomly",
        "It uses a stack and merges adjacent runs to maintain balance",
        "It merges all runs at once in a single pass"
      ],
      correctAnswer: 2,
      explanation: "Tim Sort pushes sorted runs onto a stack and merges adjacent runs whenever specific stack invariants are violated, ensuring the merge process remains efficient."
    },
    {
      question: "What is the space complexity of Tim Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "In the worst case, Tim Sort requires O(n) temporary space for merging runs. However, for nearly sorted data, it can be as low as O(log n)."
    }
  ];

  return <QuizEngine title="Tim Sort Quiz Challenge" questions={questions} />;
};

export default TimSortQuiz;
