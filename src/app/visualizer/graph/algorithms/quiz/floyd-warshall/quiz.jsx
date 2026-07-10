"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of the Floyd-Warshall Algorithm?",
    options: [
      "Find the shortest path from one source vertex",
      "Find the Minimum Spanning Tree",
      "Find the shortest paths between all pairs of vertices",
      "Perform graph traversal"
    ],
    correctAnswer: 2,
    explanation:
      "Floyd-Warshall computes the shortest paths between every pair of vertices in a weighted graph."
  },
  {
    question: "Which algorithmic technique is used in the Floyd-Warshall Algorithm?",
    options: [
      "Greedy",
      "Divide and Conquer",
      "Dynamic Programming",
      "Backtracking"
    ],
    correctAnswer: 2,
    explanation:
      "Floyd-Warshall is a classic Dynamic Programming algorithm."
  },
  {
    question: "The Floyd-Warshall Algorithm works on:",
    options: [
      "Directed graphs only",
      "Undirected graphs only",
      "Both directed and undirected weighted graphs",
      "Trees only"
    ],
    correctAnswer: 2,
    explanation:
      "It can be applied to both directed and undirected weighted graphs."
  },
  {
    question: "What is the time complexity of the Floyd-Warshall Algorithm?",
    options: [
      "O(V²)",
      "O(E log V)",
      "O(V³)",
      "O(V + E)"
    ],
    correctAnswer: 2,
    explanation:
      "The algorithm uses three nested loops, resulting in O(V³) complexity."
  },
  {
    question: "What is the space complexity of the Floyd-Warshall Algorithm?",
    options: [
      "O(V)",
      "O(E)",
      "O(V²)",
      "O(log V)"
    ],
    correctAnswer: 2,
    explanation:
      "A V × V distance matrix is maintained throughout the algorithm."
  },
  {
    question: "Which data structure is primarily used in the Floyd-Warshall Algorithm?",
    options: [
      "Adjacency Matrix",
      "Adjacency List",
      "Priority Queue",
      "Stack"
    ],
    correctAnswer: 0,
    explanation:
      "The algorithm updates distances using an adjacency (distance) matrix."
  },
  {
    question: "Can Floyd-Warshall handle negative edge weights?",
    options: [
      "No",
      "Yes, if there are no negative cycles",
      "Only positive weights",
      "Only zero-weight edges"
    ],
    correctAnswer: 1,
    explanation:
      "It supports negative edge weights but not graphs containing negative cycles."
  },
  {
    question: "Which condition is checked while updating distances?",
    options: [
      "dist[i][j] > dist[i][k] + dist[k][j]",
      "dist[i][j] < dist[i][k]",
      "dist[i][j] == dist[k][j]",
      "dist[i][k] == 0"
    ],
    correctAnswer: 0,
    explanation:
      "If going through vertex k provides a shorter path, the distance is updated."
  },
  {
    question: "Which of the following is an application of the Floyd-Warshall Algorithm?",
    options: [
      "Network Routing",
      "Traffic Analysis",
      "All-Pairs Shortest Path Problems",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "The algorithm is widely used in routing, traffic optimization, and all-pairs shortest path computations."
  },
  {
    question: "How can a negative cycle be detected using Floyd-Warshall?",
    options: [
      "A row contains all zeros",
      "A diagonal element becomes negative",
      "A column contains infinity",
      "The graph becomes disconnected"
    ],
    correctAnswer: 1,
    explanation:
      "If any distance[i][i] becomes negative after execution, a negative cycle exists."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Floyd-Warshall Algorithm Quiz"
      questions={questions}
    />
  );
}