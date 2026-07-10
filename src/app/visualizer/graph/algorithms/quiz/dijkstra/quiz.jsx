"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of Dijkstra's Algorithm?",
    options: [
      "Find the Minimum Spanning Tree",
      "Find the shortest path from a source vertex",
      "Detect cycles in a graph",
      "Perform Topological Sorting"
    ],
    correctAnswer: 1,
    explanation:
      "Dijkstra's Algorithm computes the shortest paths from a single source vertex to all other vertices."
  },
  {
    question: "Dijkstra's Algorithm works correctly only when edge weights are:",
    options: [
      "Negative",
      "Positive or Zero",
      "Random",
      "Infinite"
    ],
    correctAnswer: 1,
    explanation:
      "Dijkstra's Algorithm assumes all edge weights are non-negative."
  },
  {
    question: "Which data structure is commonly used to optimize Dijkstra's Algorithm?",
    options: [
      "Queue",
      "Priority Queue (Min Heap)",
      "Stack",
      "Hash Table"
    ],
    correctAnswer: 1,
    explanation:
      "A Min Heap efficiently selects the vertex with the smallest tentative distance."
  },
  {
    question: "What is the time complexity of Dijkstra's Algorithm using a Min Heap?",
    options: [
      "O(V²)",
      "O(E log V)",
      "O(V + E)",
      "O(log V)"
    ],
    correctAnswer: 1,
    explanation:
      "Using a priority queue, the algorithm runs in O(E log V)."
  },
  {
    question: "Which graph representation is commonly used with Dijkstra's Algorithm?",
    options: [
      "Adjacency List",
      "Adjacency Matrix",
      "Both",
      "Binary Tree"
    ],
    correctAnswer: 2,
    explanation:
      "Both representations can be used, although adjacency lists are preferred for sparse graphs."
  },
  {
    question: "What value is initially assigned to the source vertex?",
    options: [
      "Infinity",
      "1",
      "0",
      "-1"
    ],
    correctAnswer: 2,
    explanation:
      "The source vertex starts with a distance of 0."
  },
  {
    question: "What value is initially assigned to all other vertices?",
    options: [
      "0",
      "1",
      "Infinity",
      "-1"
    ],
    correctAnswer: 2,
    explanation:
      "All other vertices begin with an infinite distance."
  },
  {
    question: "What operation updates the shortest known distance to neighboring vertices?",
    options: [
      "Sorting",
      "Relaxation",
      "Traversal",
      "Backtracking"
    ],
    correctAnswer: 1,
    explanation:
      "Relaxation updates a neighbor's distance if a shorter path is found."
  },
  {
    question: "Which of the following is NOT suitable for Dijkstra's Algorithm?",
    options: [
      "Road Networks",
      "GPS Navigation",
      "Graphs with Negative Edge Weights",
      "Network Routing"
    ],
    correctAnswer: 2,
    explanation:
      "Negative edge weights can produce incorrect results in Dijkstra's Algorithm."
  },
  {
    question: "Which real-world application commonly uses Dijkstra's Algorithm?",
    options: [
      "GPS Navigation",
      "Network Routing",
      "Map Services",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Dijkstra's Algorithm is widely used in navigation systems and network routing."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Dijkstra's Algorithm Quiz"
      questions={questions}
    />
  );
}