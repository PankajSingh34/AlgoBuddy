"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is an Adjacency Matrix?",
    options: [
      "A linked list of vertices",
      "A 2D matrix used to represent edges between vertices",
      "A stack of graph nodes",
      "A binary tree representation"
    ],
    correctAnswer: 1,
    explanation:
      "An Adjacency Matrix is a two-dimensional array where rows and columns represent vertices."
  },
  {
    question: "For a graph with V vertices, the size of an Adjacency Matrix is:",
    options: [
      "V",
      "V × V",
      "E × V",
      "E × E"
    ],
    correctAnswer: 1,
    explanation:
      "An Adjacency Matrix contains one row and one column for every vertex."
  },
  {
    question: "What value indicates an edge exists between two vertices in an unweighted graph?",
    options: [
      "0",
      "1",
      "-1",
      "Infinity"
    ],
    correctAnswer: 1,
    explanation:
      "A value of 1 usually indicates that an edge exists between two vertices."
  },
  {
    question: "What is stored when no edge exists between two vertices?",
    options: [
      "1",
      "0",
      "-1",
      "Vertex ID"
    ],
    correctAnswer: 1,
    explanation:
      "A value of 0 indicates there is no edge between the vertices."
  },
  {
    question: "What is the space complexity of an Adjacency Matrix?",
    options: [
      "O(V)",
      "O(E)",
      "O(V²)",
      "O(log V)"
    ],
    correctAnswer: 2,
    explanation:
      "An Adjacency Matrix always requires V² space regardless of the number of edges."
  },
  {
    question: "Checking whether an edge exists using an Adjacency Matrix takes:",
    options: [
      "O(V)",
      "O(E)",
      "O(1)",
      "O(log V)"
    ],
    correctAnswer: 2,
    explanation:
      "The edge can be checked directly using matrix[row][column]."
  },
  {
    question: "Adjacency Matrix is most suitable for:",
    options: [
      "Sparse graphs",
      "Dense graphs",
      "Trees only",
      "Linked Lists"
    ],
    correctAnswer: 1,
    explanation:
      "Dense graphs benefit from the constant-time edge lookup provided by an Adjacency Matrix."
  },
  {
    question: "In an undirected graph, an Adjacency Matrix is:",
    options: [
      "Triangular",
      "Symmetric",
      "Random",
      "Diagonal"
    ],
    correctAnswer: 1,
    explanation:
      "For undirected graphs, matrix[i][j] equals matrix[j][i]."
  },
  {
    question: "The diagonal elements of an Adjacency Matrix are usually:",
    options: [
      "1",
      "0",
      "-1",
      "Infinity"
    ],
    correctAnswer: 1,
    explanation:
      "Unless self-loops exist, the diagonal entries are typically 0."
  },
  {
    question: "Which is an advantage of the Adjacency Matrix?",
    options: [
      "Uses very little memory",
      "Constant-time edge lookup",
      "Best for sparse graphs",
      "Stores only existing edges"
    ],
    correctAnswer: 1,
    explanation:
      "The biggest advantage is O(1) edge existence checking."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Adjacency Matrix Quiz"
      questions={questions}
    />
  );
}