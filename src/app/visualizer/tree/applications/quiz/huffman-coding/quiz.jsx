"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of Huffman Coding?",
    options: [
      "Sorting numbers",
      "Data compression",
      "Searching trees",
      "Balancing binary trees"
    ],
    correctAnswer: 1,
    explanation:
      "Huffman Coding is a lossless data compression algorithm that assigns variable-length codes to characters."
  },
  {
    question: "Huffman Coding is based on which type of binary tree?",
    options: [
      "Binary Search Tree",
      "AVL Tree",
      "Huffman Tree",
      "Segment Tree"
    ],
    correctAnswer: 2,
    explanation:
      "A Huffman Tree is a binary tree specifically constructed for optimal prefix coding."
  },
  {
    question: "Which characters receive shorter binary codes in Huffman Coding?",
    options: [
      "Least frequent characters",
      "Most frequent characters",
      "All characters receive equal-length codes",
      "Random characters"
    ],
    correctAnswer: 1,
    explanation:
      "Frequently occurring characters receive shorter codes to reduce the total encoded size."
  },
  {
    question: "Which data structure is commonly used while constructing a Huffman Tree?",
    options: [
      "Stack",
      "Queue",
      "Priority Queue (Min Heap)",
      "Hash Table"
    ],
    correctAnswer: 2,
    explanation:
      "A Min Heap (Priority Queue) efficiently selects the two nodes with the lowest frequencies."
  },
  {
    question: "What type of compression does Huffman Coding provide?",
    options: [
      "Lossy",
      "Lossless",
      "Hybrid",
      "Encrypted"
    ],
    correctAnswer: 1,
    explanation:
      "Huffman Coding is a lossless compression technique, allowing the original data to be perfectly reconstructed."
  },
  {
    question: "The Huffman Tree is built by repeatedly combining:",
    options: [
      "The two largest frequency nodes",
      "The root and leaf nodes",
      "The two smallest frequency nodes",
      "Random nodes"
    ],
    correctAnswer: 2,
    explanation:
      "The two nodes with the smallest frequencies are merged until only one tree remains."
  },
  {
    question: "What property do Huffman Codes satisfy?",
    options: [
      "Balanced Property",
      "Prefix Property",
      "Heap Property",
      "BST Property"
    ],
    correctAnswer: 1,
    explanation:
      "No Huffman code is a prefix of another, ensuring unique decoding."
  },
  {
    question: "Which algorithmic strategy is used in Huffman Coding?",
    options: [
      "Dynamic Programming",
      "Greedy Algorithm",
      "Divide and Conquer",
      "Backtracking"
    ],
    correctAnswer: 1,
    explanation:
      "Huffman Coding uses a greedy strategy by repeatedly combining the least frequent nodes."
  },
  {
    question: "Where is Huffman Coding commonly used?",
    options: [
      "JPEG",
      "ZIP Compression",
      "PNG",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Huffman Coding is widely used in file compression formats such as ZIP, PNG, and JPEG."
  },
  {
    question: "What is the time complexity of building a Huffman Tree using a Min Heap?",
    options: [
      "O(n)",
      "O(log n)",
      "O(n log n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Building the Huffman Tree requires repeated heap operations, resulting in O(n log n) complexity."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Huffman Coding Quiz"
      questions={questions}
    />
  );
}