"use client";
import React from "react";
import Quiz from "@/app/components/ui/Quiz";
import { MODULE_MAPS } from "@/lib/modulesMap";

const questions = [
  {
    question: "What is the main advantage of Counting Sort compared to comparison-based sorts?",
    options: [
      "It can handle any range of values with the same performance.",
      "It sorts in place without extra memory.",
      "It sorts in linear time when the value range is small.",
      "It only works for negative numbers.",
    ],
    correctAnswer: 2,
    explanation: "Counting Sort achieves O(n+k) time complexity where k is the range of input values, making it linear when k is small relative to n.",
  },
  {
    question: "Which step comes first in the Counting Sort algorithm?",
    options: [
      "Reverse the input array.",
      "Build the count array from input values.",
      "Swap adjacent elements.",
      "Merge two sorted halves.",
    ],
    correctAnswer: 1,
    explanation: "The first step is to count the frequency of each element in the input array and store it in the count array.",
  },
  {
    question: "Why does Counting Sort compute a prefix sum over the count array?",
    options: [
      "To determine the number of distinct values.",
      "To find the maximum value in the array.",
      "To compute final positions for each value in the output.",
      "To sort the output array in reverse order.",
    ],
    correctAnswer: 2,
    explanation: "The prefix sum (cumulative count) determines the starting position for each element in the sorted output array.",
  },
  {
    question: "What is a key limitation of Counting Sort?",
    options: [
      "It requires the input to be already sorted.",
      "It only works with integer values in a bounded range.",
      "It cannot be made stable.",
      "It always uses O(n^2) time.",
    ],
    correctAnswer: 1,
    explanation: "Counting Sort requires the input values to be integers within a known, reasonably small range.",
  },
  {
    question: "During placement, why does Counting Sort iterate the input array in reverse order?",
    options: [
      "To make the algorithm unstable.",
      "To preserve the original relative order of equal elements.",
      "To reduce memory usage.",
      "To avoid computing counts twice.",
    ],
    correctAnswer: 1,
    explanation: "Iterating in reverse order ensures that equal elements maintain their relative order from the original array, making Counting Sort stable.",
  },
];

const CountingSortQuiz = () => {
  return (
    <Quiz 
      moduleId={MODULE_MAPS.countingSort}
      title="Counting Sort Quiz" 
      questions={questions} 
    />
  );
};

export default CountingSortQuiz;
