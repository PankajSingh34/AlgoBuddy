"use client";
import { useState } from "react";
import { FaAward } from "react-icons/fa";

const questions = [
  {
    question: "What is the time complexity of Heap Sort in the worst case?",
    options: ["O(N)", "O(log N)", "O(N log N)", "O(N^2)"],
    correctAnswer: 2,
    explanation: "Heap Sort always takes O(N log N) time because the heapify process takes O(log N) and it is called N times."
  },
  {
    question: "Which of the following properties is true about Heap Sort?",
    options: [
      "It is a stable sorting algorithm",
      "It requires O(N) extra space",
      "It is an in-place sorting algorithm",
      "It is slower than Bubble Sort"
    ],
    correctAnswer: 2,
    explanation: "Heap sort is an in-place sorting algorithm and requires O(1) extra space. However, it is not stable."
  },
  {
    question: "When sorting an array in ascending order using Heap Sort, which type of heap is used?",
    options: [
      "Min-Heap",
      "Max-Heap",
      "Binary Search Tree",
      "Fibonacci Heap"
    ],
    correctAnswer: 1,
    explanation: "A Max-Heap is built so that the largest element is at the root. We swap it with the last element and reduce the heap size to sort the array in ascending order."
  }
];

export default function HeapSortQuiz() {
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Heap Sort Quiz</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Test your understanding of the Heap Sort algorithm.</p>
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
