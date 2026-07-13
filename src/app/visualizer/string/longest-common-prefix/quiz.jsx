"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const LongestCommonPrefixQuiz = () => {
  const questions = [
    {
      question: "What is the Longest Common Prefix (LCP)?",
      options: [
        "The longest suffix shared by all strings",
        "The longest prefix shared by all strings",
        "The shortest common substring",
        "The longest palindrome",
      ],
      correctAnswer: 1,
      explanation:
        "The Longest Common Prefix is the longest prefix that every string shares.",
    },
    {
      question: 'What is the LCP of ["flower", "flow", "flight"]?',
      options: ["flo", "flow", "fl", "f"],
      correctAnswer: 2,
      explanation:
        '"fl" is the longest prefix common to all three strings.',
    },
    {
      question: 'What is the output for ["dog", "racecar", "car"]?',
      options: ["d", "do", "", "car"],
      correctAnswer: 2,
      explanation:
        "There is no common prefix among the strings.",
    },
    {
      question: "Which string is usually selected first as the initial prefix?",
      options: [
        "The shortest string",
        "The longest string",
        "The first string",
        "The last string",
      ],
      correctAnswer: 2,
      explanation:
        "The first string is commonly used as the initial prefix.",
    },
    {
      question: "If a string does not start with the current prefix, what should happen?",
      options: [
        "Reverse the string",
        "Remove the last character from the prefix",
        "Sort the string",
        "Skip the string",
      ],
      correctAnswer: 1,
      explanation:
        "The prefix is shortened until it matches.",
    },
    {
      question: "What is the worst-case time complexity of the horizontal scanning approach?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n × m)",
        "O(n²)",
      ],
      correctAnswer: 2,
      explanation:
        "Each character of each string may be compared once.",
    },
    {
      question: "What does n represent in O(n × m)?",
      options: [
        "Length of the prefix",
        "Number of strings",
        "ASCII value",
        "Number of characters removed",
      ],
      correctAnswer: 1,
      explanation:
        "n is the number of strings.",
    },
    {
      question: "What does m represent in O(n × m)?",
      options: [
        "Maximum string length",
        "Number of words",
        "Memory used",
        "Prefix count",
      ],
      correctAnswer: 0,
      explanation:
        "m is the maximum length of a string.",
    },
    {
      question: "Which data structure is required for the basic LCP algorithm?",
      options: [
        "Stack",
        "Queue",
        "HashMap",
        "None",
      ],
      correctAnswer: 3,
      explanation:
        "The basic approach only compares strings directly.",
    },
    {
      question: "Which application commonly uses Longest Common Prefix?",
      options: [
        "Autocomplete",
        "Spell Checker",
        "Search Suggestions",
        "All of the above",
      ],
      correctAnswer: 3,
      explanation:
        "LCP is useful in autocomplete, search engines, and text processing.",
    },
    {
      question: "If only one string is provided, what is the LCP?",
      options: [
        "Empty string",
        "First character",
        "The string itself",
        "Undefined",
      ],
      correctAnswer: 2,
      explanation:
        "A single string is its own longest common prefix.",
    },
    {
      question: "Which algorithmic technique is commonly used in this solution?",
      options: [
        "Greedy",
        "Dynamic Programming",
        "Backtracking",
        "Divide and Conquer",
      ],
      correctAnswer: 0,
      explanation:
        "The prefix is greedily reduced until it matches all strings.",
    },
    {
      question: "When does the algorithm stop reducing the prefix?",
      options: [
        "When it becomes empty",
        "When every string starts with it",
        "Both A and B",
        "Never",
      ],
      correctAnswer: 2,
      explanation:
        "It stops if the prefix matches all strings or becomes empty.",
    },
    {
      question: "Which of the following has LCP = 'inter'?",
      options: [
        '["internet","internal","interval"]',
        '["apple","ape","april"]',
        '["dog","door","cat"]',
        '["sun","moon","star"]',
      ],
      correctAnswer: 0,
      explanation:
        "All three strings begin with 'inter'.",
    },
    {
      question: "What is the space complexity of the basic LCP algorithm?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)",
      ],
      correctAnswer: 0,
      explanation:
        "Only a prefix variable is maintained, requiring constant extra space.",
    },
  ];

  return (
    <QuizEngine
      title="Longest Common Prefix Quiz Challenge"
      questions={questions}
    />
  );
};

export default LongestCommonPrefixQuiz;