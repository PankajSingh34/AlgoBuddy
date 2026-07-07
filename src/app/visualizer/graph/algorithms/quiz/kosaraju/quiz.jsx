"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is a Strongly Connected Component (SCC) in a directed graph?",
    options: [
      "A subset of vertices where there is a path from any vertex to any other vertex in that subset.",
      "A subset of vertices where all edges have positive weights.",
      "A subset of vertices that forms a tree.",
      "A subset of vertices where every vertex has the same degree."
    ],
    correctAnswer: 0,
    explanation: "An SCC is a maximal subgraph of a directed graph where every vertex is reachable from every other vertex in the same subgraph."
  },
  {
    question: "For which type of graphs is the concept of Strongly Connected Components (SCCs) defined?",
    options: [
      "Undirected graphs only",
      "Directed graphs only",
      "Both directed and undirected graphs",
      "Trees only"
    ],
    correctAnswer: 1,
    explanation: "SCCs are defined for directed graphs. In undirected graphs, components are simply called 'Connected Components' because connectivity is naturally symmetric."
  },
  {
    question: "What is the primary purpose of Kosaraju's Algorithm?",
    options: [
      "To find the shortest path from a single source node.",
      "To construct a Minimum Spanning Tree of a weighted graph.",
      "To identify all Strongly Connected Components (SCCs) in a directed graph.",
      "To find a topological ordering of vertices in a DAG."
    ],
    correctAnswer: 2,
    explanation: "Kosaraju's algorithm is specifically designed to find all strongly connected components in a directed graph."
  },
  {
    question: "Which graph traversal algorithm is used as the fundamental building block in Kosaraju's Algorithm?",
    options: [
      "Breadth-First Search (BFS)",
      "Depth-First Search (DFS)",
      "Dijkstra's Algorithm",
      "Kruskal's Algorithm"
    ],
    correctAnswer: 1,
    explanation: "Kosaraju's algorithm relies on two passes of Depth-First Search (DFS)."
  },
  {
    question: "In the first pass of Kosaraju's Algorithm, how is the stack populated?",
    options: [
      "A node is pushed to the stack when DFS first visits (discovers) it.",
      "Nodes are pushed to the stack in alphabetical order.",
      "A node is pushed to the stack when DFS finishes exploring all its neighbors (i.e., at its post-visit step).",
      "Only leaves are pushed to the stack."
    ],
    correctAnswer: 2,
    explanation: "During the first DFS pass, vertices are pushed onto a stack when they finish exploration (post-visit order). This places vertices with later finishing times higher up in the stack."
  },
  {
    question: "What does 'transposing' a graph mean in Kosaraju's Algorithm?",
    options: [
      "Deleting all edges that form cycles.",
      "Reversing the direction of all directed edges in the graph.",
      "Converting the adjacency list into an adjacency matrix.",
      "Removing vertices that have no incoming edges."
    ],
    correctAnswer: 1,
    explanation: "Transposing a graph (commonly denoted as G^T) involves reversing the direction of every edge. If an edge goes from u -> v in G, it goes from v -> u in G^T."
  },
  {
    question: "In the second pass of Kosaraju's Algorithm, from where are the starting vertices chosen?",
    options: [
      "By popping nodes from the stack populated in the first pass.",
      "In increasing order of their numerical ID.",
      "By choosing nodes with the highest out-degree first.",
      "Arbitrarily from any unvisited node in the graph."
    ],
    correctAnswer: 0,
    explanation: "The second DFS pass runs on the transposed graph, picking starting nodes by popping them one by one from the stack created during the first pass. This ensures we start DFS on the sink components of the condensation graph first."
  },
  {
    question: "What is the key mathematical reason why reversing edges is necessary in Kosaraju's Algorithm?",
    options: [
      "Reversing edges turns the graph into an undirected graph, simplifying connectivity check.",
      "It keeps the Strongly Connected Components intact but reverses the topological order of components, preventing DFS from leaking between separate components.",
      "It reduces the time complexity of DFS from quadratic to linear.",
      "It removes all cycles from the graph."
    ],
    correctAnswer: 1,
    explanation: "Reversing the edges does not change the SCCs (if u and v are mutually reachable, they remain mutually reachable when all edges are reversed). However, it reverses the connectivity between different SCCs. This prevents DFS from leaking from one component to another during the second pass."
  },
  {
    question: "What is the time complexity of Kosaraju's Algorithm for a graph with V vertices and E edges?",
    options: [
      "O(V * E)",
      "O(V + E)",
      "O(V log V + E)",
      "O(V^2)"
    ],
    correctAnswer: 1,
    explanation: "The algorithm performs two DFS runs and a graph transposition, all of which run in linear time. Thus, the total time complexity is O(V + E) when using an adjacency list."
  },
  {
    question: "What is the space complexity of Kosaraju's Algorithm?",
    options: [
      "O(V)",
      "O(E)",
      "O(V + E)",
      "O(V^2)"
    ],
    correctAnswer: 2,
    explanation: "We need to store the transposed graph (which takes O(V + E) space using adjacency lists), the stack (O(V)), and the visited arrays (O(V)). Thus, the space complexity is O(V + E)."
  },
  {
    question: "How does Kosaraju's Algorithm compare to Tarjan's Algorithm for finding SCCs?",
    options: [
      "Kosaraju is asymptotically faster than Tarjan's.",
      "Tarjan's finds SCCs in a single DFS pass using a stack and tracking low-link values, whereas Kosaraju requires two passes and graph transposition. Both have O(V+E) time complexity.",
      "Kosaraju can handle negative weight edges, but Tarjan's cannot.",
      "Tarjan's only works on Directed Acyclic Graphs (DAGs)."
    ],
    correctAnswer: 1,
    explanation: "Both algorithms have O(V + E) time complexity. However, Tarjan's algorithm is often preferred in practice because it performs only one DFS pass and does not require transposing the graph, making it slightly faster and more memory-efficient."
  },
  {
    question: "Consider a directed graph with vertices: 0, 1, 2. The edges are: 0 -> 1, 1 -> 2, and 2 -> 0. How many Strongly Connected Components (SCCs) are in this graph?",
    options: [
      "1",
      "2",
      "3",
      "0"
    ],
    correctAnswer: 0,
    explanation: "Since there is a cycle containing all three nodes (0 -> 1 -> 2 -> 0), every node is reachable from every other node. Thus, the entire graph is a single Strongly Connected Component."
  },
  {
    question: "Consider a directed graph with 4 vertices: 0, 1, 2, 3. Edges: 0 -> 1, 1 -> 2, 2 -> 0, and 2 -> 3. How many Strongly Connected Components (SCCs) are in this graph?",
    options: [
      "1",
      "2",
      "3",
      "4"
    ],
    correctAnswer: 1,
    explanation: "Vertices 0, 1, 2 form a mutual cycle and are strongly connected. Node 3 has an incoming edge from 2 but cannot reach any of the other nodes. Thus, the SCCs are {0, 1, 2} and {3}, making a total of 2 SCCs."
  },
  {
    question: "What would happen if, in the second pass of Kosaraju's Algorithm, we ran DFS on the original graph G (instead of the transposed graph G^T) using the stack ordering?",
    options: [
      "The algorithm would still correctly identify all SCCs.",
      "The DFS would leak across components, potentially group multiple distinct SCCs into a single component, and yield incorrect results.",
      "The algorithm would go into an infinite loop.",
      "The time complexity would increase to O(V * E)."
    ],
    correctAnswer: 1,
    explanation: "If we don't reverse the edges, DFS can travel from a source component to a sink component, causing different SCCs to be merged incorrectly during the traversal. Reversing edges locks the traversal within each component."
  },
  {
    question: "If Kosaraju's Algorithm is run on a Directed Acyclic Graph (DAG) with V vertices, what will be the output?",
    options: [
      "A single Strongly Connected Component containing all V vertices.",
      "No Strongly Connected Components.",
      "V individual Strongly Connected Components, each containing exactly one vertex.",
      "The algorithm will fail or throw an error."
    ],
    correctAnswer: 2,
    explanation: "A DAG has no directed cycles. Since mutual reachability is impossible between distinct vertices in a DAG, each vertex is only mutually reachable with itself. Thus, the algorithm will output V individual SCCs, each containing one vertex."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Kosaraju's Algorithm Quiz"
      questions={questions}
    />
  );
}
