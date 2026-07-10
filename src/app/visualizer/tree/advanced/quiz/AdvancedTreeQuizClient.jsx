"use client";

import Link from "next/link";
import { Trees, ArrowRight } from "lucide-react";

const quizzes = [
  {
    title: "AVL Tree Quiz",
    description:
      "Test your knowledge of AVL Trees, rotations, balancing factors, and self-balancing operations.",
    href: "/visualizer/tree/advanced/quiz/avl",
  },
  {
    title: "Red-Black Tree Quiz",
    description:
      "Practice Red-Black Tree properties, coloring rules, rotations, and balancing operations.",
    href: "/visualizer/tree/advanced/quiz/red-black",
  },
  {
    title: "B-Tree Quiz",
    description:
      "Learn B-Tree insertion, deletion, search, node splitting, and disk-based indexing concepts.",
    href: "/visualizer/tree/advanced/quiz/b-tree",
  },
  {
    title: "B+ Tree Quiz",
    description:
      "Practice B+ Tree structure, leaf node organization, indexing, and range query concepts.",
    href: "/visualizer/tree/advanced/quiz/b-plus-tree",
  },
  {
    title: "Segment Tree Quiz",
    description:
      "Test your understanding of Segment Trees for efficient range queries and updates.",
    href: "/visualizer/tree/advanced/quiz/segment-tree",
  },
  {
    title: "Fenwick Tree Quiz",
    description:
      "Practice Binary Indexed Tree (Fenwick Tree) operations, prefix sums, and updates.",
    href: "/visualizer/tree/advanced/quiz/fenwick-tree",
  },
  {
    title: "Trie Quiz",
    description:
      "Learn Trie insertion, searching, prefix matching, and autocomplete operations.",
    href: "/visualizer/tree/advanced/quiz/trie",
  },
  {
    title: "Heap Tree Quiz",
    description:
      "Practice Heap properties, insertion, deletion, heapify, and priority queue concepts.",
    href: "/visualizer/tree/advanced/quiz/heap-tree",
  },
];

export default function AdvancedTreeQuizClient() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            🌲 Advanced Tree Quiz Portal
          </h1>

          <p className="mt-3 text-muted-foreground">
            Select an Advanced Tree topic and test your understanding.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.title}
              className="rounded-2xl border border-emerald-500/20 bg-card p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
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
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700"
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