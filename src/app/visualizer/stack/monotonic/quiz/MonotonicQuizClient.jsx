"use client";

import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function MonotonicQuizClient() {
  const quizzes = [
    {
      title: "Largest Rectangle in Histogram Quiz",
      description: "Practice the Largest Rectangle in Histogram problem using Monotonic Stack, tracking heights and widths.",
      href: "/visualizer/stack/monotonic/quiz/histogram",
      filename: "largest_rectangle_histogram_quiz.js",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-[var(--udemy-text)] dark:text-white transition-colors duration-300 pb-20">
      
      {/* Header / Hero */}
      <section className="relative pt-6 pb-4">
        <div className="max-w-[1100px] mx-auto px-4">
          <Link href="/visualizer/quiz">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:opacity-85 transition-opacity mb-3">
              <ArrowLeft size={16} />
              <span>Back to all quizzes</span>
            </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black mb-2">
            Monotonic Stack Quiz Portal
          </h1>
          <p className="text-[14px] text-surface-600 dark:text-surface-400 font-medium">
            Choose a Monotonic Stack quiz to test your understanding of algorithmic optimization concepts.
          </p>
        </div>
      </section>

      {/* Grid of Sub-quizzes */}
      <div className="max-w-xl mx-auto px-4 mt-8">
        <div className="grid gap-6 items-stretch">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="group flex flex-col h-full rounded-2xl border border-teal-500/20 dark:border-teal-500/30 bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Terminal command execution style top bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-teal-500/10 dark:bg-teal-500/20 border-b border-teal-500/20 dark:border-teal-500/30">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-surface-600 dark:text-surface-300">
                  <span className="text-violet-500 font-bold">$</span>
                  <span>node {quiz.filename}</span>
                </div>
              </div>

              {/* Main Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-[20px] font-extrabold text-surface-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2">
                    {quiz.title}
                  </h2>
                  <p className="text-[14px] text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                    {quiz.description}
                  </p>
                </div>

                <Link href={quiz.href} className="block mt-auto w-full">
                  <button className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
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