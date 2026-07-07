"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What does DFS stand for?",
    options: [
      "Depth-First Search",
      "Data First Search",
      "Directed First Search",
      "Deep Function Search"
    ],
    correctAnswer: 0,
    explanation:
      "DFS stands for Depth-First Search, a graph traversal algorithm that explores as far as possible before backtracking."
  },
  {
    question: "Which data structure is primarily used in DFS?",
    options: [
      "Queue",
      "Stack",
      "Heap",
      "Priority Queue"
    ],
    correctAnswer: 1,
    explanation:
      "DFS uses a stack explicitly or implicitly through recursion."
  },
  {
    question: "Recursive DFS uses which hidden data structure?",
    options: [
      "Queue",
      "Call Stack",
      "Heap",
      "Hash Table"
    ],
    correctAnswer: 1,
    explanation:
      "Recursive function calls are managed using the system's call stack."
  },
  {
    question: "The time complexity of DFS using an adjacency list is:",
    options: [
      "O(V)",
      "O(E)",
      "O(V + E)",
      "O(V²)"
    ],
    correctAnswer: 2,
    explanation:
      "DFS visits every vertex and edge at most once."
  },
  {
    question: "DFS explores vertices in which manner?",
    options: [
      "Level by level",
      "Random order",
      "As deep as possible before backtracking",
      "Alphabetical order"
    ],
    correctAnswer: 2,
    explanation:
      "DFS follows one path completely before exploring alternative branches."
  },
  {
    question: "Which problem commonly uses DFS?",
    options: [
      "Cycle Detection",
      "Topological Sorting",
      "Connected Components",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "DFS is widely used for cycle detection, topological sorting, SCCs, and connected components."
  },
  {
    question: "Why is a visited array required in DFS?",
    options: [
      "To sort the graph",
      "To prevent revisiting vertices",
      "To balance the graph",
      "To calculate weights"
    ],
    correctAnswer: 1,
    explanation:
      "Without a visited array, DFS may revisit the same vertices indefinitely in cyclic graphs."
  },
  {
    question: "Which graph representation works efficiently with DFS?",
    options: [
      "Adjacency List",
      "Adjacency Matrix",
      "Both",
      "Heap"
    ],
    correctAnswer: 2,
    explanation:
      "DFS can be implemented using either an adjacency list or an adjacency matrix."
  },
  {
    question: "Which traversal technique is generally implemented recursively?",
    options: [
      "Breadth-First Search",
      "Depth-First Search",
      "Binary Search",
      "Level Order Traversal"
    ],
    correctAnswer: 1,
    explanation:
      "DFS is naturally implemented using recursion."
  },
  {
    question: "Which application commonly uses DFS?",
    options: [
      "Maze Solving",
      "Path Finding",
      "Cycle Detection",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "DFS is used in maze solving, path finding, graph analysis, and cycle detection."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Depth-First Search (DFS) Quiz"
      questions={questions}
    />
  );
}