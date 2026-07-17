"use client";

import Link from "next/link";
import { ArrowLeft, Play, Type } from "lucide-react";
import { motion } from "framer-motion";

export default function PatternMatchingQuizClient() {
  const quizzes = [
    {
      title: "KMP Algorithm Quiz",
      description:
        "Practice KMP Algorithm concepts including LPS Array, preprocessing, efficient pattern matching, and time complexity.",
      href: "/visualizer/string/kmp-algorithm/quiz",
      filename: "kmp_algorithm_quiz.js",
    },
    {
      title: "Rabin-Karp Quiz",
      description:
        "Practice Rabin-Karp concepts including rolling hash, hash collisions, and efficient string searching.",
      href: "/visualizer/string/rabin-karp/quiz",
      filename: "rabin_karp_quiz.js",
    },
    {
      title: "Z Algorithm Quiz",
      description:
        "Practice Z Algorithm concepts including Z-array construction, prefix matching, and linear-time pattern searching.",
      href: "/visualizer/string/z-algorithm/quiz",
      filename: "z_algorithm_quiz.js",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-[var(--udemy-text)] dark:text-white transition-colors duration-300 pb-20">

      {/* Header */}
      <section className="relative pt-6 pb-4">
        <div className="max-w-[1100px] mx-auto px-4">

          <Link href="/visualizer/quiz">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:opacity-80 transition mb-3">
              <ArrowLeft size={16} />
              <span>Back to all quizzes</span>
            </button>
          </Link>

          <h1 className="text-3xl font-black mb-2">
            Pattern Matching Quiz Portal
          </h1>

          <p className="text-sm text-surface-600 dark:text-surface-400">
            Test your understanding of Pattern Matching algorithms through interactive quizzes.
          </p>

        </div>
      </section>

      {/* Quiz Cards */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">

          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              className="group flex flex-col h-full rounded-2xl border border-pink-500/20 bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >

              {/* Terminal Header */}
              <div className="px-4 py-2 bg-pink-500/10 border-b border-pink-500/20">
                <span className="font-mono text-xs">
                  $ node {quiz.filename}
                </span>
              </div>

              {/* Main Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">

                <div className="flex items-start gap-4 mb-6">

                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-pink-500/10 border border-pink-500/20 text-pink-600">
                    <Type size={24} />
                  </div>

                  <div>
                    <h2 className="text-[20px] font-extrabold text-surface-900 dark:text-white group-hover:text-pink-600 transition-colors">
                      {quiz.title}
                    </h2>

                    <p className="text-[14px] text-surface-500 dark:text-surface-400 font-medium">
                      Interactive Challenge
                    </p>
                  </div>

                </div>

                <p className="text-[14px] text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                  {quiz.description}
                </p>

                <Link href={quiz.href} className="block mt-auto w-full">
                  <button className="w-full h-11 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
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