"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of Kruskal's Algorithm?",
    options: [
      "Find the shortest path",
      "Find the Minimum Spanning Tree (MST)",
      "Perform graph traversal",
      "Detect cycles"
    ],
    correctAnswer: 1,
    explanation:
      "Kruskal's Algorithm constructs a Minimum Spanning Tree by selecting the smallest edges without forming cycles."
  },
  {
    question: "Kruskal's Algorithm follows which algorithmic strategy?",
    options: [
      "Dynamic Programming",
      "Greedy",
      "Backtracking",
      "Divide and Conquer"
    ],
    correctAnswer: 1,
    explanation:
      "Kruskal's Algorithm is a greedy algorithm because it always chooses the smallest available edge."
  },
  {
    question: "Which data structure is commonly used to detect cycles in Kruskal's Algorithm?",
    options: [
      "Queue",
      "Stack",
      "Disjoint Set (Union-Find)",
      "Priority Queue"
    ],
    correctAnswer: 2,
    explanation:
      "Union-Find (Disjoint Set) efficiently detects whether adding an edge would create a cycle."
  },
  {
    question: "What is the first step in Kruskal's Algorithm?",
    options: [
      "Choose any vertex",
      "Sort all edges by weight",
      "Traverse the graph",
      "Build a heap"
    ],
    correctAnswer: 1,
    explanation:
      "The algorithm begins by sorting all edges in non-decreasing order of weight."
  },
  {
    question: "Kruskal's Algorithm is mainly applied to:",
    options: [
      "Directed graphs",
      "Undirected weighted graphs",
      "Binary trees",
      "Directed acyclic graphs"
    ],
    correctAnswer: 1,
    explanation:
      "Kruskal's Algorithm is designed for connected, undirected weighted graphs."
  },
  {
    question: "How many edges are present in the Minimum Spanning Tree of a graph with V vertices?",
    options: [
      "V",
      "V + 1",
      "V - 1",
      "E"
    ],
    correctAnswer: 2,
    explanation:
      "A Minimum Spanning Tree always contains exactly V − 1 edges."
  },
  {
    question: "What happens if adding an edge creates a cycle?",
    options: [
      "The edge is included",
      "The edge is ignored",
      "The graph is restarted",
      "The graph becomes directed"
    ],
    correctAnswer: 1,
    explanation:
      "Edges that create cycles are skipped to maintain the spanning tree property."
  },
  {
    question: "What is the overall time complexity of Kruskal's Algorithm?",
    options: [
      "O(V²)",
      "O(E log E)",
      "O(V + E)",
      "O(log V)"
    ],
    correctAnswer: 1,
    explanation:
      "Sorting the edges dominates the running time, resulting in O(E log E)."
  },
  {
    question: "Which of the following is an application of Kruskal's Algorithm?",
    options: [
      "Road Network Design",
      "Network Cabling",
      "Electrical Grid Construction",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Kruskal's Algorithm is widely used for designing cost-efficient networks."
  },
  {
    question: "Kruskal's Algorithm stops when:",
    options: [
      "All edges are processed",
      "V − 1 edges have been added to the MST",
      "The graph becomes disconnected",
      "The priority queue is empty"
    ],
    correctAnswer: 1,
    explanation:
      "The algorithm terminates once the Minimum Spanning Tree contains V − 1 edges."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Kruskal's Algorithm Quiz"
      questions={questions}
    />
  );
}