"use client";

import { useState } from "react";

const questions = [
  {
    question:
      "What technique is primarily used to solve the Longest Substring Without Repeating Characters problem efficiently?",
    options: [
      "Dynamic Programming",
      "Sliding Window",
      "Binary Search",
      "Greedy",
    ],
    answer: "Sliding Window",
    explanation:
      "The Sliding Window technique expands and shrinks the window to maintain unique characters in O(n) time.",
  },
  {
    question:
      "What is the time complexity of the optimal Sliding Window solution?",
    options: ["O(n²)", "O(log n)", "O(n)", "O(n log n)"],
    answer: "O(n)",
    explanation:
      "Each character is visited at most twice (once by left pointer and once by right pointer).",
  },
  {
    question:
      "Which data structure is commonly used to store previously seen characters?",
    options: ["Queue", "HashMap", "Linked List", "Stack"],
    answer: "HashMap",
    explanation:
      "A HashMap stores the last occurrence index of every character.",
  },
  {
    question:
      "If a duplicate character is encountered, what should happen?",
    options: [
      "Ignore it",
      "Restart from beginning",
      "Move the left pointer after the previous occurrence",
      "Delete the string",
    ],
    answer: "Move the left pointer after the previous occurrence",
    explanation:
      "The left pointer jumps to maintain a substring with unique characters.",
  },
  {
    question:
      "For the input 'abcabcbb', what is the longest substring length?",
    options: ["2", "3", "4", "5"],
    answer: "3",
    explanation:
      "The longest unique substrings are 'abc', 'bca', and 'cab', each of length 3.",
  },
  {
    question:
      "For the input 'bbbbb', what is the answer?",
    options: ["0", "1", "2", "5"],
    answer: "1",
    explanation:
      "Every substring contains only one unique character.",
  },
  {
    question:
      "For the input 'pwwkew', what is the longest substring length?",
    options: ["2", "3", "4", "5"],
    answer: "3",
    explanation:
      "The longest substring without repeating characters is 'wke'.",
  },
  {
    question:
      "Which pointer is responsible for expanding the current window?",
    options: [
      "Left Pointer",
      "Middle Pointer",
      "Right Pointer",
      "Hash Pointer",
    ],
    answer: "Right Pointer",
    explanation:
      "The right pointer keeps expanding the window by including new characters.",
  },
  {
    question:
      "Why is a HashMap preferred over a nested loop approach?",
    options: [
      "Consumes less memory",
      "Provides O(1) average lookup time",
      "Uses recursion",
      "Sorts characters automatically",
    ],
    answer: "Provides O(1) average lookup time",
    explanation:
      "HashMap enables constant-time lookup of previously seen characters.",
  },
  {
    question:
      "What is the space complexity of the optimal solution?",
    options: ["O(1)", "O(log n)", "O(min(n, charset))", "O(n²)"],
    answer: "O(min(n, charset))",
    explanation:
      "The HashMap stores at most one entry for each unique character.",
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[current];

  const handleNext = () => {
    if (selected === question.answer) {
      setScore((prev) => prev + 1);
    }

    setSelected("");
    setShowAnswer(false);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      alert(`Quiz Completed!\nYour Score: ${score + (selected === question.answer ? 1 : 0)}/${questions.length}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">
        Longest Substring Quiz
      </h2>

      <h3 className="font-semibold mb-4">
        Q{current + 1}. {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            disabled={showAnswer}
            className={`w-full text-left border rounded-lg px-4 py-3 transition
            ${
              selected === option
                ? "bg-indigo-100 border-indigo-500"
                : "hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {!showAnswer ? (
        <button
          disabled={!selected}
          onClick={() => setShowAnswer(true)}
          className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Check Answer
        </button>
      ) : (
        <>
          <div
            className={`mt-6 p-4 rounded-lg ${
              selected === question.answer
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <p>
              <strong>Correct Answer:</strong> {question.answer}
            </p>

            <p className="mt-2">{question.explanation}</p>
          </div>

          <button
            onClick={handleNext}
            className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            {current === questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </button>
        </>
      )}
    </div>
  );
}