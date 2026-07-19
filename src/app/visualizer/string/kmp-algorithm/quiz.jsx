"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What does KMP stand for?",
    options: [
      "Knuth-Morris-Pratt",
      "Kernel Matching Process",
      "Known Matching Procedure",
      "Key Matching Pattern",
    ],
    answer: "Knuth-Morris-Pratt",
    explanation:
      "KMP stands for Knuth-Morris-Pratt, an efficient string pattern matching algorithm.",
  },
  {
    question: "What is the primary purpose of the KMP algorithm?",
    options: [
      "Sorting arrays",
      "Searching for a pattern in a text",
      "Compressing strings",
      "Finding duplicate characters",
    ],
    answer: "Searching for a pattern in a text",
    explanation:
      "KMP efficiently searches for occurrences of a pattern within a text.",
  },
  {
    question: "Which data structure does KMP preprocess?",
    options: [
      "Text",
      "Pattern",
      "Hash Table",
      "Queue",
    ],
    answer: "Pattern",
    explanation:
      "The pattern is preprocessed to create the LPS array.",
  },
  {
    question: "What does LPS stand for?",
    options: [
      "Longest Prefix Suffix",
      "Longest Proper Sequence",
      "Linear Pattern Search",
      "Longest Pattern String",
    ],
    answer: "Longest Prefix Suffix",
    explanation:
      "LPS stores the length of the longest proper prefix which is also a suffix.",
  },
  {
    question: "What is the worst-case time complexity of KMP?",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(n + m)",
      "O(log n)",
    ],
    answer: "O(n + m)",
    explanation:
      "KMP preprocesses the pattern in O(m) and searches the text in O(n).",
  },
    {
    question: "Which array helps KMP skip unnecessary comparisons?",
    options: [
      "Prefix Array",
      "LPS Array",
      "Suffix Array",
      "Hash Array",
    ],
    answer: "LPS Array",
    explanation:
      "The LPS array stores the longest proper prefix that is also a suffix, allowing KMP to avoid redundant comparisons.",
  },
  {
    question: "What is the space complexity of the KMP algorithm?",
    options: [
      "O(1)",
      "O(log n)",
      "O(m)",
      "O(n)",
    ],
    answer: "O(m)",
    explanation:
      "The LPS array requires extra space proportional to the pattern length.",
  },
  {
    question: "Which of the following algorithms is generally slower than KMP for repeated pattern searching?",
    options: [
      "Naive String Matching",
      "Binary Search",
      "Merge Sort",
      "Heap Sort",
    ],
    answer: "Naive String Matching",
    explanation:
      "The naive algorithm may repeatedly compare the same characters, unlike KMP.",
  },
  {
    question: "When is the LPS array computed?",
    options: [
      "After searching the text",
      "Before searching begins",
      "Only after a mismatch",
      "At the end of the algorithm",
    ],
    answer: "Before searching begins",
    explanation:
      "KMP preprocesses the pattern and builds the LPS array before scanning the text.",
  },
  {
    question: "Which statement about the KMP algorithm is true?",
    options: [
      "It never preprocesses the pattern",
      "It preprocesses the pattern using the LPS array",
      "It only works on sorted strings",
      "It uses recursion for searching",
    ],
    answer: "It preprocesses the pattern using the LPS array",
    explanation:
      "Pattern preprocessing is the key optimization that makes KMP efficient.",
  },
    {
    question: "What happens when a mismatch occurs after some characters have matched?",
    options: [
      "The search restarts from the beginning",
      "The pattern index is updated using the LPS array",
      "The text index is reset",
      "The algorithm stops",
    ],
    answer: "The pattern index is updated using the LPS array",
    explanation:
      "KMP uses the LPS array to continue matching without rechecking previously matched characters.",
  },
  {
    question: "Which type of applications commonly use the KMP algorithm?",
    options: [
      "Text Editors",
      "Search Engines",
      "DNA Sequence Matching",
      "All of the above",
    ],
    answer: "All of the above",
    explanation:
      "KMP is widely used in text processing, bioinformatics, and search systems.",
  },
  {
    question: "Which component of KMP allows it to achieve linear time complexity?",
    options: [
      "Hash Table",
      "Queue",
      "LPS Array",
      "Stack",
    ],
    answer: "LPS Array",
    explanation:
      "The LPS array prevents redundant comparisons, making the search linear.",
  },
  {
    question: "Which algorithm is considered an improvement over the Naive String Matching algorithm?",
    options: [
      "Bubble Sort",
      "KMP Algorithm",
      "Insertion Sort",
      "Selection Sort",
    ],
    answer: "KMP Algorithm",
    explanation:
      "KMP improves efficiency by preprocessing the pattern and skipping unnecessary comparisons.",
  },
  {
    question: "Why is the KMP algorithm preferred for large text searching?",
    options: [
      "It uses recursion",
      "It has linear time complexity",
      "It requires no extra memory",
      "It works only for short strings",
    ],
    answer: "It has linear time complexity",
    explanation:
      "KMP runs in O(n + m), making it highly efficient for searching large texts.",
  },
];

export default function KMPAlgorithmQuiz() {
  return (
    <QuizEngine
      title="KMP Algorithm Quiz"
      subtitle="Test your understanding of the Knuth-Morris-Pratt (KMP) string matching algorithm."
      questions={questions}
    />
  );
}