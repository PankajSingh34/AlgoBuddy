"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is Serialization in a Binary Tree?",
    options: [
      "Deleting all nodes of the tree",
      "Converting a tree into a storable or transmittable format",
      "Balancing a binary tree",
      "Sorting tree nodes"
    ],
    correctAnswer: 1,
    explanation:
      "Serialization converts a tree into a sequence of values so it can be stored or transmitted."
  },
  {
    question: "What is Deserialization?",
    options: [
      "Deleting duplicate nodes",
      "Reconstructing a binary tree from serialized data",
      "Traversing a binary tree",
      "Finding the height of a tree"
    ],
    correctAnswer: 1,
    explanation:
      "Deserialization reconstructs the original tree from its serialized representation."
  },
  {
    question: "Which traversal is commonly used during Serialization?",
    options: [
      "Preorder Traversal",
      "Heap Traversal",
      "Boundary Traversal",
      "Vertical Traversal"
    ],
    correctAnswer: 0,
    explanation:
      "Preorder Traversal with NULL markers is one of the most common serialization techniques."
  },
  {
    question: "Why are NULL markers included during Serialization?",
    options: [
      "To reduce memory usage",
      "To preserve the exact tree structure",
      "To sort the nodes",
      "To improve traversal speed"
    ],
    correctAnswer: 1,
    explanation:
      "NULL markers ensure the original tree structure can be reconstructed correctly."
  },
  {
    question: "What is the time complexity of Serialization?",
    options: [
      "O(log n)",
      "O(n)",
      "O(n²)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation:
      "Every node is visited exactly once during serialization."
  },
  {
    question: "What is the time complexity of Deserialization?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Each serialized element is processed once while rebuilding the tree."
  },
  {
    question: "Which data structure is commonly used while deserializing recursively?",
    options: [
      "Queue",
      "Call Stack",
      "Heap",
      "Hash Table"
    ],
    correctAnswer: 1,
    explanation:
      "Recursive deserialization uses the system call stack."
  },
  {
    question: "Serialization is commonly used in:",
    options: [
      "Saving tree structures",
      "Network communication",
      "Databases",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Serialization is widely used for storage, databases, caching, and data transmission."
  },
  {
    question: "Which problem occurs if NULL nodes are not serialized?",
    options: [
      "The tree becomes balanced",
      "The original tree structure cannot always be reconstructed",
      "Traversal becomes faster",
      "The height increases"
    ],
    correctAnswer: 1,
    explanation:
      "Without NULL markers, different tree structures can produce the same traversal sequence."
  },
  {
    question: "Serialization & Deserialization are frequently asked in:",
    options: [
      "System Design",
      "Technical Interviews",
      "Competitive Programming",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "These concepts are widely tested in interviews and are used in real-world distributed systems."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Serialization & Deserialization Quiz"
      questions={questions}
    />
  );
}