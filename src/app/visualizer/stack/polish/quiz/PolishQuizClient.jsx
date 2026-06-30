"use client";

import Link from "next/link";

export default function PolishQuizClient() {
  const quizzes = [
    {
      title: "Postfix Quiz",
      description:
        "Test your understanding of Postfix Expression Evaluation.",
      href: "/visualizer/stack/polish/quiz/postfix",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Prefix Quiz",
      description:
        "Test your understanding of Prefix Expression Evaluation.",
      href: "/visualizer/stack/polish/quiz/prefix",
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-8">
      <h1 className="text-5xl font-bold text-center mb-4">
        📚 Polish Notation Evaluation Quiz
      </h1>

      <p className="text-center text-gray-500 mb-10">
        Choose a quiz to test your understanding of Polish Notation Evaluation.
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