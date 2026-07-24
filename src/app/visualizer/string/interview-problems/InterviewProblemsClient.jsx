"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function InterviewProblemsClient() {
  const quizzes = [
    {
      title: "Longest Substring Without Repeating Characters",
      description:
        "Practice the classic Sliding Window interview problem.",
      href: "/visualizer/string/longest-substring/quiz",
    },
    {
      title: "Minimum Window Substring",
      description:
        "Practice one of the most frequently asked Sliding Window interview problems.",
      href: "/visualizer/string/minimum-window-substring/quiz",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-2">
        String Interview Problems
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Practice the most frequently asked String interview questions.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.title}
            href={quiz.href}
            className="rounded-xl border border-pink-500/20 bg-white dark:bg-neutral-900 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              {quiz.description}
            </p>

            <div className="mt-6">
                <button
                    className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 text-white py-4 font-semibold transition-all duration-200"
                >
                    Start Quiz ▶
                </button>
                </div>
          </Link>
        ))}
      </div>
    </div>
  );
}