"use client";
import { useState } from "react";
import { FaAward } from "react-icons/fa";

const questions = [
  {
    question: "Can two trees with different node values still be isomorphic?",
    options: [
      "Yes, if the structure matches",
      "No, values must match exactly",
      "Only if they are both binary search trees",
      "Only if the trees are balanced"
    ],
    correctAnswer: 0,
    explanation: "Tree isomorphism depends on structure, so values can differ."
  },
  {
    question: "What operation may be needed to compare two trees for isomorphism?",
    options: [
      "Swapping left and right children",
      "Rotating the tree",
      "Rebalancing the tree",
      "Reversing the node values"
    ],
    correctAnswer: 0,
    explanation: "Structural equivalence may require swapping children at some nodes."
  }
];

export default function IsomorphismQuiz() {
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
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200">
            <FaAward className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Isomorphism Quiz</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Verify your understanding of tree structure matching.</p>
          <button onClick={() => setShowIntro(false)} className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-white shadow-sm hover:bg-violet-700">
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
        <button onClick={resetQuiz} className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-white shadow-sm hover:bg-violet-700">
          Try again
        </button>
      </section>
    );
  }

  const current = questions[currentQuestion];

  return (
    <section className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-neutral-950">
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">Question {currentQuestion + 1} of {questions.length}</div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{current.question}</h3>
      <div className="mt-6 space-y-3">
        {current.options.map((option, index) => (
          <button
            key={option}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
              selectedAnswer === index ? "border-violet-500 bg-violet-50 dark:bg-violet-900/50" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
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
          className="rounded-full bg-violet-600 px-6 py-3 text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-violet-700"
        >
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </section>
  );
}
