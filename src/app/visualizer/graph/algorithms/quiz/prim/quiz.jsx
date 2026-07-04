"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of Prim's Algorithm?",
    options: [
      "Find the shortest path",
      "Find the Minimum Spanning Tree (MST)",
      "Perform graph traversal",
      "Detect cycles"
    ],
    correctAnswer: 1,
    explanation:
      "Prim's Algorithm constructs a Minimum Spanning Tree by repeatedly adding the minimum-weight edge."
  },
  {
    question: "Prim's Algorithm is based on which algorithmic strategy?",
    options: [
      "Dynamic Programming",
      "Greedy",
      "Backtracking",
      "Divide and Conquer"
    ],
    correctAnswer: 1,
    explanation:
      "Prim's Algorithm is a greedy algorithm because it always chooses the smallest available edge."
  },
  {
    question: "Prim's Algorithm works on:",
    options: [
      "Directed graphs",
      "Undirected weighted graphs",
      "Directed acyclic graphs",
      "Binary trees"
    ],
    correctAnswer: 1,
    explanation:
      "Prim's Algorithm is designed for connected, undirected weighted graphs."
  },
  {
    question: "Which data structure is commonly used to optimize Prim's Algorithm?",
    options: [
      "Stack",
      "Queue",
      "Priority Queue (Min Heap)",
      "Hash Table"
    ],
    correctAnswer: 2,
    explanation:
      "A Min Heap efficiently selects the minimum-weight edge."
  },
  {
    question: "What is the time complexity of Prim's Algorithm using a Min Heap and adjacency list?",
    options: [
      "O(V²)",
      "O(E log V)",
      "O(V + E)",
      "O(log V)"
    ],
    correctAnswer: 1,
    explanation:
      "Using a Min Heap and adjacency list gives a complexity of O(E log V)."
  },
  {
    question: "What does a Minimum Spanning Tree contain?",
    options: [
      "All vertices with minimum total edge weight",
      "Only shortest paths",
      "Cycles",
      "Only directed edges"
    ],
    correctAnswer: 0,
    explanation:
      "An MST connects all vertices with the minimum possible total edge weight."
  },
  {
    question: "How many edges are present in the MST of a graph with V vertices?",
    options: [
      "V",
      "V + 1",
      "V - 1",
      "E"
    ],
    correctAnswer: 2,
    explanation:
      "Every Minimum Spanning Tree contains exactly V − 1 edges."
  },
  {
    question: "Prim's Algorithm starts from:",
    options: [
      "The largest edge",
      "Any arbitrary vertex",
      "The destination vertex",
      "The middle vertex"
    ],
    correctAnswer: 1,
    explanation:
      "Prim's Algorithm can start from any vertex in the graph."
  },
  {
    question: "Which of the following is NOT an application of Prim's Algorithm?",
    options: [
      "Network Design",
      "Road Construction",
      "Electrical Grid Design",
      "Shortest Path with Negative Weights"
    ],
    correctAnswer: 3,
    explanation:
      "Prim's Algorithm finds an MST, not shortest paths."
  },
  {
    question: "Prim's Algorithm stops when:",
    options: [
      "All edges are visited",
      "The queue becomes empty",
      "All vertices are included in the MST",
      "A cycle is detected"
    ],
    correctAnswer: 2,
    explanation:
      "The algorithm terminates after all vertices have been added to the Minimum Spanning Tree."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Prim's Algorithm Quiz"
      questions={questions}
    />
  );
}