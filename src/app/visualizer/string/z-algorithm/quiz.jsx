"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of the Z Algorithm?",
    options: [
      "Sorting arrays",
      "Pattern matching in strings",
      "Compressing files",
      "Encrypting data",
    ],
    answer: "Pattern matching in strings",
    explanation:
      "The Z Algorithm is used for efficient pattern matching by computing the Z-array.",
  },
  {
    question: "What does the Z-array represent?",
    options: [
      "Character frequencies",
      "Longest substring matching the prefix",
      "ASCII values",
      "Hash values",
    ],
    answer: "Longest substring matching the prefix",
    explanation:
      "Each Z[i] stores the length of the longest substring starting at index i that matches the prefix of the string.",
  },
  {
    question: "What is the time complexity of the Z Algorithm?",
    options: [
      "O(n²)",
      "O(n)",
      "O(log n)",
      "O(n log n)",
    ],
    answer: "O(n)",
    explanation:
      "The Z-array is computed in linear time, making the Z Algorithm very efficient.",
  },
  {
    question: "Which two pointers are maintained while computing the Z-array?",
    options: [
      "Top and Bottom",
      "Left and Right",
      "Front and Rear",
      "Start and End",
    ],
    answer: "Left and Right",
    explanation:
      "The algorithm maintains Left (L) and Right (R) pointers to represent the current Z-box.",
  },
  {
    question: "What is a Z-box?",
    options: [
      "A sorting window",
      "A substring matching the prefix",
      "A binary tree node",
      "A hash table",
    ],
    answer: "A substring matching the prefix",
    explanation:
      "The Z-box represents the interval where the substring matches the prefix of the string.",
  },
  {
    question: "Which string is typically created before computing the Z-array for pattern matching?",
    options: [
      "Text + Pattern",
      "Pattern + '$' + Text",
      "Pattern + Pattern",
      "Text + Text",
    ],
    answer: "Pattern + '$' + Text",
    explanation:
      "A separator ('$') prevents unwanted matches between the pattern and text.",
  },
  {
    question: "When is a pattern found using the Z Algorithm?",
    options: [
      "When Z[i] = 0",
      "When Z[i] equals the pattern length",
      "When Z[i] = i",
      "When Z[i] is negative",
    ],
    answer: "When Z[i] equals the pattern length",
    explanation:
      "A Z-value equal to the pattern length indicates a complete pattern match.",
  },
  {
    question: "Which of the following best describes the Z Algorithm?",
    options: [
      "A graph traversal algorithm",
      "A linear-time string matching algorithm",
      "A sorting algorithm",
      "A shortest path algorithm",
    ],
    answer: "A linear-time string matching algorithm",
    explanation:
      "The Z Algorithm efficiently performs exact pattern matching in linear time.",
  },
  {
    question: "Which of these is an application of the Z Algorithm?",
    options: [
      "Binary Tree Traversal",
      "Pattern Searching",
      "Heap Construction",
      "Graph Coloring",
    ],
    answer: "Pattern Searching",
    explanation:
      "The Z Algorithm is widely used for searching patterns within strings.",
  },
  {
    question: "What is the worst-case time complexity of the Z Algorithm?",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(n)",
      "O(log n)",
    ],
    answer: "O(n)",
    explanation:
      "The Z Algorithm guarantees linear-time performance even in the worst case.",
  },
  {
    question: "How much extra space does the Z Algorithm require?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)",
    ],
    answer: "O(n)",
    explanation:
      "The algorithm stores one Z-array of size equal to the input string.",
  },
  {
    question: "Which algorithm also performs linear-time pattern matching?",
    options: [
      "Merge Sort",
      "KMP Algorithm",
      "Quick Sort",
      "Selection Sort",
    ],
    answer: "KMP Algorithm",
    explanation:
      "Both KMP and the Z Algorithm solve the string matching problem in linear time.",
  },
  {
    question: "Why does the Z Algorithm reuse previous computations?",
    options: [
      "To reduce memory usage",
      "To avoid repeated character comparisons",
      "To sort faster",
      "To increase recursion depth",
    ],
    answer: "To avoid repeated character comparisons",
    explanation:
      "Previously computed Z-values are reused to achieve O(n) complexity.",
  },
  {
    question: "Which of the following is NOT an application of the Z Algorithm?",
    options: [
      "DNA Sequence Analysis",
      "Plagiarism Detection",
      "Text Searching",
      "Binary Search Tree Balancing",
    ],
    answer: "Binary Search Tree Balancing",
    explanation:
      "The Z Algorithm is designed for string processing, not tree balancing.",
  },
  {
    question: "Which statement about the Z Algorithm is correct?",
    options: [
      "It only works on sorted strings.",
      "It uses the Z-array for efficient pattern matching.",
      "It requires hashing.",
      "It is slower than brute-force search.",
    ],
    answer: "It uses the Z-array for efficient pattern matching.",
    explanation:
      "The Z Algorithm relies on the Z-array to efficiently identify pattern matches in linear time.",
  },
];

export default function ZAlgorithmQuiz() {
  return (
    <QuizEngine
      title="Z Algorithm Quiz"
      subtitle="Test your understanding of the Z Algorithm and Z-array construction."
      questions={questions}
    />
  );
}