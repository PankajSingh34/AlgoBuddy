"use client";

import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";

const quizzes = [
  {
    title: "Structure & Properties Quiz",
    description:
      "Practice Binary Tree structure, nodes, height, depth, levels, and fundamental properties.",
    href: "/visualizer/tree/binaryTree/quiz/structure-properties",
  },
  {
    title: "Types of Binary Trees Quiz",
    description:
      "Test your understanding of Full, Complete, Perfect, Balanced, Degenerate, and other Binary Tree types.",
    href: "/visualizer/tree/binaryTree/quiz/types",
  },
];

export default function BinaryTreeQuizClient() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            🌳 Binary Tree Quiz Portal
          </h1>
          <p className="mt-3 text-muted-foreground">
            Choose a Binary Tree topic and test your understanding.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.title}
              className="rounded-2xl border border-green-500/20 bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-green-500/40"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                <Layers size={28} />
              </div>

              <h2 className="text-2xl font-semibold">
                {quiz.title}
              </h2>

              <p className="mt-3 text-muted-foreground">
                {quiz.description}
              </p>

              <Link
                href={quiz.href}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
              >
                Start Quiz
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}