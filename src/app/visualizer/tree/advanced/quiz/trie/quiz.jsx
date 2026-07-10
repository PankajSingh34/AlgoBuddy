"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of a Trie data structure?",
    options: [
      "Sorting numbers",
      "Efficient string storage and searching",
      "Balancing binary trees",
      "Graph traversal"
    ],
    correctAnswer: 1,
    explanation: "A Trie is designed for fast storage, searching, and retrieval of strings."
  },
  {
    question: "What does each node in a Trie typically represent?",
    options: [
      "A complete word",
      "A single character",
      "An integer value",
      "A subtree"
    ],
    correctAnswer: 1,
    explanation: "Each Trie node stores one character of a word."
  },
  {
    question: "Which operation is especially efficient in a Trie?",
    options: [
      "Matrix multiplication",
      "Prefix searching",
      "Heap sort",
      "Graph coloring"
    ],
    correctAnswer: 1,
    explanation: "Tries are ideal for prefix-based searching."
  },
  {
    question: "What is the average time complexity for searching a word of length m in a Trie?",
    options: [
      "O(n)",
      "O(log n)",
      "O(m)",
      "O(n log n)"
    ],
    correctAnswer: 2,
    explanation: "Searching depends only on the number of characters in the word."
  },
  {
    question: "Which application commonly uses a Trie?",
    options: [
      "Autocomplete suggestions",
      "Sorting arrays",
      "Finding shortest paths",
      "Binary searching"
    ],
    correctAnswer: 0,
    explanation: "Autocomplete systems rely on Trie prefix matching."
  },
  {
    question: "Which flag is commonly stored in Trie nodes?",
    options: [
      "visited",
      "isEndOfWord",
      "balanced",
      "height"
    ],
    correctAnswer: 1,
    explanation: "The isEndOfWord flag indicates whether a node marks the end of a valid word."
  },
  {
    question: "Compared to Hash Tables, what is a major advantage of Tries?",
    options: [
      "Better prefix searching",
      "Lower memory usage",
      "Always faster insertion",
      "No pointers are required"
    ],
    correctAnswer: 0,
    explanation: "Tries naturally support efficient prefix-based operations."
  },
  {
    question: "What is the time complexity of inserting a word of length m into a Trie?",
    options: [
      "O(log m)",
      "O(m)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Insertion processes one character at a time."
  },
  {
    question: "A Trie is also commonly known as:",
    options: [
      "Prefix Tree",
      "AVL Tree",
      "Heap Tree",
      "Segment Tree"
    ],
    correctAnswer: 0,
    explanation: "Trie is also called a Prefix Tree."
  },
  {
    question: "Which type of data is best suited for storage in a Trie?",
    options: [
      "Integers",
      "Floating-point values",
      "Strings",
      "Matrices"
    ],
    correctAnswer: 2,
    explanation: "Tries are specifically designed for storing and searching strings efficiently."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Trie Quiz"
      questions={questions}
    />
  );
}