"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, X } from "lucide-react";

export default function QuizPage() {
  const quizzes = [
    {
      title: "Searching Quiz",
      description: "Practice Linear Search and Binary Search.",
      href: "/visualizer/array/searching/quiz",
      color: "bg-cyan-600 hover:bg-cyan-700",
    },
    {
      title: "Sorting Quiz",
      description: "Practice all sorting algorithms including Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, and Counting Sort.",
      href: "/visualizer/array/sorting/quiz",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
        title: "Recursion Quiz",
        description: "Practice all recursion topics.",
        href: "/visualizer/recursion/quiz",
        color: "bg-violet-600 hover:bg-violet-700",
      },
    {
      title: "Stack Operations Quiz",
      description:"Test your understanding of Push & Pop, Peek, Is Empty, and Is Full operations.",
      href: "/visualizer/stack/quiz",
      color: "bg-violet-600 hover:bg-violet-700",
    },
    {
      title: "Polish Notation Evaluation Quiz",
      description:
        "Test your understanding of Prefix and Postfix Expression Evaluation.",
      href: "/visualizer/stack/polish/quiz",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "Implementation Quiz",
      description:
        "Practice Stack implementation using Array and Linked List.",
      href: "/visualizer/stack/implementation/quiz",
      color: "bg-emerald-600 hover:bg-emerald-700",
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-8">
      <h1 className="text-5xl font-bold text-center mb-4">
        🎯 Quiz Mode
      </h1>

      <p className="text-center text-gray-500 mb-6">
  Choose an algorithm quiz to test your understanding.
</p>

<div className="relative max-w-2xl mx-auto mb-10">
  <Search
    size={20}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
  />

  <input
    type="text"
    placeholder="Search quizzes..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-12 pr-12 py-3 border rounded-xl shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500
               dark:bg-[#2b2b2b] dark:border-gray-700"
  />

  {searchQuery && (
    <button
      type="button"
      onClick={() => setSearchQuery("")}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <X size={18} />
    </button>
  )}
</div>

      <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
  {filteredQuizzes.length > 0 ? (
    filteredQuizzes.map((quiz) => (
      <div
        key={quiz.title}
        className="border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
      >
        <h2 className="text-3xl font-semibold mb-4">
          📘 {quiz.title}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {quiz.description}
        </p>

        <Link href={quiz.href}>
          <button
            className={`text-white px-6 py-3 rounded-lg font-semibold ${quiz.color}`}
          >
            Start Quiz
          </button>
        </Link>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center py-12">
      <p className="text-xl text-gray-500 dark:text-gray-400">
        No quizzes found.
      </p>
    </div>
  )}
</div>
    </div>
  );
}