"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of the Bellman-Ford Algorithm?",
    options: [
      "To find the shortest paths between all pairs of vertices in a graph.",
      "To find the shortest paths from a single source vertex to all other vertices, allowing negative edge weights.",
      "To find the Minimum Spanning Tree of a weighted graph.",
      "To perform topological sorting on directed acyclic graphs."
    ],
    correctAnswer: 1,
    explanation: "The Bellman-Ford algorithm solves the single-source shortest path problem on weighted graphs and is capable of handling negative edge weights."
  },
  {
    question: "Why does the Bellman-Ford algorithm relax all edges exactly V - 1 times (where V is the number of vertices)?",
    options: [
      "A simple shortest path in a graph without negative weight cycles contains at most V - 1 edges.",
      "Each vertex must be relaxed once in each iteration.",
      "The maximum degree of any vertex in a connected graph is V - 1.",
      "The algorithm needs to visit every edge in topological order."
    ],
    correctAnswer: 0,
    explanation: "In any graph without negative weight cycles, the shortest path between any two vertices can have at most V - 1 edges. Each relaxation iteration guarantees that paths of length i edges are correctly solved."
  },
  {
    question: "How does the Bellman-Ford algorithm detect a negative weight cycle in a graph?",
    options: [
      "By checking if any of the edge weights are negative.",
      "By verifying if any vertex distance becomes negative during the first V - 1 passes.",
      "By performing a V-th relaxation pass; if any distance value decreases, a negative weight cycle exists.",
      "By tracking if a vertex is visited more than once during BFS traversal."
    ],
    correctAnswer: 2,
    explanation: "If we perform a V-th relaxation pass over all edges and find that any vertex distance can still be shortened (dist[u] + weight < dist[v]), a negative weight cycle is present."
  },
  {
    question: "What is the worst-case time complexity of the standard Bellman-Ford algorithm on a graph with V vertices and E edges?",
    options: [
      "O(V + E)",
      "O(E log V)",
      "O(V * E)",
      "O(V^3)"
    ],
    correctAnswer: 2,
    explanation: "The algorithm consists of an outer loop running V - 1 times and an inner loop relaxing all E edges, resulting in a worst-case time complexity of O(V * E)."
  },
  {
    question: "What is the auxiliary space complexity of the Bellman-Ford algorithm?",
    options: [
      "O(1)",
      "O(V)",
      "O(E)",
      "O(V^2)"
    ],
    correctAnswer: 1,
    explanation: "The algorithm only requires 1D arrays of size V to store the shortest distance estimate and predecessor node for each vertex, yielding O(V) auxiliary space."
  },
  {
    question: "Why can Dijkstra's algorithm fail on a graph with negative edge weights, whereas Bellman-Ford works correctly?",
    options: [
      "Dijkstra's greedily marks a node's distance as finalized once visited and does not re-evaluate it if a cheaper path involving a negative edge is found later.",
      "Dijkstra's algorithm cannot be used on directed graphs.",
      "Bellman-Ford uses a priority queue that supports negative numbers natively.",
      "Dijkstra's algorithm has an exponential time complexity when negative edges are present."
    ],
    correctAnswer: 0,
    explanation: "Dijkstra's is a greedy algorithm that finalizes distances upon extraction from the priority queue. It won't update a node's distance if a path containing negative weights is discovered afterwards. Bellman-Ford relaxes all edges repeatedly, ensuring all possible paths are evaluated."
  },
  {
    question: "In which scenario would Dijkstra's algorithm be preferred over the Bellman-Ford algorithm?",
    options: [
      "When the graph contains negative weight cycles.",
      "When all edge weights are guaranteed to be non-negative, as Dijkstra's has a better time complexity (O(E log V) with a Min-Heap).",
      "When space complexity is the primary constraint of the system.",
      "When the graph is completely disconnected."
    ],
    correctAnswer: 1,
    explanation: "If there are no negative weights, Dijkstra's algorithm (O(E log V) with Min-Heap) is significantly faster than Bellman-Ford (O(V * E))."
  },
  {
    question: "What does 'relaxing' an edge (u, v) with weight w mean in the Bellman-Ford algorithm?",
    options: [
      "Removing the edge if it forms a cycle in the tree.",
      "Setting dist[u] = dist[v] + w unconditionally.",
      "Updating dist[v] = min(dist[v], dist[u] + w) if dist[u] is not infinity.",
      "Converting the weight of the edge to a positive value."
    ],
    correctAnswer: 2,
    explanation: "Relaxing an edge checks if a shorter path to v exists via u. If dist[u] + w < dist[v] (and u is reachable), dist[v] is updated to this new value."
  },
  {
    question: "How does the order in which edges are relaxed in each iteration affect the correctness of the Bellman-Ford algorithm?",
    options: [
      "The final distance values will be incorrect if the edges are relaxed in the wrong order.",
      "It does not affect the correctness of the final distances, but it can affect the number of iterations required to converge.",
      "It only affects the detection of negative-weight cycles.",
      "The algorithm will enter an infinite loop if edges are not relaxed in topological order."
    ],
    correctAnswer: 1,
    explanation: "Regardless of edge relaxation order, the algorithm is guaranteed to find the correct shortest paths after V - 1 iterations. However, a favorable order can cause distances to converge in fewer iterations."
  },
  {
    question: "Consider a directed graph with 3 vertices: 0, 1, 2. The edges are: 0 -> 1 (weight 4), 0 -> 2 (weight 5), 1 -> 2 (weight -2). If the source node is 0, what are the final shortest distances to nodes 1 and 2?",
    options: [
      "dist[1] = 4, dist[2] = 5",
      "dist[1] = 4, dist[2] = 2",
      "dist[1] = 4, dist[2] = 3",
      "dist[1] = 2, dist[2] = 3"
    ],
    correctAnswer: 1,
    explanation: "Initially dist = [0, inf, inf]. Relaxing edges: 0 -> 1 sets dist[1] = 4. 0 -> 2 sets dist[2] = 5. Relaxing 1 -> 2 sets dist[2] = min(5, 4 - 2) = 2. A second pass yields no further changes. Hence, dist[1] = 4, dist[2] = 2."
  },
  {
    question: "What is a negative weight cycle, and why is it problematic for shortest path algorithms?",
    options: [
      "A cycle where all edges are negative, which makes graph representation impossible.",
      "A cycle where the sum of edge weights is negative, allowing a path to be infinitely shortened by traversing the cycle repeatedly.",
      "A cycle that contains a single negative edge, causing Dijkstra's algorithm to crash.",
      "A cycle that isolates vertices from the rest of the graph."
    ],
    correctAnswer: 1,
    explanation: "In a negative weight cycle, the sum of edge weights is less than 0. Repeatedly traversing the cycle reduces the path cost indefinitely, making a minimum shortest path undefined."
  },
  {
    question: "The Shortest Path Faster Algorithm (SPFA) is an optimization of Bellman-Ford. How does it improve performance on average?",
    options: [
      "By sorting the edges using a min-heap in each iteration.",
      "By using a queue to track only those vertices whose tentative distance has changed, avoiding redundant relaxation of all edges.",
      "By converting the graph into a DAG first.",
      "By completely skipping negative weight cycle detection."
    ],
    correctAnswer: 1,
    explanation: "SPFA uses a queue to keep track of candidate vertices whose distances have been updated. Only edges outgoing from these active vertices are relaxed, improving average performance to O(E)."
  },
  {
    question: "Why must we verify that dist[u] is not infinity (dist[u] !== Infinity) before relaxing an edge u -> v with weight w?",
    options: [
      "Adding a negative weight w to infinity would decrease it (inf - |w| < inf), leading to incorrect updates for unreachable nodes.",
      "Because performing arithmetic on infinity raises a runtime error.",
      "Because infinity cannot be represented in standard data structures.",
      "Because it indicates that node v has already been fully explored."
    ],
    correctAnswer: 0,
    explanation: "If dist[u] is infinity, u is unreachable. If we add a negative weight w to it, the value decreases, which could cause dist[v] to incorrectly update to a value less than infinity, even though v is actually unreachable."
  },
  {
    question: "Can Bellman-Ford be used to find the shortest path in an undirected graph with negative edge weights?",
    options: [
      "Yes, by treating every undirected edge as two directed edges with the same negative weight.",
      "No, because a negative undirected edge acts as a negative cycle of length 2 (u -> v -> u), making shortest paths undefined.",
      "Yes, but only if the graph has no other cycles.",
      "Yes, provided the negative weight edge is relaxed first."
    ],
    correctAnswer: 1,
    explanation: "In an undirected graph, a negative edge (u, v) with weight w creates a negative cycle of length 2 (u -> v -> u) with total weight 2w < 0. Thus, shortest paths are undefined."
  },
  {
    question: "If a weighted directed graph is guaranteed to be a Directed Acyclic Graph (DAG) and contains negative edge weights, what is the most efficient way to find single-source shortest paths?",
    options: [
      "Use the standard Bellman-Ford algorithm.",
      "Use Dijkstra's algorithm with a Fibonacci heap.",
      "Topologically sort the vertices, then relax all outgoing edges in topological order in O(V + E) time.",
      "Run the Floyd-Warshall algorithm."
    ],
    correctAnswer: 2,
    explanation: "For DAGs, single-source shortest paths can be found in O(V + E) by topologically sorting vertices and relaxing their edges in that order. This works even with negative edge weights and is faster than Bellman-Ford's O(V * E)."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Bellman-Ford Algorithm Quiz"
      questions={questions}
    />
  );
}
