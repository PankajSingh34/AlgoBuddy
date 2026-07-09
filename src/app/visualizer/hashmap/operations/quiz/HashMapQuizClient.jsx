"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";

const quizzes = [
  {
    title: "Insert (put) Quiz",
    description:
      "Practice inserting key-value pairs into a HashMap using the put() operation.",
    href: "/visualizer/hashmap/operations/quiz/insert",
  },
  {
    title: "Search (get) Quiz",
    description:
      "Test your understanding of retrieving values using the get() operation.",
    href: "/visualizer/hashmap/operations/quiz/search",
  },
  {
    title: "Delete (remove) Quiz",
    description:
      "Practice removing key-value pairs using the remove() operation.",
    href: "/visualizer/hashmap/operations/quiz/delete",
  },
];

export default function HashMapQuizClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold">#️⃣ HashMap Quiz</h1>

          <p className="mt-3 text-muted-foreground">
            Practice HashMap operations through interactive quizzes.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-violet-500/20 bg-card p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                <Database size={24} />
              </div>

              <h2 className="text-xl font-semibold">{quiz.title}</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {quiz.description}
              </p>

              <Link href={quiz.href}>
                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-violet-700">
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