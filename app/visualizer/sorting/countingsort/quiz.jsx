"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const CountingSortQuiz = () => {
  const questions = [
    {
      question: "What makes Counting Sort different from Bubble Sort or Quick Sort?",
      options: [
        "It compares adjacent elements only",
        "It uses value frequencies instead of pairwise comparisons",
        "It always sorts strings",
        "It never uses extra memory",
      ],
      correctAnswer: 1,
      explanation:
        "Counting Sort counts how often each value appears and uses those counts to place values directly into sorted positions.",
    },
    {
      question: "What does k represent in the O(n + k) complexity of Counting Sort?",
      options: [
        "The number of duplicate values",
        "The number of swaps",
        "The size of the input value range",
        "The number of recursive calls",
      ],
      correctAnswer: 2,
      explanation:
        "k is the number of possible integer values between the minimum and maximum value in the input range.",
    },
    {
      question: "Why are cumulative counts used in Counting Sort?",
      options: [
        "To find the exact output positions of values",
        "To compare every pair of elements",
        "To reduce the array size",
        "To choose a pivot",
      ],
      correctAnswer: 0,
      explanation:
        "A cumulative count tells how many elements are less than or equal to a value, which identifies its ending position in sorted order.",
    },
    {
      question: "Why does the stable version scan the input from right to left during placement?",
      options: [
        "To avoid using a count array",
        "To preserve the relative order of equal values",
        "To make the algorithm recursive",
        "To sort in descending order only",
      ],
      correctAnswer: 1,
      explanation:
        "Right-to-left placement with cumulative counts keeps equal elements in the same relative order they had in the original input.",
    },
    {
      question: "When is Counting Sort a good choice?",
      options: [
        "When values are integers in a reasonably small range",
        "When values are arbitrary objects with no numeric key",
        "When memory must be O(1)",
        "When the range is much larger than the input",
      ],
      correctAnswer: 0,
      explanation:
        "Counting Sort works best when the input values are bounded integers and the range size is not too large compared with n.",
    },
    {
      question: "What is the space complexity of Counting Sort?",
      options: ["O(1)", "O(log n)", "O(n + k)", "O(n squared)"],
      correctAnswer: 2,
      explanation:
        "Counting Sort usually needs a count array of size k and an output array of size n, giving O(n + k) extra space.",
    },
  ];

  return <QuizEngine title="Counting Sort Quiz Challenge" questions={questions} />;
};

export default CountingSortQuiz;
