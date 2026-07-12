"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const ReverseStringQuiz = () => {
  const questions = [
    {
      question: "What is the primary goal of the Reverse String algorithm?",
      options: [
        "Sort the characters",
        "Reverse the order of characters",
        "Remove duplicate characters",
        "Convert lowercase to uppercase"
      ],
      correctAnswer: 1,
      explanation:
        "The Reverse String algorithm reverses the order of characters in a string."
    },
    {
      question: "Which approach is commonly used to reverse a string in-place?",
      options: [
        "Sliding Window",
        "Two Pointers",
        "Binary Search",
        "Breadth First Search"
      ],
      correctAnswer: 1,
      explanation:
        "The two-pointer approach swaps characters from both ends until the pointers meet."
    },
    {
      question: "What is the time complexity of the two-pointer reverse string algorithm?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "Each character is visited at most once, giving O(n) time complexity."
    },
    {
      question: "What is the space complexity of the in-place reverse string algorithm?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation:
        "Only a few variables are used, so the extra space required is O(1)."
    },
    {
      question: "For the string 'HELLO', what is the reversed output?",
      options: [
        "OLLEH",
        "HELLO",
        "HLEOL",
        "LOLEH"
      ],
      correctAnswer: 0,
      explanation:
        "The reverse of HELLO is OLLEH."
    },
    {
      question: "When does the reverse string algorithm stop?",
      options: [
        "When left pointer reaches the last character",
        "When left pointer becomes greater than or equal to right pointer",
        "After one swap",
        "When the string becomes sorted"
      ],
      correctAnswer: 1,
      explanation:
        "The algorithm terminates when both pointers meet or cross."
    },
    {
      question: "Which characters are swapped first in the string 'ABCDE'?",
      options: [
        "A and B",
        "B and D",
        "A and E",
        "C and D"
      ],
      correctAnswer: 2,
      explanation:
        "The first swap occurs between the first and last characters."
    },
    {
      question: "Which pointer moves forward during the algorithm?",
      options: [
        "Left Pointer",
        "Right Pointer",
        "Both move backward",
        "Neither pointer moves"
      ],
      correctAnswer: 0,
      explanation:
        "The left pointer increments after every swap."
    },
    {
      question: "Which pointer moves backward during the algorithm?",
      options: [
        "Left Pointer",
        "Middle Pointer",
        "Right Pointer",
        "All pointers"
      ],
      correctAnswer: 2,
      explanation:
        "The right pointer decrements after every swap."
    },
    {
      question: "Which of the following strings is a palindrome?",
      options: [
        "HELLO",
        "LEVEL",
        "WORLD",
        "STRING"
      ],
      correctAnswer: 1,
      explanation:
        "LEVEL reads the same forward and backward."
    },
    {
      question: "How many swaps are required to reverse a string of length 6?",
      options: [
        "2",
        "3",
        "5",
        "6"
      ],
      correctAnswer: 1,
      explanation:
        "Only n/2 swaps are needed, so 6/2 = 3."
    },
    {
      question: "How many swaps are required to reverse a string of length 7?",
      options: [
        "3",
        "4",
        "5",
        "7"
      ],
      correctAnswer: 0,
      explanation:
        "⌊7/2⌋ = 3 swaps."
    },
    {
      question: "Which data structure stores the characters during in-place reversal?",
      options: [
        "Queue",
        "Stack",
        "Character Array",
        "Graph"
      ],
      correctAnswer: 2,
      explanation:
        "The string is typically converted to a character array so characters can be swapped."
    },
    {
      question: "Why is the two-pointer approach efficient?",
      options: [
        "It sorts the string",
        "It visits each character only once",
        "It uses recursion",
        "It creates multiple copies"
      ],
      correctAnswer: 1,
      explanation:
        "Each character participates in at most one swap."
    },
    {
      question: "Which interview problem commonly uses Reverse String as a foundation?",
      options: [
        "Palindrome Check",
        "Heap Sort",
        "Binary Search",
        "Dijkstra Algorithm"
      ],
      correctAnswer: 0,
      explanation:
        "Palindrome checking also uses the two-pointer technique."
    }
  ];

  return (
    <QuizEngine
      title="Reverse String Quiz Challenge"
      questions={questions}
    />
  );
};

export default ReverseStringQuiz;