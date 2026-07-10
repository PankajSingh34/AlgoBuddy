"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What does BFS stand for?",
    options: [
      "Binary First Search",
      "Breadth-First Search",
      "Balanced First Search",
      "Branch First Search"
    ],
    correctAnswer: 1,
    explanation:
      "BFS stands for Breadth-First Search, a graph traversal algorithm."
  },
  {
    question: "Which data structure is primarily used in BFS?",
    options: [
      "Stack",
      "Queue",
      "Heap",
      "Linked List"
    ],
    correctAnswer: 1,
    explanation:
      "BFS uses a Queue to visit vertices level by level."
  },
  {
    question: "BFS visits graph vertices in:",
    options: [
      "Depth-wise",
      "Random order",
      "Level-by-level",
      "Reverse order"
    ],
    correctAnswer: 2,
    explanation:
      "BFS explores all neighbors before moving to the next level."
  },
  {
    question: "The time complexity of BFS using an adjacency list is:",
    options: [
      "O(V)",
      "O(E)",
      "O(V + E)",
      "O(V²)"
    ],
    correctAnswer: 2,
    explanation:
      "Each vertex and each edge is processed at most once."
  },
  {
    question: "Which graph problem commonly uses BFS?",
    options: [
      "Shortest path in an unweighted graph",
      "Minimum Spanning Tree",
      "Heap Sort",
      "Binary Search"
    ],
    correctAnswer: 0,
    explanation:
      "BFS finds the shortest path in an unweighted graph."
  },
  {
    question: "Before visiting a neighboring vertex in BFS, it should be:",
    options: [
      "Deleted",
      "Marked as visited",
      "Sorted",
      "Balanced"
    ],
    correctAnswer: 1,
    explanation:
      "Vertices are marked visited before being added to the queue to avoid repeated visits."
  },
  {
    question: "BFS is also called:",
    options: [
      "Level Order Traversal",
      "Inorder Traversal",
      "Postorder Traversal",
      "Preorder Traversal"
    ],
    correctAnswer: 0,
    explanation:
      "BFS processes vertices level by level, similar to level-order traversal in trees."
  },
  {
    question: "Which graph representation is commonly used with BFS?",
    options: [
      "Adjacency List",
      "Adjacency Matrix",
      "Both Adjacency List and Matrix",
      "Binary Heap"
    ],
    correctAnswer: 2,
    explanation:
      "BFS can be implemented using either adjacency lists or adjacency matrices."
  },
  {
    question: "What happens if a visited array is not used in BFS?",
    options: [
      "The graph becomes disconnected",
      "Vertices may be visited repeatedly",
      "The queue becomes empty",
      "The graph is sorted"
    ],
    correctAnswer: 1,
    explanation:
      "Without tracking visited vertices, BFS can revisit the same vertices repeatedly."
  },
  {
    question: "Which of the following is an application of BFS?",
    options: [
      "Social Network Analysis",
      "Web Crawling",
      "Shortest Path",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "BFS is widely used in networking, web crawling, social graphs, and shortest-path problems."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Breadth-First Search (BFS) Quiz"
      questions={questions}
    />
  );
}