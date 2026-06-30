"use client";

import Link from "next/link";

export default function SearchingQuizClient() {
  const quizzes = [
    {
      title: "Linear Search Quiz",
      description: "Practice Linear Search concepts.",
      href: "/visualizer/array/searching/quiz/linearsearch",
    },
    {
      title: "Binary Search Quiz",
      description: "Practice Binary Search concepts.",
      href: "/visualizer/array/searching/quiz/binarysearch",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        🔍 Searching Quiz
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.title}
            className="border rounded-xl p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-3">{quiz.title}</h2>

            <p className="mb-5">{quiz.description}</p>

            <Link href={quiz.href}>
              <button className="bg-purple-600 text-white px-5 py-2 rounded-lg">
                Start Quiz
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}