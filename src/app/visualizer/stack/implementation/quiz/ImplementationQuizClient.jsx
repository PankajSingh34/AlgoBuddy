"use client";

import Link from "next/link";

const quizzes = [
  {
    title: "Stack Using Array Quiz",
    description: "Practice stack implementation using arrays.",
    href: "/visualizer/stack/implementation/quiz/array",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Stack Using Linked List Quiz",
    description: "Practice stack implementation using linked lists.",
    href: "/visualizer/stack/implementation/quiz/linked-list",
    color: "bg-green-600 hover:bg-green-700",
  },
];

export default function ImplementationQuizClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-8">
      <h1 className="text-5xl font-bold text-center mb-4">
        🛠️ Implementation Quiz
      </h1>

      <p className="text-center text-gray-500 mb-10">
        Choose a Stack implementation quiz to test your understanding.
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {quizzes.map((quiz) => (
          <div
            key={quiz.title}
            className="border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-4">
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
        ))}
      </div>
    </div>
  );
}