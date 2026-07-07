"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";

const quizzes = [
  {
    title: "Heap (Min/Max) Quiz",
    description:
      "Practice concepts of Min Heap, Max Heap, insertion, deletion, and heap properties.",
    href: "/visualizer/tree/applications/quiz/heap-min-max",
  },
  {
    title: "Heap (Max) Quiz",
    description:
      "Test your understanding of Max Heap operations and applications.",
    href: "/visualizer/tree/applications/quiz/heap-max",
  },
  {
    title: "Heap Sort Quiz",
    description:
      "Practice Heap Sort algorithm, complexity, and implementation concepts.",
    href: "/visualizer/tree/applications/quiz/heap-sort",
  },
  {
    title: "Huffman Coding Quiz",
    description:
      "Learn Huffman Trees, optimal prefix codes, and compression techniques.",
    href: "/visualizer/tree/applications/quiz/huffman-coding",
  },
  {
    title: "Decision Trees Quiz",
    description:
      "Practice Decision Tree concepts used in Machine Learning and classification.",
    href: "/visualizer/tree/applications/quiz/decision-trees",
  },
  {
    title: "Syntax Trees Quiz",
    description:
      "Test your knowledge of Abstract Syntax Trees and expression parsing.",
    href: "/visualizer/tree/applications/quiz/syntax-trees",
  },
];

export default function TreeApplicationsQuizClient() {
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
            🌳 Tree Applications Quiz
          </h1>

          <p className="mt-3 text-muted-foreground">
            Practice real-world applications of Trees through interactive quizzes.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-emerald-500/20 bg-card p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Layers size={24} />
              </div>

              <h2 className="text-xl font-semibold">
                {quiz.title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {quiz.description}
              </p>

              <Link href={quiz.href}>
                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors">
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
