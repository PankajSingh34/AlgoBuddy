"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const AnagramCheckQuiz = () => {
  const questions = [
    {
      question: "What is an anagram?",
      options: [
        "A string written backwards",
        "Two strings containing the same characters in different order",
        "A palindrome",
        "A sorted string",
      ],
      correctAnswer: 1,
      explanation:
        "Anagrams contain the same characters with the same frequencies but in a different order.",
    },
    {
      question: 'Which of these is an anagram of "listen"?',
      options: ["silent", "list", "listened", "stone"],
      correctAnswer: 0,
      explanation:
        '"listen" and "silent" contain exactly the same letters.',
    },
    {
      question: "What is the first thing to check before comparing two strings?",
      options: [
        "Sort them",
        "Reverse them",
        "Compare their lengths",
        "Convert to uppercase",
      ],
      correctAnswer: 2,
      explanation:
        "If the lengths differ, the strings cannot be anagrams.",
    },
    {
      question: "Which data structure is commonly used for an O(n) anagram solution?",
      options: [
        "Queue",
        "Stack",
        "HashMap",
        "Linked List",
      ],
      correctAnswer: 2,
      explanation:
        "A HashMap stores the frequency of each character.",
    },
    {
      question: "Which algorithm can also solve the anagram problem?",
      options: [
        "Sorting",
        "DFS",
        "Binary Search",
        "Heapify",
      ],
      correctAnswer: 0,
      explanation:
        "Sorting both strings and comparing them is a common solution.",
    },
    {
      question: "What is the time complexity of the sorting approach?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n log n)",
      ],
      correctAnswer: 3,
      explanation:
        "Sorting dominates the running time.",
    },
    {
      question: "What is the time complexity of the HashMap approach?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n²)",
        "O(1)",
      ],
      correctAnswer: 0,
      explanation:
        "Each character is processed once.",
    },
    {
      question: "Are 'evil' and 'vile' anagrams?",
      options: [
        "Yes",
        "No",
        "Only after sorting",
        "Cannot determine",
      ],
      correctAnswer: 0,
      explanation:
        "Both words contain the same characters.",
    },
    {
      question: "Which pair is NOT an anagram?",
      options: [
        "dusty & study",
        "night & thing",
        "apple & paple",
        "hello & world",
      ],
      correctAnswer: 3,
      explanation:
        "'hello' and 'world' have different character sets.",
    },
    {
      question: "Ignoring spaces and capitalization is useful because:",
      options: [
        "It makes comparison fair",
        "It speeds up sorting",
        "It changes the algorithm",
        "It reduces memory",
      ],
      correctAnswer: 0,
      explanation:
        "Normalization allows equivalent strings to be compared correctly.",
    },
    {
      question: "Which application commonly uses anagram checking?",
      options: [
        "Spell checking",
        "Word games",
        "Text processing",
        "All of the above",
      ],
      correctAnswer: 3,
      explanation:
        "Anagram checking is useful in all of these applications.",
    },
    {
      question: "Which of these strings is an anagram of 'race'?",
      options: [
        "care",
        "acerx",
        "racee",
        "trace",
      ],
      correctAnswer: 0,
      explanation:
        "'care' contains exactly the same letters.",
    },
    {
      question: "If two strings have different lengths, they are:",
      options: [
        "Always anagrams",
        "Never anagrams",
        "Maybe anagrams",
        "Need sorting first",
      ],
      correctAnswer: 1,
      explanation:
        "Different lengths immediately rule out anagrams.",
    },
    {
      question: "Which approach generally uses less extra memory?",
      options: [
        "Sorting",
        "HashMap",
        "Both always use O(n)",
        "Neither",
      ],
      correctAnswer: 0,
      explanation:
        "Sorting can be done in-place depending on the implementation.",
    },
    {
      question: "Which statement about anagrams is true?",
      options: [
        "Character order must match",
        "Character frequencies must match",
        "String lengths may differ",
        "Sorting is mandatory",
      ],
      correctAnswer: 1,
      explanation:
        "The defining property of anagrams is identical character frequencies.",
    },
  ];

  return (
    <QuizEngine
      title="Anagram Check Quiz Challenge"
      questions={questions}
    />
  );
};

export default AnagramCheckQuiz;