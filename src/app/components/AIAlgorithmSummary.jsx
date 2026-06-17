"use client";

import React from "react";
import { Bot, BookOpen, Lightbulb, Code, Rocket } from "lucide-react";

const summaryData = {
  algorithm: "Binary Search",

  explanation:
    "Binary Search is an efficient searching algorithm that repeatedly divides a sorted array into halves until the target element is found.",

  steps: [
    "Check the middle element of the array.",
    "If the target is smaller, search the left half.",
    "If the target is greater, search the right half.",
    "Repeat the process until the element is found or the search space becomes empty.",
  ],

  takeaways: [
    "Works only on sorted arrays.",
    "Reduces the search space by half in every step.",
    "Time Complexity: O(log n).",
    "Space Complexity: O(1) for iterative implementation.",
  ],

  interviewQuestions: [
    "Why is Binary Search faster than Linear Search?",
    "What happens if the input array is unsorted?",
    "How do you avoid overflow while calculating the middle index?",
  ],

  optimizationTips: [
    "Use iterative Binary Search to avoid recursive stack overhead.",
    "Calculate middle index using low + (high - low) / 2.",
    "Ensure the input data is sorted before applying Binary Search.",
  ],
};

export default function AIAlgorithmSummary() {
  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-6 bg-slate-900 text-white rounded-2xl shadow-lg">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Bot className="text-purple-400" />
        <h2 className="text-2xl font-bold">
          AI Algorithm Explanation & Summary
        </h2>
      </div>

      {/* Algorithm Name */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-purple-300">
          {summaryData.algorithm}
        </h3>
        <p className="text-slate-300 mt-2">
          {summaryData.explanation}
        </p>
      </div>

      {/* Step-by-Step Summary */}
      <div className="mb-5">
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <BookOpen size={18} className="text-blue-400" />
          Step-by-Step Summary
        </h3>

        <ul className="list-disc pl-5 mt-2 text-slate-300">
          {summaryData.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>

      {/* Key Takeaways */}
      <div className="mb-5">
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <Lightbulb size={18} className="text-yellow-400" />
          Key Takeaways
        </h3>

        <ul className="list-disc pl-5 mt-2 text-slate-300">
          {summaryData.takeaways.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Interview Questions */}
      <div className="mb-5">
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <Code size={18} className="text-green-400" />
          Common Interview Questions
        </h3>

        <ul className="list-disc pl-5 mt-2 text-slate-300">
          {summaryData.interviewQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>

      {/* Optimization Tips */}
      <div>
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <Rocket size={18} className="text-red-400" />
          Optimization Tips & Best Practices
        </h3>

        <ul className="list-disc pl-5 mt-2 text-slate-300">
          {summaryData.optimizationTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}