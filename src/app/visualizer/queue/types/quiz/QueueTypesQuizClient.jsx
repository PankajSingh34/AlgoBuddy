"use client";

import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function QueueTypesQuizClient() {
  const quizzes = [
    {
      title: "Single Ended Queue Quiz",
      description:
        "Practice the basic FIFO queue with insertion at the rear and deletion from the front.",
      href: "/visualizer/queue/types/quiz/single-ended",
      filename: "single_ended_queue_quiz.js",
    },
    {
      title: "Double Ended Queue Quiz",
      description:
        "Practice insertion and deletion from both ends using a deque.",
      href: "/visualizer/queue/types/quiz/double-ended",
      filename: "deque_quiz.js",
    },
    {
      title: "Circular Queue Quiz",
      description:
        "Practice circular queue concepts including wrap-around indexing and efficient memory utilization.",
      href: "/visualizer/queue/types/quiz/circular",
      filename: "circular_queue_quiz.js",
    },
    {
      title: "Priority Queue Quiz",
      description:
        "Practice priority-based queue operations and heap-based implementations.",
      href: "/visualizer/queue/types/quiz/priority",
      filename: "priority_queue_quiz.js",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-[var(--udemy-text)] dark:text-white transition-colors duration-300 pb-20">

      {/* Header */}
      <section className="relative pt-6 pb-4">
        <div className="max-w-[1100px] mx-auto px-4">
          <Link href="/visualizer/quiz">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:opacity-80 mb-3">
              <ArrowLeft size={16} />
              <span>Back to all quizzes</span>
            </button>
          </Link>

          <h1 className="text-2xl md:text-3xl font-black mb-2">
            Queue Types Quiz Portal
          </h1>

          <p className="text-sm text-surface-600 dark:text-surface-400">
            Choose a Queue Types quiz to strengthen your understanding of different queue implementations.
          </p>
        </div>
      </section>

      {/* Quiz Cards */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="group flex flex-col rounded-2xl border border-indigo-500/20 dark:border-indigo-500/30 bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-500/10 dark:bg-indigo-500/20 border-b border-indigo-500/20 dark:border-indigo-500/30">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-violet-500">$</span>
                  <span>node {quiz.filename}</span>
                </div>
              </div>

              {/* Card */}
              <div className="p-6 flex flex-col flex-1">
                <div>
                  <h2 className="text-xl font-extrabold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {quiz.title}
                  </h2>

                  <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">
                    {quiz.description}
                  </p>
                </div>

                <Link href={quiz.href} className="mt-auto">
                  <button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2">
                    <span>Start Quiz</span>
                    <Play size={14} className="fill-current" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}