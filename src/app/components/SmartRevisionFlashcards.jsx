"use client";

import React, { useState } from "react";

const flashcards = [
  {
    topic: "Binary Search",
    question: "What is the time complexity of Binary Search?",
    answer: "O(log n)",
  },
  {
    topic: "Merge Sort",
    question: "What is the average time complexity of Merge Sort?",
    answer: "O(n log n)",
  },
  {
    topic: "Stack",
    question: "Which principle does a Stack follow?",
    answer: "LIFO (Last In First Out)",
  },
];

export default function SmartRevisionFlashcards() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState("");

  const nextCard = () => {
    setIndex((index + 1) % flashcards.length);
    setShowAnswer(false);
    setDifficulty("");
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Smart Revision Flashcards
      </h2>

      <p className="text-gray-400 mb-5">
        Review completed DSA topics and improve long-term memory.
      </p>

      <div className="bg-slate-800 p-5 rounded-lg min-h-[180px]">
        <h3 className="text-lg font-semibold mb-2">
          {flashcards[index].topic}
        </h3>

        <p className="mb-4">
          {showAnswer
            ? flashcards[index].answer
            : flashcards[index].question}
        </p>

        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        {["Easy", "Medium", "Difficult"].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className="px-3 py-2 bg-slate-700 rounded hover:bg-slate-600"
          >
            {level}
          </button>
        ))}
      </div>

      {difficulty && (
        <p className="mt-3 text-green-400">
          Marked as {difficulty}
        </p>
      )}

      <button
        onClick={nextCard}
        className="mt-5 w-full px-4 py-2 bg-green-600 rounded hover:bg-green-700"
      >
        Next Flashcard
      </button>

      <div className="mt-4 text-sm text-gray-400">
        Progress: {index + 1}/{flashcards.length} cards completed
      </div>
    </div>
  );
}