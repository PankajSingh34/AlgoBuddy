"use client";
import { useState } from "react";
import { FaAward } from "react-icons/fa";

const questions = [
  {
    question: "Why are null markers important during tree serialization?",
    options: [
      "They reduce the string length",
      "They preserve the exact tree structure",
      "They make the tree balanced",
      "They speed up traversal"
    ],
    correctAnswer: 1,
    explanation: "Null markers ensure the serialized output can be decoded back into the original tree shape."
  },
  {
    question: "Which traversal order is standard for deterministic tree serialization?",
    options: [
      "Pre-order",
      "In-order",
      "Post-order",
      "Level-order"
    ],
    correctAnswer: 0,
    explanation: "Pre-order is commonly used because it serializes the root before its children, making reconstruction straightforward."
  }
];

export default function SerializationQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleAnswerSelect = (index) => setSelectedAnswer(index);

  const handleNext = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setShowIntro(true);
    setShowResult(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
  };

  if (showIntro) {
    return (
      <section className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-neutral-950">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200">
            <FaAward className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Serialization Quiz</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Confirm that you understand serialize and deserialize mechanics.</p>
          <button onClick={() => setShowIntro(false)} className="mt-6 rounded-full bg-sky-600 px-6 py-3 text-white shadow-sm hover:bg-sky-700">
            Start Quiz
          </button>
        </div>
      </section>
    );
  }

  if (showResult) {
    return (
      <section className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Complete</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400">You scored {score} out of {questions.length}.</p>
        <button onClick={resetQuiz} className="mt-6 rounded-full bg-sky-600 px-6 py-3 text-white shadow-sm hover:bg-sky-700">
          Try again
        </button>
      </section>
    );
  }

  const current = questions[currentQuestion];

  return (
    <section className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-neutral-950">
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Question {currentQuestion + 1} of {questions.length}</div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{current.question}</h3>
      <div className="mt-6 space-y-3">
        {current.options.map((option, index) => (
          <button
            key={option}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
              selectedAnswer === index ? "border-sky-500 bg-sky-50 dark:bg-sky-900/50" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="rounded-full bg-sky-600 px-6 py-3 text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-sky-700"
        >
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </section>
  );
}
