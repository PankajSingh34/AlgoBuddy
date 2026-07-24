"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary goal of the Minimum Window Substring problem?",
    options: [
      "Find the longest substring",
      "Find the smallest substring containing all characters of the target",
      "Sort the string",
      "Reverse the string",
    ],
    answer: "Find the smallest substring containing all characters of the target",
    explanation:
      "The objective is to locate the shortest substring that contains every character from the target string, including duplicates.",
  },
  {
    question: "Which algorithmic technique is used to solve this problem efficiently?",
    options: [
      "Dynamic Programming",
      "Sliding Window",
      "Greedy",
      "Binary Search",
    ],
    answer: "Sliding Window",
    explanation:
      "The Sliding Window technique expands and contracts the window while maintaining character frequencies.",
  },
  {
    question: "What is the optimal time complexity of the Sliding Window solution?",
    options: ["O(n²)", "O(n log n)", "O(n + m)", "O(m²)"],
    answer: "O(n + m)",
    explanation:
      "Each pointer moves at most once through the string, resulting in linear complexity.",
  },
  {
    question: "What data structure is commonly used to store required character frequencies?",
    options: ["Stack", "Queue", "Hash Map", "Heap"],
    answer: "Hash Map",
    explanation:
      "A Hash Map stores the frequency of each required character efficiently.",
  },
  {
    question: "What does the 'left' pointer represent?",
    options: [
      "Beginning of the current window",
      "End of the window",
      "Pattern length",
      "Answer index",
    ],
    answer: "Beginning of the current window",
    explanation:
      "The left pointer marks the starting position of the current sliding window.",
  },
  {
    question: "What does the 'right' pointer do?",
    options: [
      "Shrinks the window",
      "Expands the window",
      "Stores frequencies",
      "Sorts characters",
    ],
    answer: "Expands the window",
    explanation:
      "The right pointer continuously expands the window until it becomes valid.",
  },
  {
    question: "When is the current window considered valid?",
    options: [
      "When all characters of the target are present with required frequency",
      "When it has unique characters",
      "When window length equals target length",
      "When characters are sorted",
    ],
    answer: "When all characters of the target are present with required frequency",
    explanation:
      "A valid window contains every required character with at least the required count.",
  },
  {
    question: "Why do we shrink the window from the left?",
    options: [
      "To reduce memory",
      "To find a smaller valid window",
      "To sort characters",
      "To remove duplicates",
    ],
    answer: "To find a smaller valid window",
    explanation:
      "Shrinking helps minimize the window while keeping it valid.",
  },
  {
    question: "If no valid window exists, what should the algorithm return?",
    options: ["null", "-1", '""', "0"],
    answer: '""',
    explanation:
      "If no substring satisfies the condition, an empty string is returned.",
  },
  {
    question: "Which example produces 'BANC' as the answer?",
    options: [
      's="ADOBECODEBANC", t="ABC"',
      's="HELLO", t="LL"',
      's="ABCDE", t="AE"',
      's="XYZ", t="Z"',
    ],
    answer: 's="ADOBECODEBANC", t="ABC"',
    explanation:
      "'BANC' is the smallest substring containing A, B, and C.",
  },
  {
    question: "What happens when the right pointer moves?",
    options: [
      "Characters are removed",
      "A new character enters the window",
      "The answer is finalized",
      "The string is reversed",
    ],
    answer: "A new character enters the window",
    explanation:
      "Moving the right pointer expands the window by including another character.",
  },
  {
    question: "Why are duplicate characters in the target important?",
    options: [
      "They are ignored",
      "Their frequency must also be satisfied",
      "They reduce complexity",
      "They are removed",
    ],
    answer: "Their frequency must also be satisfied",
    explanation:
      "The algorithm must satisfy the exact frequency requirements of every character.",
  },
  {
    question: "What is the space complexity of the optimal solution?",
    options: ["O(1)", "O(log n)", "O(m)", "O(n²)"],
    answer: "O(m)",
    explanation:
      "The hash maps store only the required characters and their frequencies.",
  },
  {
    question: "Which interview topic commonly includes this problem?",
    options: [
      "Graph Algorithms",
      "Sliding Window",
      "Tree Traversal",
      "Backtracking",
    ],
    answer: "Sliding Window",
    explanation:
      "Minimum Window Substring is one of the most popular Sliding Window interview questions.",
  },
  {
    question: "Which pointer is moved after removing a character from the current window?",
    options: ["Right Pointer", "Left Pointer", "Middle Pointer", "Random Pointer"],
    answer: "Left Pointer",
    explanation:
      "After removing the leftmost character, the left pointer advances to shrink the window.",
  },
];

export default function MinimumWindowSubstringQuiz() {
  return (
    <QuizEngine
      title="Minimum Window Substring Quiz"
      subtitle="Test your understanding of the Sliding Window algorithm used to solve the Minimum Window Substring problem."
      questions={questions}
    />
  );
}