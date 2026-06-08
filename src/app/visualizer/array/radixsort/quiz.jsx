"use client";
import React, { useState } from "react";

const questions = [
  {
    question: "What makes Radix Sort fundamentally different from algorithms like Merge Sort or Quick Sort?",
    options: [
      "It sorts in descending order by default.",
      "It never uses extra memory.",
      "It does not compare elements directly against each other.",
      "It only works on arrays of length 2^n.",
    ],
    answer: "It does not compare elements directly against each other.",
  },
  {
    question: "In LSD Radix Sort, which digit position is processed first?",
    options: [
      "The most significant digit (leftmost).",
      "The middle digit.",
      "The least significant digit (rightmost / ones place).",
      "A random digit chosen each pass.",
    ],
    answer: "The least significant digit (rightmost / ones place).",
  },
  {
    question: "What is the time complexity of Radix Sort?",
    options: [
      "O(n log n)",
      "O(n²)",
      "O(d × (n + k)) where d = digit count, k = base",
      "O(n) regardless of input",
    ],
    answer: "O(d × (n + k)) where d = digit count, k = base",
  },
  {
    question: "How many buckets does decimal Radix Sort use per pass?",
    options: ["2", "8", "10", "16"],
    answer: "10",
  },
  {
    question: "Why must the subroutine (e.g. Counting Sort) used inside Radix Sort be stable?",
    options: [
      "To reduce memory usage.",
      "To ensure elements with the same digit keep their relative order from prior passes.",
      "To sort negative numbers correctly.",
      "To guarantee O(n) space usage.",
    ],
    answer: "To ensure elements with the same digit keep their relative order from prior passes.",
  },
];

const RadixSortQuiz = () => {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx, option) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qIdx]: option }));
  };

  const score = submitted
    ? questions.filter((q, i) => selected[i] === q.answer).length
    : null;

  return (
    <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Radix Sort Quiz</h2>
      <div className="space-y-6">
        {questions.map((item, qIdx) => (
          <div
            key={qIdx}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-900 p-4"
          >
            <p className="font-medium mb-3">
              {qIdx + 1}. {item.question}
            </p>
            <ul className="space-y-2">
              {item.options.map((option, oIdx) => {
                const isSelected = selected[qIdx] === option;
                const isCorrect = option === item.answer;
                let style = "border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800";
                if (submitted) {
                  if (isCorrect) style = "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300";
                  else if (isSelected && !isCorrect) style = "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300";
                } else if (isSelected) {
                  style = "border-[#a435f0] bg-purple-50 dark:bg-purple-900/30";
                }
                return (
                  <li
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, option)}
                    className={`cursor-pointer rounded border px-3 py-2 text-sm transition-all duration-200 ${style}`}
                  >
                    {option}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(selected).length < questions.length}
          className="mt-6 w-full bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-neutral-900 text-center">
          <p className="text-lg font-semibold">
            You scored {score} / {questions.length}
          </p>
          <button
            onClick={() => { setSelected({}); setSubmitted(false); }}
            className="mt-3 text-sm text-[#a435f0] underline"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RadixSortQuiz;
