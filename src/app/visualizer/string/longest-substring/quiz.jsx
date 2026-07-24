"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Which algorithmic technique is used to solve the Longest Substring Without Repeating Characters problem efficiently?",
    options: [
      "Sliding Window",
      "Dynamic Programming",
      "Binary Search",
      "Greedy",
    ],
    answer: "Sliding Window",
    explanation:
      "The Sliding Window technique maintains a window of unique characters while scanning the string.",
  },
  {
    question: "What is the optimal time complexity of the Sliding Window solution?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
    answer: "O(n)",
    explanation:
      "Each character is visited at most twice by the left and right pointers.",
  },
  {
    question: "Which data structure is commonly used to store the last occurrence of characters?",
    options: ["Hash Map", "Queue", "Stack", "Linked List"],
    answer: "Hash Map",
    explanation:
      "A Hash Map provides O(1) average lookup time for character indices.",
  },
  {
    question: "What happens when a duplicate character is encountered?",
    options: [
      "Move the left pointer after the previous occurrence",
      "Restart the algorithm",
      "Ignore the duplicate",
      "Sort the string",
    ],
    answer: "Move the left pointer after the previous occurrence",
    explanation:
      "The left pointer is updated to keep all characters in the window unique.",
  },
  {
    question: "Which pointer expands the current window?",
    options: [
      "Right Pointer",
      "Left Pointer",
      "Middle Pointer",
      "None",
    ],
    answer: "Right Pointer",
    explanation:
      "The right pointer keeps moving forward to include new characters.",
  },
  {
    question: "Which pointer shrinks the current window?",
    options: [
      "Left Pointer",
      "Right Pointer",
      "Middle Pointer",
      "Last Pointer",
    ],
    answer: "Left Pointer",
    explanation:
      "The left pointer removes characters from the beginning of the window.",
  },
  {
    question: "For the input 'abcabcbb', what is the answer?",
    options: ["3", "2", "4", "5"],
    answer: "3",
    explanation:
      "The longest substring without repeating characters is 'abc'.",
  },
  {
    question: "For the input 'bbbbb', what is the answer?",
    options: ["1", "2", "5", "0"],
    answer: "1",
    explanation:
      "Only one unique character can exist in the substring.",
  },
  {
    question: "For the input 'pwwkew', what is the answer?",
    options: ["3", "2", "4", "5"],
    answer: "3",
    explanation:
      "The longest substring is 'wke'.",
  },
  {
    question: "What is the space complexity of the optimal solution?",
    options: ["O(min(n, charset))", "O(n²)", "O(log n)", "O(1)"],
    answer: "O(min(n, charset))",
    explanation:
      "The Hash Map stores only unique characters currently tracked.",
  },
  {
    question: "Why is a Hash Map preferred?",
    options: [
      "Provides O(1) average lookup",
      "Consumes zero memory",
      "Automatically sorts characters",
      "Uses recursion",
    ],
    answer: "Provides O(1) average lookup",
    explanation:
      "Fast lookup allows efficient Sliding Window implementation.",
  },
  {
    question: "If the current character has never appeared before, what should happen?",
    options: [
      "Expand the window",
      "Shrink the window",
      "Restart",
      "Remove previous characters",
    ],
    answer: "Expand the window",
    explanation:
      "The window continues growing while characters remain unique.",
  },
  {
    question: "Which topic does this problem commonly belong to in coding interviews?",
    options: [
      "Sliding Window",
      "Graphs",
      "Trees",
      "Dynamic Programming",
    ],
    answer: "Sliding Window",
    explanation:
      "It is one of the most common Sliding Window interview questions.",
  },
  {
    question: "What is the main goal of the algorithm?",
    options: [
      "Find the longest substring without repeating characters",
      "Sort the string",
      "Reverse the string",
      "Count vowels",
    ],
    answer: "Find the longest substring without repeating characters",
    explanation:
      "The objective is to maximize the length while maintaining unique characters.",
  },
  {
    question: "What does the algorithm update whenever a longer valid substring is found?",
    options: [
      "Maximum length",
      "Minimum length",
      "Hash Map size",
      "String order",
    ],
    answer: "Maximum length",
    explanation:
      "The maximum length variable stores the best answer found so far.",
  },
];

export default function LongestSubstringQuiz() {
  return (
    <QuizEngine
      title="Longest Substring Without Repeating Characters Quiz"
      subtitle="Test your understanding of the Sliding Window technique used to solve the Longest Substring Without Repeating Characters problem."
      questions={questions}
    />
  );
}