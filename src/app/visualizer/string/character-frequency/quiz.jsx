"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const CharacterFrequencyQuiz = () => {
  const questions = [
    {
      question: "What is the main purpose of the Character Frequency algorithm?",
      options: [
        "Sort characters",
        "Count occurrences of each character",
        "Reverse a string",
        "Remove duplicates"
      ],
      correctAnswer: 1,
      explanation:
        "Character Frequency counts how many times each character appears in a string.",
    },
    {
      question: "Which data structure is commonly used to store character frequencies?",
      options: [
        "Stack",
        "Queue",
        "HashMap / Dictionary",
        "Linked List"
      ],
      correctAnswer: 2,
      explanation:
        "A HashMap (Dictionary) stores each character as a key and its count as the value.",
    },
    {
      question: 'What is the frequency of "a" in the string "banana"?',
      options: ["2", "3", "4", "1"],
      correctAnswer: 1,
      explanation:
        "The string 'banana' contains 'a' three times.",
    },
    {
      question: "What is the time complexity of counting character frequencies?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "Each character is visited exactly once, giving O(n) time complexity.",
    },
    {
      question: "What is the auxiliary space complexity in the worst case?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "If every character is unique, the HashMap stores n entries.",
    },
    {
      question: "What happens when a character is encountered again?",
      options: [
        "Delete it",
        "Ignore it",
        "Increase its count",
        "Restart counting"
      ],
      correctAnswer: 2,
      explanation:
        "Its existing frequency is incremented by one.",
    },
    {
      question: "Which application commonly uses character frequency?",
      options: [
        "Text analysis",
        "Image editing",
        "Video rendering",
        "Networking"
      ],
      correctAnswer: 0,
      explanation:
        "Character frequency is heavily used in text analysis and NLP.",
    },
    {
      question: "Which algorithm also relies heavily on character frequencies?",
      options: [
        "Binary Search",
        "Huffman Coding",
        "Selection Sort",
        "DFS"
      ],
      correctAnswer: 1,
      explanation:
        "Huffman Coding builds its tree using character frequencies.",
    },
    {
      question: "If the input string is empty, the frequency map will be:",
      options: [
        "Null",
        "Empty",
        "Contain one element",
        "Cause an error"
      ],
      correctAnswer: 1,
      explanation:
        "No characters means the map remains empty.",
    },
    {
      question: "Character Frequency is mainly classified as which type of algorithm?",
      options: [
        "Searching",
        "Sorting",
        "Hashing",
        "Greedy"
      ],
      correctAnswer: 2,
      explanation:
        "The algorithm primarily uses hashing for constant-time updates.",
    },
    {
      question: "What is stored as the key in the HashMap?",
      options: [
        "Frequency",
        "Character",
        "Index",
        "String length"
      ],
      correctAnswer: 1,
      explanation:
        "Each character acts as the key in the HashMap.",
    },
    {
      question: "What is stored as the value in the HashMap?",
      options: [
        "Character",
        "ASCII Code",
        "Frequency Count",
        "Index"
      ],
      correctAnswer: 2,
      explanation:
        "The value stores how many times the character appears.",
    },
    {
      question: "Which of these problems can be solved using Character Frequency?",
      options: [
        "Anagram Detection",
        "Merge Sort",
        "Heap Construction",
        "Tree Traversal"
      ],
      correctAnswer: 0,
      explanation:
        "Anagram detection compares character frequencies of two strings.",
    },
    {
      question: "What is the frequency of 's' in 'mississippi'?",
      options: [
        "2",
        "3",
        "4",
        "5"
      ],
      correctAnswer: 2,
      explanation:
        "The letter 's' appears four times in 'mississippi'.",
    },
    {
      question: "Why is HashMap preferred for Character Frequency?",
      options: [
        "Fast insertion and lookup",
        "Consumes no memory",
        "Automatically sorts keys",
        "Works only for integers"
      ],
      correctAnswer: 0,
      explanation:
        "HashMap provides average O(1) insertion and lookup.",
    },
  ];

  return (
    <QuizEngine
      title="Character Frequency Quiz Challenge"
      questions={questions}
    />
  );
};

export default CharacterFrequencyQuiz;