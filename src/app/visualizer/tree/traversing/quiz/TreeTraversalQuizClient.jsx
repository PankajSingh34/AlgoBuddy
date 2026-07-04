"use client";

import Link from "next/link";
import { ArrowRight, Trees } from "lucide-react";

const quizzes = [
  {
    title: "Pre-order Traversal Quiz",
    description:
      "Practice Root → Left → Right traversal and understand its applications.",
    href: "/visualizer/tree/traversing/quiz/preorder",
  },
  {
    title: "In-order Traversal Quiz",
    description:
      "Practice Left → Root → Right traversal and learn how BSTs produce sorted output.",
    href: "/visualizer/tree/traversing/quiz/inorder",
  },
  {
    title: "Post-order Traversal Quiz",
    description:
      "Test your knowledge of Left → Right → Root traversal and tree deletion.",
    href: "/visualizer/tree/traversing/quiz/postorder",
  },
  {
    title: "Level-order Traversal Quiz",
    description:
      "Learn Breadth-First Search (BFS) and level-wise traversal using queues.",
    href: "/visualizer/tree/traversing/quiz/levelorder",
  },
];

export default function TreeTraversalQuizClient() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            🌳 Tree Traversal Quiz
          </h1>

          <p className="mt-3 text-muted-foreground">
            Select a traversal algorithm and test your understanding.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.title}
              className="rounded-2xl border border-green-500/20 bg-card p-6 shadow-sm transition-all hover:border-green-500/40 hover:shadow-lg"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                <Trees size={28} />
              </div>

              <h2 className="text-xl font-semibold">
                {quiz.title}
              </h2>

              <p className="mt-3 text-sm text-muted-foreground">
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