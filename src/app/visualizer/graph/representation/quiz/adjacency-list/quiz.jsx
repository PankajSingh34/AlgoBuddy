"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is an Adjacency List?",
    options: [
      "A two-dimensional matrix",
      "A list where each vertex stores its neighboring vertices",
      "A binary search tree",
      "A stack of graph nodes"
    ],
    correctAnswer: 1,
    explanation:
      "An Adjacency List represents a graph by storing a list of adjacent vertices for each vertex."
  },
  {
    question: "Which data structure is commonly used to implement an Adjacency List?",
    options: [
      "Array of Linked Lists",
      "Stack",
      "Queue",
      "Heap"
    ],
    correctAnswer: 0,
    explanation:
      "An Adjacency List is commonly implemented using an array (or vector) of linked lists or dynamic arrays."
  },
  {
    question: "What is the space complexity of an Adjacency List?",
    options: [
      "O(V²)",
      "O(V + E)",
      "O(E²)",
      "O(log V)"
    ],
    correctAnswer: 1,
    explanation:
      "An Adjacency List stores only the existing edges, requiring O(V + E) space."
  },
  {
    question: "Adjacency Lists are most suitable for:",
    options: [
      "Dense graphs",
      "Sparse graphs",
      "Complete graphs only",
      "Binary trees only"
    ],
    correctAnswer: 1,
    explanation:
      "Sparse graphs benefit from the lower memory usage of Adjacency Lists."
  },
  {
    question: "What is the average time complexity to check whether an edge exists using an Adjacency List?",
    options: [
      "O(1)",
      "O(log V)",
      "O(degree of the vertex)",
      "O(V²)"
    ],
    correctAnswer: 2,
    explanation:
      "The neighbors of the source vertex must be searched, giving O(degree(vertex)) time."
  },
  {
    question: "In an undirected graph, an edge (A, B) is stored:",
    options: [
      "Only in A's list",
      "Only in B's list",
      "In both A's and B's adjacency lists",
      "Nowhere"
    ],
    correctAnswer: 2,
    explanation:
      "For undirected graphs, each edge appears in the adjacency list of both connected vertices."
  },
  {
    question: "Which graph traversal algorithms commonly use an Adjacency List?",
    options: [
      "DFS",
      "BFS",
      "Both DFS and BFS",
      "Heap Sort"
    ],
    correctAnswer: 2,
    explanation:
      "Both Depth-First Search and Breadth-First Search are efficiently implemented using Adjacency Lists."
  },
  {
    question: "What is one major advantage of an Adjacency List over an Adjacency Matrix?",
    options: [
      "Constant-time edge lookup",
      "Lower memory usage for sparse graphs",
      "Stores all possible edges",
      "Always faster traversal"
    ],
    correctAnswer: 1,
    explanation:
      "Adjacency Lists use much less memory when the graph contains relatively few edges."
  },
  {
    question: "How many adjacency lists are maintained for a graph with V vertices?",
    options: [
      "V",
      "E",
      "V × V",
      "V + E"
    ],
    correctAnswer: 0,
    explanation:
      "Each vertex maintains one adjacency list containing its neighbors."
  },
  {
    question: "Which representation is generally preferred for sparse graphs?",
    options: [
      "Adjacency Matrix",
      "Adjacency List",
      "Incidence Matrix",
      "Edge Matrix"
    ],
    correctAnswer: 1,
    explanation:
      "Adjacency Lists efficiently store only existing edges, making them ideal for sparse graphs."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Adjacency List Quiz"
      questions={questions}
    />
  );
}