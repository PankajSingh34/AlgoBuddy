"use client";

import Link from "next/link";

export default function StackQuizClient() {
  const quizzes = [
    {
      title: "Push & Pop Quiz",
      href: "/visualizer/stack/quiz/push-pop",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Peek Quiz",
      href: "/visualizer/stack/quiz/peek",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Is Empty Quiz",
      href: "/visualizer/stack/quiz/isempty",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Is Full Quiz",
      href: "/visualizer/stack/quiz/isfull",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-8">
      <h1 className="text-5xl font-bold text-center mb-4">
        📚 Stack Operations Quiz
      </h1>

      <p className="text-center text-gray-500 mb-10">
        Choose a Stack Operations quiz to test your understanding.
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