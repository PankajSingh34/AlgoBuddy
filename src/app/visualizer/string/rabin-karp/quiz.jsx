"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of the Rabin-Karp algorithm?",
    options: [
      "Sorting arrays",
      "Searching for patterns in strings",
      "Compressing strings",
      "Encrypting text",
    ],
    answer: "Searching for patterns in strings",
    explanation:
      "Rabin-Karp is a string matching algorithm that efficiently searches for patterns using hashing.",
  },
  {
    question: "Which technique is the Rabin-Karp algorithm based on?",
    options: [
      "Dynamic Programming",
      "Rolling Hash",
      "Binary Search",
      "Greedy Algorithm",
    ],
    answer: "Rolling Hash",
    explanation:
      "Rabin-Karp uses a rolling hash function to efficiently compare substrings.",
  },
  {
    question: "What is compared first in the Rabin-Karp algorithm?",
    options: [
      "Characters",
      "Hash Values",
      "ASCII Values",
      "Indexes",
    ],
    answer: "Hash Values",
    explanation:
      "Hash values are compared first. Character-by-character comparison occurs only if the hashes match.",
  },
  {
    question: "Why is a rolling hash used?",
    options: [
      "To sort the pattern",
      "To avoid recomputing hash values from scratch",
      "To reduce memory usage",
      "To reverse strings",
    ],
    answer: "To avoid recomputing hash values from scratch",
    explanation:
      "Rolling hash updates the hash efficiently when the search window moves.",
  },
  {
    question: "What is the average-case time complexity of Rabin-Karp?",
    options: [
      "O(n²)",
      "O(n + m)",
      "O(log n)",
      "O(m²)",
    ],
    answer: "O(n + m)",
    explanation:
      "With a good hash function, Rabin-Karp performs in linear time on average.",
  },
  {
    question: "What is the worst-case time complexity of Rabin-Karp?",
    options: [
      "O(n + m)",
      "O(n × m)",
      "O(log n)",
      "O(m log n)",
    ],
    answer: "O(n × m)",
    explanation:
      "Hash collisions can force character-by-character comparisons, leading to O(n × m).",
  },
  {
    question: "Which issue can reduce the efficiency of Rabin-Karp?",
    options: [
      "Recursion",
      "Hash Collisions",
      "Stack Overflow",
      "Sorting",
    ],
    answer: "Hash Collisions",
    explanation:
      "Different strings may produce the same hash value, causing additional comparisons.",
  },
  {
    question: "What happens after two hash values match?",
    options: [
      "The algorithm stops",
      "The pattern is immediately accepted",
      "Characters are compared one by one",
      "The hash is discarded",
    ],
    answer: "Characters are compared one by one",
    explanation:
      "Hash equality is verified with a character-by-character comparison.",
  },
  {
    question: "Which of the following is NOT an application of Rabin-Karp?",
    options: [
      "Plagiarism Detection",
      "DNA Sequence Matching",
      "String Pattern Matching",
      "Binary Tree Traversal",
    ],
    answer: "Binary Tree Traversal",
    explanation:
      "Rabin-Karp is used for string matching, not tree traversal.",
  },
  {
    question: "Which data structure is essential in Rabin-Karp?",
    options: [
      "Queue",
      "Hash Function",
      "Heap",
      "Linked List",
    ],
    answer: "Hash Function",
    explanation:
      "The algorithm relies on hash functions to compare patterns efficiently.",
  },
  {
    question: "Rabin-Karp is especially useful when searching for:",
    options: [
      "One pattern only",
      "Multiple patterns",
      "Numbers",
      "Graphs",
    ],
    answer: "Multiple patterns",
    explanation:
      "The algorithm performs well when searching for multiple patterns using hashing.",
  },
  {
    question: "Which value is updated when the search window slides?",
    options: [
      "Pattern Length",
      "Rolling Hash",
      "Array Size",
      "Stack Pointer",
    ],
    answer: "Rolling Hash",
    explanation:
      "The rolling hash is updated efficiently without recalculating the entire hash.",
  },
  {
    question: "Which algorithm also solves the string matching problem using preprocessing instead of hashing?",
    options: [
      "Merge Sort",
      "KMP Algorithm",
      "Heap Sort",
      "Quick Sort",
    ],
    answer: "KMP Algorithm",
    explanation:
      "KMP preprocesses the pattern using the LPS array instead of hashing.",
  },
  {
    question: "Which complexity best describes the space usage of Rabin-Karp?",
    options: [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n²)",
    ],
    answer: "O(1)",
    explanation:
      "Only a few variables are required besides the input strings.",
  },
  {
    question: "Which statement about Rabin-Karp is correct?",
    options: [
      "It always compares every character.",
      "It uses hashing to reduce comparisons.",
      "It only works for sorted strings.",
      "It cannot handle long texts.",
    ],
    answer: "It uses hashing to reduce comparisons.",
    explanation:
      "Hashing allows Rabin-Karp to avoid unnecessary character comparisons.",
  },
];

export default function RabinKarpQuiz() {
  return (
    <QuizEngine
      title="Rabin-Karp Algorithm Quiz"
      subtitle="Test your understanding of the Rabin-Karp string matching algorithm."
      questions={questions}
    />
  );
}