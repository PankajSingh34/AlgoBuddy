"use client";

import Link from "next/link";
import { ArrowLeft, Play, Type } from "lucide-react";
import { motion } from "framer-motion";

export default function StringQuizClient() {
  const quizzes = [
    {
      title: "Reverse String Quiz",
      description:
        "Practice Reverse String concepts, string manipulation techniques, two-pointer approach, and time complexities.",
      href: "/visualizer/string/reverse-string/quiz",
      filename: "reverse_string_quiz.js",
    },
    {
      title: "Palindrome Check Quiz",
      description:
        "Practice Palindrome Check concepts, two-pointer technique, string comparison, and edge cases.",
      href: "/visualizer/string/palindrome-check/quiz",
      filename: "palindrome_check_quiz.js",
    },
    {
      title: "Character Frequency Quiz",
      description:
        "Practice Character Frequency using maps, hashing, and frequency counting.",
      href: "/visualizer/string/character-frequency/quiz",
      filename: "character_frequency_quiz.js",
    },
    {
      title: "Longest Common Prefix Quiz",
      description:
        "Practice Longest Common Prefix concepts, prefix matching, and string comparison.",
      href: "/visualizer/string/longest-common-prefix/quiz",
      filename: "longest_common_prefix_quiz.js",
    },
    {
      title: "Anagram Check Quiz",
      description:
        "Practice Anagram Check concepts using sorting, hashing, and frequency comparison.",
      href: "/visualizer/string/anagram-check/quiz",
      filename: "anagram_check_quiz.js",
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
            String Quiz Portal
          </h1>

          <p className="text-sm text-surface-600 dark:text-surface-400">
            Test your understanding of String algorithms through interactive quizzes.
          </p>

        </div>
      </section>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-4 mt-8">

        <div className="grid md:grid-cols-2 gap-6 items-stretch">

          {quizzes.map((quiz, index) => (

            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.985,
              }}
              className="group flex flex-col h-full rounded-2xl border border-pink-500/20 dark:border-pink-500/30 bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-xl transition-all duration-300"
            >

              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-pink-500/10 dark:bg-pink-500/20 border-b border-pink-500/20 dark:border-pink-500/30">

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-pink-500 font-bold">$</span>
                  <span>node {quiz.filename}</span>
                </div>

              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">

                <div>

                  <div className="flex items-center gap-4 mb-4">

                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">

                      <Type
                        size={24}
                        className="text-pink-600 dark:text-pink-400"
                      />

                    </div>

                    <div>

                      <h2 className="text-xl font-bold group-hover:text-pink-600 transition">

                        {quiz.title}

                      </h2>

                      <p className="text-sm text-surface-500 dark:text-surface-400">

                        Interactive Challenge

                      </p>

                    </div>

                  </div>

                  <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">

                    {quiz.description}

                  </p>

                </div>

                <Link
                  href={quiz.href}
                  className="block mt-6"
                >

                  <button className="w-full h-11 rounded-xl bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white font-bold flex items-center justify-center gap-2 transition">

                    <span>Start Quiz</span>

                    <Play
                      size={15}
                      className="fill-current"
                    />

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