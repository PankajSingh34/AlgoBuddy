import React from "react";

const questions = [
  {
    question: "What is the main advantage of Counting Sort compared to comparison-based sorts?",
    options: [
      "It can handle any range of values with the same performance.",
      "It sorts in place without extra memory.",
      "It sorts in linear time when the value range is small.",
      "It only works for negative numbers.",
    ],
    answer: "It sorts in linear time when the value range is small.",
  },
  {
    question: "Which step comes first in the Counting Sort algorithm?",
    options: [
      "Reverse the input array.",
      "Build the count array from input values.",
      "Swap adjacent elements.",
      "Merge two sorted halves.",
    ],
    answer: "Build the count array from input values.",
  },
  {
    question: "Why does Counting Sort compute a prefix sum over the count array?",
    options: [
      "To determine the number of distinct values.",
      "To find the maximum value in the array.",
      "To compute final positions for each value in the output.",
      "To sort the output array in reverse order.",
    ],
    answer: "To compute final positions for each value in the output.",
  },
  {
    question: "What is a key limitation of Counting Sort?",
    options: [
      "It requires the input to be already sorted.",
      "It only works with integer values in a bounded range.",
      "It cannot be made stable.",
      "It always uses O(n^2) time.",
    ],
    answer: "It only works with integer values in a bounded range.",
  },
  {
    question: "During placement, why does Counting Sort iterate the input array in reverse order?",
    options: [
      "To make the algorithm unstable.",
      "To preserve the original relative order of equal elements.",
      "To reduce memory usage.",
      "To avoid computing counts twice.",
    ],
    answer: "To preserve the original relative order of equal elements.",
  },
];

const CountingSortQuiz = () => {
  return (
    <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Counting Sort Quiz</h2>
      <div className="space-y-5">
        {questions.map((item, index) => (
          <div key={index} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-900 p-4">
            <p className="font-medium mb-3">{index + 1}. {item.question}</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {item.options.map((option, optionIndex) => (
                <li key={optionIndex}>{option}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 text-sm text-gray-500 dark:text-gray-400">
        Answers are available once you complete the exercise.
      </div>
    </div>
  );
};

export default CountingSortQuiz;
