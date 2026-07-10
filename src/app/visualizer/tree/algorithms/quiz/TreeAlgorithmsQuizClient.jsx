"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";

const quizzes = [
  {
    title: "Lowest Common Ancestor Quiz",
    description: "Practice Lowest Common Ancestor (LCA) concepts.",
    href: "/visualizer/tree/algorithms/quiz/lowest-common-ancestor",
  },
  {
    title: "Diameter of Binary Tree Quiz",
    description: "Test your understanding of Diameter algorithms.",
    href: "/visualizer/tree/algorithms/quiz/diameter",
  },
  {
    title: "Height of Tree Quiz",
    description: "Practice height calculation algorithms.",
    href: "/visualizer/tree/algorithms/quiz/height",
  },
  {
    title: "Tree Views Quiz",
    description: "Learn Left, Right, Top and Bottom Views.",
    href: "/visualizer/tree/algorithms/quiz/tree-views",
  },
  {
    title: "Boundary Traversal Quiz",
    description: "Practice Boundary Traversal concepts.",
    href: "/visualizer/tree/algorithms/quiz/boundary-traversal",
  },
  {
    title: "Vertical Order Traversal Quiz",
    description: "Practice Vertical Order Traversal algorithms.",
    href: "/visualizer/tree/algorithms/quiz/vertical-order",
  },
  {
    title: "Zigzag Traversal Quiz",
    description: "Test Zigzag (Spiral) Traversal concepts.",
    href: "/visualizer/tree/algorithms/quiz/zigzag",
  },
  {
    title: "Morris Traversal Quiz",
    description: "Practice Morris Traversal algorithms.",
    href: "/visualizer/tree/algorithms/quiz/morris",
  },
  {
    title: "Serialization & Deserialization Quiz",
    description: "Practice tree serialization concepts.",
    href: "/visualizer/tree/algorithms/quiz/serialization",
  },
];

export default function TreeAlgorithmsQuizClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold">
            🌳 Tree Algorithms Quiz
          </h1>

          <p className="mt-3 text-muted-foreground">
            Strengthen your understanding of common Tree Algorithms through
            interactive quizzes.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-green-500/20 bg-card p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                <GitBranch size={24} />
              </div>

              <h2 className="text-xl font-semibold">
                {quiz.title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {quiz.description}
              </p>

              <Link href={quiz.href}>
                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 transition-colors">
                  Start Quiz
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