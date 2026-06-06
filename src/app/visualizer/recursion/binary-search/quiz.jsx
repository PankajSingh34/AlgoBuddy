"use client";
import React from "react";
import Quiz from "@/app/components/ui/Quiz";
import { MODULE_MAPS } from "@/lib/modulesMap";

const questions = [
  {
    question: "What is the best-case time complexity of Recursive Binary Search?",
    options: ["O(log N)", "O(1)", "O(N)", "O(N log N)"],
    correctAnswer: 1,
    explanation: "If the target element lies exactly at the computed mid index in the very first call, it resolves in O(1) time.",
  },
  {
    question: "What happens when the target is not present in the array?",
    options: [
      "The call stack grows infinitely causing a stack overflow",
      "The function returns -1 when low exceeds high (low > high)",
      "The function throws a compilation error",
      "The function runs in O(N) time and returns null"
    ],
    correctAnswer: 1,
    explanation: "Once the pointers cross (low > high), the search interval becomes invalid, hitting the base case returning -1.",
  },
  {
    question: "What is the space complexity of Recursive Binary Search due to the recursion call stack?",
    options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"],
    correctAnswer: 2,
    explanation: "Because each recursive step cuts the search space in half, the maximum call stack height/recursion depth is log2(N).",
  },
  {
    question: "If Recursive Binary Search is run on an unsorted array, what will happen?",
    options: [
      "It will automatically sort the array first",
      "It may fail to find the element even if it exists in the array",
      "It will always work but run in O(N) time",
      "It will raise a runtime exception"
    ],
    correctAnswer: 1,
    explanation: "Binary search relies on the sorted order to discard half the search space. If unsorted, discarding could remove the region containing the target.",
  },
];

export default function BinarySearchQuiz() {
  return (
    <Quiz 
      moduleId={MODULE_MAPS.recursionBinarySearch}
      title="Recursive Binary Search Quiz" 
      questions={questions} 
    />
  );
}
