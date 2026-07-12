"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Network } from "lucide-react";

const quizzes = [
  {
    title: "Dijkstra's Algorithm Quiz",
    description:
      "Practice shortest path concepts, priority queue usage, complexity, and applications of Dijkstra's Algorithm.",
    href: "/visualizer/graph/algorithms/quiz/dijkstra",
  },
  {
    title: "Bellman-Ford Algorithm Quiz",
    description:
      "Test your understanding of single-source shortest paths, edge relaxation, V-1 iterations, and negative weight cycle detection.",
    href: "/visualizer/graph/algorithms/quiz/bellman-ford",
  },
  {
    title: "Floyd-Warshall Algorithm Quiz",
    description:
      "Test your understanding of all-pairs shortest paths, dynamic programming, and Floyd-Warshall Algorithm.",
    href: "/visualizer/graph/algorithms/quiz/floyd-warshall",
  },
  {
    title: "Prim's Algorithm Quiz",
    description:
      "Practice Minimum Spanning Tree construction using Prim's Algorithm and greedy strategy.",
    href: "/visualizer/graph/algorithms/quiz/prim",
  },
  {
    title: "Kruskal's Algorithm Quiz",
    description:
      "Learn edge sorting, Union-Find, Minimum Spanning Trees, and Kruskal's Algorithm.",
    href: "/visualizer/graph/algorithms/quiz/kruskal",
  },
  {
    title: "Topological Sort Quiz",
    description:
      "Practice DAG traversal, ordering of vertices, Kahn's Algorithm, and DFS-based Topological Sort.",
    href: "/visualizer/graph/algorithms/quiz/topological-sort",
  },
  {
    title: "Kosaraju's Algorithm Quiz",
    description:
      "Test your understanding of strongly connected components (SCCs), double DFS passes, graph transposition, and complexities.",
    href: "/visualizer/graph/algorithms/quiz/kosaraju",
  },
];

export default function GraphAlgorithmsQuizClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold">
            📈 Graph Algorithms Quiz
          </h1>

          <p className="mt-3 text-muted-foreground">
            Practice Graph Algorithms through interactive quizzes.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-indigo-500/20 bg-card p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <Network size={24} />
              </div>

              <h2 className="text-xl font-semibold">
                {quiz.title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {quiz.description}
              </p>

              <Link href={quiz.href}>
                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700">
                  <span>Start Quiz</span>
                  <ArrowRight size={18} />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}