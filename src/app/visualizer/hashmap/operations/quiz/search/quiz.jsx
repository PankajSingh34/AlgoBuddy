"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Which method is used to retrieve a value from a HashMap in Java?",
    options: [
      "search()",
      "find()",
      "get()",
      "retrieve()"
    ],
    correctAnswer: 2,
    explanation:
      "The get() method returns the value associated with a specified key."
  },
  {
    question: "What does get() return if the specified key does not exist?",
    options: [
      "0",
      "false",
      "null",
      "Exception"
    ],
    correctAnswer: 2,
    explanation:
      "If the key is not found, get() returns null."
  },
  {
    question: "What is the average time complexity of the get() operation?",
    options: [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "HashMap provides average constant-time lookup using hashing."
  },
  {
    question: "Which method checks whether a specific key exists in a HashMap?",
    options: [
      "contains()",
      "containsKey()",
      "hasKey()",
      "exists()"
    ],
    correctAnswer: 1,
    explanation:
      "containsKey() returns true if the specified key exists."
  },
  {
    question: "Which method checks whether a specific value exists in a HashMap?",
    options: [
      "containsValue()",
      "hasValue()",
      "contains()",
      "findValue()"
    ],
    correctAnswer: 0,
    explanation:
      "containsValue() searches for a given value in the HashMap."
  },
  {
    question: "Which component determines the bucket to search during get()?",
    options: [
      "Sorting",
      "Hash Function",
      "Binary Search",
      "Recursion"
    ],
    correctAnswer: 1,
    explanation:
      "The hash function computes the bucket where the key should be located."
  },
  {
    question: "If multiple keys are stored in the same bucket, searching may require:",
    options: [
      "Traversing the bucket entries",
      "Sorting the entire map",
      "Deleting duplicate keys",
      "Heapify"
    ],
    correctAnswer: 0,
    explanation:
      "Collisions require searching through the entries within the bucket."
  },
  {
    question: "Which operation is faster on average in a HashMap?",
    options: [
      "Searching using get()",
      "Linear Search in an array",
      "Bubble Sort",
      "Depth-First Search"
    ],
    correctAnswer: 0,
    explanation:
      "HashMap lookups are generally O(1), making them faster than linear search."
  },
  {
    question: "What is the worst-case time complexity of get() if many collisions occur?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "In the worst case, many collisions can degrade lookup to O(n), though modern Java implementations often improve this using balanced trees."
  },
  {
    question: "HashMap searching is commonly used in:",
    options: [
      "Caching",
      "Database indexing",
      "Fast key-value retrieval",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "HashMaps are widely used wherever efficient key-based lookup is required."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Search (get) Quiz"
      questions={questions}
    />
  );
}