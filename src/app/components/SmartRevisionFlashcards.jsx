"use client";

import React, { useState } from "react";

const flashcards = {
  Easy: [
    {
      topic: "Array",
      question: "What is an Array?",
      answer: "A collection of elements stored in contiguous memory.",
    },
    {
      topic: "Stack",
      question: "Which principle does Stack follow?",
      answer: "LIFO (Last In First Out).",
    },
  ],

  Medium: [
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
  ],

  Hard: [
    {
      topic: "AVL Tree",
      question: "What is the purpose of AVL Tree rotations?",
      answer: "To keep the tree balanced after insertions and deletions.",
    },
    {
      topic: "Dynamic Programming",
      question: "What is memoization?",
      answer: "Storing results of expensive computations to avoid recalculation.",
    },
  ],
};

export default function SmartRevisionFlashcards() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCards = flashcards[difficulty];

  const nextCard = () => {
    setIndex((index + 1) % currentCards.length);
    setShowAnswer(false);
  };

  const previousCard = () => {
  setIndex((index - 1 + currentCards.length) % currentCards.length);
  setShowAnswer(false);
};

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Smart Revision Flashcards
      </h2>

      <p className="text-gray-400 mb-5">
        Review completed DSA topics and improve long-term memory.
      </p>

      <div
  onClick={() => setShowAnswer(!showAnswer)}
  className="
    bg-slate-800
    p-5
    rounded-lg
    min-h-[180px]
    cursor-pointer
    transition-all
    duration-500
    hover:scale-105
    flex
    flex-col
    justify-center
    items-center
    text-center
  "
>
  <h3 className="text-lg font-bold mb-3">
    {currentCards[index].topic}
  </h3>

  {!showAnswer ? (
    <>
      <p className="text-lg">
        {currentCards[index].question}
      </p>

      <p className="mt-4 text-sm text-gray-400">
        Click card to reveal answer
      </p>
    </>
  ) : (
    <>
      <p className="text-green-400 text-lg font-semibold">
        {currentCards[index].answer}
      </p>

      <p className="mt-4 text-sm text-gray-400">
        Click card to see question
      </p>
    </>
  )}
</div>

      <div className="mt-5 flex gap-2">
        {["Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level);
              setIndex(0);
              setShowAnswer(false);
            }}
            className="px-3 py-2 bg-slate-700 rounded hover:bg-slate-600"
          >
            {level}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
  <button
    onClick={previousCard}
    className="w-1/2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
  >
    Previous
  </button>

  <button
    onClick={nextCard}
    className="w-1/2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
  >
    Next
  </button>
</div>

      <div className="mt-4 text-sm text-gray-400">
        Progress: {index + 1}/{currentCards.length} cards completed
      </div>
    </div>
  );
}