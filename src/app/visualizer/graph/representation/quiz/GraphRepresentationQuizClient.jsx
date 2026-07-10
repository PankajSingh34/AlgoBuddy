"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Network } from "lucide-react";

const quizzes = [
  {
    title: "Adjacency Matrix Quiz",
    description:
      "Practice graph representation using Adjacency Matrix, its properties, implementation, and complexity.",
    href: "/visualizer/graph/representation/quiz/adjacency-matrix",
  },
  {
    title: "Adjacency List Quiz",
    description:
      "Test your understanding of Adjacency List representation, traversal, memory usage, and applications.",
    href: "/visualizer/graph/representation/quiz/adjacency-list",
  },
];

export default function GraphRepresentationQuizClient() {
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
            📊 Graph Representation Quiz
          </h1>

          <p className="mt-3 text-muted-foreground">
            Practice Graph Representation concepts through interactive quizzes.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-cyan-500/20 bg-card p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                <Network size={24} />
              </div>

              <h2 className="text-xl font-semibold">
                {quiz.title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {quiz.description}
              </p>

              <Link href={quiz.href}>
                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-cyan-700">
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