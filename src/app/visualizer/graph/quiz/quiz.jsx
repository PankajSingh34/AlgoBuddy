"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const GraphAlgorithmsQuiz = () => {
  const questions = [
    {
      question: "Which of the following describes a Graph in data structures?",
      options: [
        "A linear sequence of elements",
        "A hierarchical structure with a single root",
        "A collection of vertices (nodes) and edges connecting them",
        "A continuous block of allocated memory"
      ],
      correctAnswer: 2,
      explanation: "A graph is a non-linear data structure consisting of nodes (vertices) connected by links (edges)."
    },
    {
      question: "What is the key difference between a Directed Graph and an Undirected Graph?",
      options: [
        "Directed graphs cannot have cycles",
        "Edges in a directed graph have a specific direction (from one node to another), while undirected edges are bidirectional",
        "Undirected graphs can only have positive edge weights",
        "Directed graphs must be connected, whereas undirected graphs do not"
      ],
      correctAnswer: 1,
      explanation: "In a directed graph, edges act like one-way streets. In an undirected graph, an edge between A and B allows traversal in both directions."
    },
    {
      question: "What is an Adjacency Matrix?",
      options: [
        "A 2D array where matrix[i][j] indicates whether there is an edge between vertex i and j",
        "A list where each vertex holds an array of its neighbors",
        "A tree structure used to store graph edges",
        "A hash map mapping edges to weights"
      ],
      correctAnswer: 0,
      explanation: "An adjacency matrix uses a V x V 2D array, where each cell (i, j) represents the presence (and optionally weight) of an edge between vertices i and j."
    },
    {
      question: "When is an Adjacency List generally preferred over an Adjacency Matrix?",
      options: [
        "When the graph is dense (has many edges)",
        "When checking for the existence of a specific edge needs to be O(1)",
        "When the graph is sparse (has relatively few edges)",
        "When the graph requires a Minimum Spanning Tree"
      ],
      correctAnswer: 2,
      explanation: "For sparse graphs, an Adjacency List saves significant memory (O(V + E)) compared to the O(V^2) space of an Adjacency Matrix."
    },
    {
      question: "Which data structure is fundamentally used to implement Breadth-First Search (BFS)?",
      options: [
        "Stack",
        "Queue",
        "Priority Queue",
        "Linked List"
      ],
      correctAnswer: 1,
      explanation: "BFS uses a Queue to explore neighbors level-by-level in a First-In-First-Out (FIFO) manner."
    },
    {
      question: "Which algorithm naturally explores as deeply as possible along each branch before backtracking?",
      options: [
        "Breadth-First Search (BFS)",
        "Depth-First Search (DFS)",
        "Dijkstra's Algorithm",
        "Kruskal's Algorithm"
      ],
      correctAnswer: 1,
      explanation: "DFS (Depth-First Search) goes deep into a graph branch by branch, commonly implemented recursively or with a Stack."
    },
    {
      question: "What is the time complexity of BFS and DFS on a graph represented using an Adjacency List?",
      options: [
        "O(V)",
        "O(E)",
        "O(V + E)",
        "O(V²)"
      ],
      correctAnswer: 2,
      explanation: "Both BFS and DFS visit every vertex once and examine every edge once, resulting in O(V + E) time."
    },
    {
      question: "What is a Connected Component in an undirected graph?",
      options: [
        "A subgraph where any two vertices are connected to each other by paths",
        "A cycle within the graph",
        "A vertex with a high degree",
        "A graph with no edges"
      ],
      correctAnswer: 0,
      explanation: "A connected component is a maximal set of vertices such that there is a path between every pair of vertices in the set."
    },
    {
      question: "Which of the following methods can be used to detect a cycle in a Directed Graph?",
      options: [
        "Keeping a single visited set in BFS",
        "Using DFS and maintaining a recursion stack (or tracking current path)",
        "Using Dijkstra's algorithm",
        "Sorting the adjacency matrix"
      ],
      correctAnswer: 1,
      explanation: "In a directed graph, a cycle is detected if a DFS encounters a vertex that is currently in the recursion stack (an ancestor)."
    },
    {
      question: "What is Topological Sorting?",
      options: [
        "Sorting vertices by their degree",
        "A linear ordering of vertices such that for every directed edge U->V, U comes before V",
        "Sorting edges by their weights",
        "A way to sort the components of an undirected graph"
      ],
      correctAnswer: 1,
      explanation: "Topological sorting linearly orders vertices of a Directed Acyclic Graph (DAG) such that all directed edges point from left to right."
    },
    {
      question: "Which of the following is true about Topological Sort?",
      options: [
        "It can be applied to any graph",
        "It can only be applied to undirected graphs",
        "It can only be applied to Directed Acyclic Graphs (DAGs)",
        "It is used to find the shortest path"
      ],
      correctAnswer: 2,
      explanation: "Topological sort is only possible for Directed Acyclic Graphs. If there is a cycle, a valid linear ordering cannot exist."
    },
    {
      question: "Dijkstra's Algorithm is used to find:",
      options: [
        "The Longest Path from a source to all other nodes",
        "The Shortest Path from a single source to all other nodes in a graph with non-negative weights",
        "The Minimum Spanning Tree of a graph",
        "All-pairs shortest paths"
      ],
      correctAnswer: 1,
      explanation: "Dijkstra's finds the single-source shortest path. It requires non-negative edge weights to work correctly."
    },
    {
      question: "Which data structure is typically used to optimize Dijkstra's Algorithm?",
      options: [
        "Stack",
        "Queue",
        "Min-Priority Queue (or Min-Heap)",
        "Hash Set"
      ],
      correctAnswer: 2,
      explanation: "A Min-Priority Queue efficiently extracts the vertex with the current minimum distance, optimizing the algorithm to O((V+E) log V)."
    },
    {
      question: "Which algorithm should be used to find the shortest path when a graph contains negative weight edges?",
      options: [
        "Dijkstra's Algorithm",
        "Prim's Algorithm",
        "Breadth-First Search",
        "Bellman-Ford Algorithm"
      ],
      correctAnswer: 3,
      explanation: "Bellman-Ford can handle negative weights and can also detect negative weight cycles, unlike Dijkstra's."
    },
    {
      question: "What is a Minimum Spanning Tree (MST)?",
      options: [
        "A tree that includes all vertices of a connected, undirected graph with the minimum possible total edge weight",
        "A tree that connects the shortest path between any two random nodes",
        "A binary search tree formed from graph edges",
        "A graph without any leaves"
      ],
      correctAnswer: 0,
      explanation: "An MST spans all vertices of an undirected, weighted graph without cycles, ensuring the sum of the edge weights is minimized."
    },
    {
      question: "How does Prim's Algorithm build a Minimum Spanning Tree?",
      options: [
        "By sorting all edges and adding them if they don't form a cycle",
        "By starting from an arbitrary vertex and greedily adding the cheapest edge connecting the growing tree to a new vertex",
        "By relaxing all edges V-1 times",
        "By removing the most expensive edges one by one"
      ],
      correctAnswer: 1,
      explanation: "Prim's builds the MST incrementally from a starting node, continually picking the smallest edge that expands the tree to an unvisited node."
    },
    {
      question: "How does Kruskal's Algorithm build a Minimum Spanning Tree?",
      options: [
        "By sorting all edges by weight and adding them one by one, skipping those that form a cycle",
        "By growing a tree from a single source vertex",
        "By running BFS from every node",
        "By repeatedly identifying the shortest path between all pairs of nodes"
      ],
      correctAnswer: 0,
      explanation: "Kruskal's uses a greedy approach, processing edges in increasing order of weight and using a Disjoint Set (Union-Find) to avoid cycles."
    },
    {
      question: "What is the primary use of the Disjoint Set (Union-Find) data structure in graph algorithms?",
      options: [
        "Finding the shortest path",
        "Implementing BFS efficiently",
        "Keeping track of connected components and detecting cycles (e.g., in Kruskal's algorithm)",
        "Sorting the vertices"
      ],
      correctAnswer: 2,
      explanation: "Union-Find efficiently tracks sets of elements. It is heavily used in Kruskal's algorithm to determine if adding an edge creates a cycle."
    }
  ];

  return <QuizEngine title="Graph Algorithms Quiz" questions={questions} />;
};

export default GraphAlgorithmsQuiz;
