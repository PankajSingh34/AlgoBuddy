"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Which method is used to insert a key-value pair into a HashMap in Java?",
    options: [
      "add()",
      "insert()",
      "put()",
      "set()"
    ],
    correctAnswer: 2,
    explanation:
      "The put() method inserts or updates a key-value pair in a HashMap."
  },
  {
    question: "What happens if put() is called with an existing key?",
    options: [
      "An exception is thrown",
      "A duplicate key is created",
      "The old value is replaced",
      "Nothing happens"
    ],
    correctAnswer: 2,
    explanation:
      "If the key already exists, put() replaces the previous value with the new one."
  },
  {
    question: "Can a HashMap contain duplicate keys?",
    options: [
      "Yes",
      "No",
      "Only integers",
      "Only strings"
    ],
    correctAnswer: 1,
    explanation:
      "HashMap allows only unique keys, although values may be duplicated."
  },
  {
    question: "What is the average time complexity of the put() operation?",
    options: [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "The average-case complexity of put() is O(1) due to hashing."
  },
  {
    question: "Which component determines where a key-value pair is stored in a HashMap?",
    options: [
      "Index Number",
      "Hash Function",
      "Binary Search",
      "Tree Rotation"
    ],
    correctAnswer: 1,
    explanation:
      "A hash function computes the bucket location for each key."
  },
  {
    question: "What may happen when two different keys map to the same bucket?",
    options: [
      "Overflow",
      "Collision",
      "Deletion",
      "Recursion"
    ],
    correctAnswer: 1,
    explanation:
      "A collision occurs when multiple keys hash to the same bucket."
  },
  {
    question: "Which data structure is commonly used to resolve collisions in Java HashMap?",
    options: [
      "Queue",
      "Linked List (and Tree for many collisions)",
      "Stack",
      "Heap"
    ],
    correctAnswer: 1,
    explanation:
      "HashMap uses linked lists and converts them to balanced trees when buckets become too large."
  },
  {
    question: "Can HashMap store a null key?",
    options: [
      "Yes, one null key",
      "No",
      "Only in Java 7",
      "Unlimited null keys"
    ],
    correctAnswer: 0,
    explanation:
      "Java's HashMap allows one null key and multiple null values."
  },
  {
    question: "Which operation is performed before storing an element in a HashMap?",
    options: [
      "Sorting",
      "Hashing the key",
      "Traversing the map",
      "Balancing the tree"
    ],
    correctAnswer: 1,
    explanation:
      "The key is hashed to determine the appropriate bucket."
  },
  {
    question: "HashMap insertion is commonly used in:",
    options: [
      "Caching",
      "Database indexing",
      "Fast lookups",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "HashMaps are widely used for caching, indexing, and efficient key-value storage."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Insert (put) Quiz"
      questions={questions}
    />
  );
}