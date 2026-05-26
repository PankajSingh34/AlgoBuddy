"use client";
import { useState } from "react";
import { FaAward } from "react-icons/fa";

const questions = [
  {
    question: "What is a major advantage of Decision Trees?",
    options: [
      "They always achieve 100% accuracy on test data",
      "They are highly interpretable and easy to understand",
      "They never overfit the training data",
      "They only work with numerical data"
    ],
    correctAnswer: 1,
    explanation: "Decision Trees are considered \"white-box\" models because their rules can be easily visualized and understood by humans."
  },
  {
    question: "What technique is commonly used to prevent a Decision Tree from overfitting?",
    options: ["Gradient Descent", "Backpropagation", "Pruning", "K-Means Clustering"],
    correctAnswer: 2,
    explanation: "Pruning reduces the size of decision trees by removing sections of the tree that provide little power to classify instances, thus preventing overfitting."
  },
  {
    question: "In a Decision Tree, what does a leaf node represent?",
    options: [
      "A test on an attribute",
      "The root of the tree",
      "The final decision or class label",
      "A missing value"
    ],
    correctAnswer: 2,
    explanation: "Leaf nodes (or terminal nodes) hold the final output label or continuous value prediction."
  }
];

export default function DecisionTreesQuiz() {
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Decision Trees Quiz</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Test your knowledge of Decision Tree algorithms.</p>
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
