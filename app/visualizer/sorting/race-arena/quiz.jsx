"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const ArenaQuiz = () => {
  const questions = [
    {
      question: "Which of the following sorting algorithms is NOT stable by default?",
      options: [
        "Bubble Sort",
        "Insertion Sort",
        "Quick Sort",
        "Merge Sort"
      ],
      correctAnswer: 2,
      explanation: "Quick Sort is inherently unstable because its partitioning swaps elements over long distances, which can disrupt the relative order of identical elements."
    },
    {
      question: "Which algorithm performs the absolute fewest number of write/swap operations, making it optimal when writing to memory is extremely slow/costly?",
      options: [
        "Selection Sort",
        "Bubble Sort",
        "Insertion Sort",
        "Quick Sort"
      ],
      correctAnswer: 0,
      explanation: "Selection Sort only swaps elements at most O(N) times because it scans the array to locate the exact minimum, making it highly optimal for minimizing write operations."
    },
    {
      question: "What is the worst-case time complexity of Quick Sort, and under what condition does it occur?",
      options: [
        "O(N log N) when the array is randomly shuffled",
        "O(N^2) when the array is already sorted and the pivot chosen is always the first or last element",
        "O(N log N) when a perfect median pivot is always chosen",
        "O(N^2) when the elements are all identical and the pivot is chosen at random"
      ],
      correctAnswer: 1,
      explanation: "If Quick Sort always picks the first or last element as the pivot on a sorted or reverse-sorted array, partitioning becomes highly unbalanced (size 0 and N-1), resulting in O(N^2) complexity."
    },
    {
      question: "In what condition does Insertion Sort achieve its best-case time complexity of O(N)?",
      options: [
        "When the input array is completely sorted in reverse order",
        "When the input array is already fully sorted in ascending order",
        "When the array elements are completely randomized",
        "Insertion Sort never achieves O(N) best-case complexity"
      ],
      correctAnswer: 1,
      explanation: "On an already sorted array, Insertion Sort only does 1 comparison per element and 0 swaps, resulting in a highly optimal O(N) best-case linear traversal."
    },
    {
      question: "Which of the following describes the difference in auxiliary space complexity between Quick Sort and standard Merge Sort?",
      options: [
        "Quick Sort uses O(N) space, while Merge Sort uses O(log N) space",
        "Quick Sort uses O(log N) space (recursion stack), while Merge Sort requires O(N) auxiliary space for temp arrays",
        "Both algorithms use O(1) in-place auxiliary space",
        "Quick Sort uses O(N log N) space, while Merge Sort uses O(N) space"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort requires O(N) auxiliary memory to temporarily hold split arrays during merges. Quick Sort is in-place but requires O(log N) auxiliary space in the recursion call stack (or O(N) in worst-case degenerate recursion)."
    }
  ];

  return <QuizEngine title="Sorting Race Arena Quiz" questions={questions} />;
};

export default ArenaQuiz;
