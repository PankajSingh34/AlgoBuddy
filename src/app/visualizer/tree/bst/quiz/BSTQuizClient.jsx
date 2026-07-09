"use client";

import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";

const quizzes = [
  {
    title: "BST Insertion Quiz",
    description:
      "Practice inserting nodes into a Binary Search Tree while maintaining BST properties.",
    href: "/visualizer/tree/bst/quiz/insertion",
  },
  {
    title: "BST Deletion Quiz",
    description:
      "Test your understanding of deleting leaf nodes, nodes with one child, and nodes with two children.",
    href: "/visualizer/tree/bst/quiz/deletion",
  },
  {
    title: "BST Searching Quiz",
    description:
      "Assess your knowledge of searching elements efficiently in a Binary Search Tree.",
    href: "/visualizer/tree/bst/quiz/searching",
  },
  {
    title: "In-order Traversal Quiz",
    description:
      "Practice In-order traversal and understand why it produces sorted output in a BST.",
    href: "/visualizer/tree/bst/quiz/inorder",
  },
  {
    title: "Pre-order Traversal Quiz",
    description:
      "Test your understanding of Pre-order traversal and its applications.",
    href: "/visualizer/tree/bst/quiz/preorder",
  },
  {
    title: "Post-order Traversal Quiz",
    description:
      "Practice Post-order traversal and learn where it is commonly used.",
    href: "/visualizer/tree/bst/quiz/postorder",
  },
  {
    title: "AVL Balancing Quiz",
    description:
      "Challenge yourself with AVL Tree balancing, rotations, and height-balanced BST concepts.",
    href: "/visualizer/tree/bst/quiz/avl",
  },
];

export default function BSTQuizClient() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            🌲 Binary Search Tree Quiz Portal
          </h1>
          <p className="mt-3 text-muted-foreground">
            Choose a Binary Search Tree topic and test your understanding.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.title}
              className="rounded-2xl border border-emerald-500/20 bg-card p-6 shadow-sm transition-all hover:border-emerald-500/40 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Layers size={28} />
              </div>

              <h2 className="text-xl font-semibold">{quiz.title}</h2>

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