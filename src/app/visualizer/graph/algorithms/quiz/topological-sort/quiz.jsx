"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of Topological Sort?",
    options: [
      "Find the shortest path",
      "Arrange vertices in a linear order based on dependencies",
      "Find the Minimum Spanning Tree",
      "Detect cycles"
    ],
    correctAnswer: 1,
    explanation:
      "Topological Sort produces a linear ordering of vertices such that for every directed edge (u → v), u appears before v."
  },
  {
    question: "Topological Sort can only be performed on:",
    options: [
      "Undirected Graphs",
      "Directed Acyclic Graphs (DAGs)",
      "Weighted Graphs",
      "Complete Graphs"
    ],
    correctAnswer: 1,
    explanation:
      "Topological Sorting is defined only for Directed Acyclic Graphs (DAGs)."
  },
  {
    question: "Which algorithm can be used to perform Topological Sort?",
    options: [
      "Kahn's Algorithm",
      "DFS-based Algorithm",
      "Both A and B",
      "Prim's Algorithm"
    ],
    correctAnswer: 2,
    explanation:
      "Topological Sort can be implemented using Kahn's Algorithm (BFS) or DFS."
  },
  {
    question: "Which data structure is mainly used in Kahn's Algorithm?",
    options: [
      "Stack",
      "Queue",
      "Priority Queue",
      "Heap"
    ],
    correctAnswer: 1,
    explanation:
      "Kahn's Algorithm uses a queue to process vertices with zero in-degree."
  },
  {
    question: "What does the in-degree of a vertex represent?",
    options: [
      "Number of outgoing edges",
      "Number of incoming edges",
      "Total number of edges",
      "Number of neighboring vertices"
    ],
    correctAnswer: 1,
    explanation:
      "The in-degree of a vertex is the number of incoming edges."
  },
  {
    question: "What is the time complexity of Topological Sort using an adjacency list?",
    options: [
      "O(V²)",
      "O(E log V)",
      "O(V + E)",
      "O(log V)"
    ],
    correctAnswer: 2,
    explanation:
      "Each vertex and edge is processed exactly once."
  },
  {
    question: "If a graph contains a cycle, Topological Sort:",
    options: [
      "Still works correctly",
      "Produces duplicate vertices",
      "Is not possible",
      "Removes the cycle automatically"
    ],
    correctAnswer: 2,
    explanation:
      "Topological ordering exists only for Directed Acyclic Graphs."
  },
  {
    question: "Which of the following is a common application of Topological Sort?",
    options: [
      "Course Scheduling",
      "Task Scheduling",
      "Dependency Resolution",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Topological Sort is widely used wherever dependency ordering is required."
  },
  {
    question: "DFS-based Topological Sort stores vertices in:",
    options: [
      "Queue",
      "Heap",
      "Stack",
      "Hash Table"
    ],
    correctAnswer: 2,
    explanation:
      "Vertices are pushed onto a stack after all their descendants have been visited."
  },
  {
    question: "Which graph type always has at least one valid Topological Ordering?",
    options: [
      "Undirected Graph",
      "Directed Cyclic Graph",
      "Directed Acyclic Graph (DAG)",
      "Complete Graph"
    ],
    correctAnswer: 2,
    explanation:
      "Every DAG has at least one valid topological ordering."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Topological Sort Quiz"
      questions={questions}
    />
  );
}