"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const PalindromeCheckQuiz = () => {
  const questions = [
    {
      question: "What is a palindrome?",
      options: [
        "A string that contains only vowels",
        "A string that reads the same forwards and backwards",
        "A string with duplicate characters",
        "A string sorted alphabetically",
      ],
      correctAnswer: 1,
      explanation:
        "A palindrome is a string that remains the same when read from left to right and right to left.",
    },
    {
      question: "Which technique is commonly used to check whether a string is a palindrome?",
      options: [
        "Binary Search",
        "Breadth First Search",
        "Two Pointers",
        "Bubble Sort",
      ],
      correctAnswer: 2,
      explanation:
        "The two-pointer technique compares characters from both ends of the string while moving inward.",
    },
    {
      question: "What is the time complexity of the two-pointer palindrome algorithm?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)",
      ],
      correctAnswer: 2,
      explanation:
        "Each character is checked at most once, resulting in O(n) time complexity.",
    },
    {
      question: "What is the space complexity of the iterative palindrome check?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)",
      ],
      correctAnswer: 0,
      explanation:
        "Only two pointers are used, so the auxiliary space complexity is O(1).",
    },
    {
      question: "Which of these strings is a palindrome?",
      options: [
        "hello",
        "level",
        "apple",
        "world",
      ],
      correctAnswer: 1,
      explanation:
        "The word 'level' reads the same in both directions.",
    },
    {
      question: "What happens if the first mismatched pair of characters is found?",
      options: [
        "Continue checking",
        "Restart the algorithm",
        "Immediately conclude it is not a palindrome",
        "Reverse the string",
      ],
      correctAnswer: 2,
      explanation:
        "As soon as one mismatch is found, the string cannot be a palindrome.",
    },
    {
      question: "Which pointer starts at the beginning of the string?",
      options: [
        "Right Pointer",
        "Middle Pointer",
        "Left Pointer",
        "End Pointer",
      ],
      correctAnswer: 2,
      explanation:
        "The left pointer starts from index 0 and moves toward the center.",
    },
    {
      question: "Which pointer starts at the end of the string?",
      options: [
        "Left Pointer",
        "Middle Pointer",
        "Right Pointer",
        "Front Pointer",
      ],
      correctAnswer: 2,
      explanation:
        "The right pointer starts from the last character and moves toward the center.",
    },
    {
      question: "When does the palindrome checking process stop successfully?",
      options: [
        "After checking the first character",
        "When all corresponding characters match",
        "When half the string is skipped",
        "After reversing the string",
      ],
      correctAnswer: 1,
      explanation:
        "If every pair matches until the pointers cross, the string is a palindrome.",
    },
    {
      question: "Which of the following is NOT a palindrome?",
      options: [
        "madam",
        "racecar",
        "refer",
        "coding",
      ],
      correctAnswer: 3,
      explanation:
        "'coding' does not read the same backward.",
    },
  ];

  return (
    <QuizEngine
      title="Palindrome Check Quiz Challenge"
      questions={questions}
    />
  );
};

export default PalindromeCheckQuiz;