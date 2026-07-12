"use client";

import ComplexityGraph from "@/app/components/ui/graph";
import { useEffect, useState, useCallback } from "react";

const Content = () => {
  const [theme, setTheme] = useState("light");

  const updateTheme = useCallback(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    updateTheme();

    window.addEventListener("storage", updateTheme);
    window.addEventListener("themeChange", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("themeChange", updateTheme);
    };
  }, [updateTheme]);

  const paragraphs = [
    `Reverse String is a basic string manipulation algorithm that reverses the order of characters in a string. The most efficient approach uses two pointers—one starting from the beginning and the other from the end—and swaps characters until both pointers meet.`,

    `This approach performs the reversal in-place without using any additional array, making it both time and space efficient.`,

    `Reverse String is frequently used in interviews and serves as a foundation for many advanced string algorithms such as palindrome checking and rotation problems.`,
  ];

  const example = [
    { points: "Input String: HELLO" },
    { points: "Left points to H" },
    { points: "Right points to O" },
    { points: "Swap H and O → OELLH" },
    { points: "Move pointers inward" },
    { points: "Swap E and L → OLLEH" },
    { points: "Pointers meet → Finished" },
  ];

  const steps = [
    { points: "Initialize Left pointer at index 0." },
    { points: "Initialize Right pointer at the last index." },
    { points: "Swap characters at Left and Right." },
    { points: "Increment Left pointer." },
    { points: "Decrement Right pointer." },
    { points: "Repeat until Left ≥ Right." },
  ];

  const complexity = [
    { points: "Best Case: O(n)" },
    { points: "Average Case: O(n)" },
    { points: "Worst Case: O(n)" },
    { points: "Space Complexity: O(1)" },
  ];

  return (
    <main className="max-w-4xl mx-auto">

      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">

        {/* What is Reverse String */}

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">

          <h1 className="text-2xl font-black mb-4 flex items-center">
            <span className="w-1 h-6 bg-pink-500 mr-3 rounded-full"></span>
            What is Reverse String?
          </h1>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {paragraphs[0]}
          </p>

        </section>

        {/* Working */}

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">

          <h1 className="text-2xl font-black mb-4 flex items-center">
            <span className="w-1 h-6 bg-pink-500 mr-3 rounded-full"></span>
            Example
          </h1>

          <ul className="space-y-3 list-disc pl-6">
            {example.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ul>

          <p className="mt-5 text-gray-700 dark:text-gray-300">
            {paragraphs[1]}
          </p>

        </section>

        {/* Algorithm */}

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">

          <h1 className="text-2xl font-black mb-4 flex items-center">
            <span className="w-1 h-6 bg-pink-500 mr-3 rounded-full"></span>
            Algorithm Steps
          </h1>

          <ol className="space-y-3 list-decimal pl-6">
            {steps.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ol>

        </section>

        {/* Complexity */}

        <section className="p-6">

          <h1 className="text-2xl font-black mb-4 flex items-center">
            <span className="w-1 h-6 bg-pink-500 mr-3 rounded-full"></span>
            Complexity Analysis
          </h1>

          <ul className="space-y-3 list-disc pl-6">
            {complexity.map((item, index) => (
              <li key={index}>
                {item.points}
              </li>
            ))}
          </ul>

          <div className="mt-8">

            <ComplexityGraph
              bestCase={(n) => n}
              averageCase={(n) => n}
              worstCase={(n) => n}
              maxN={25}
            />

          </div>

          <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-950 rounded-xl border border-pink-200 dark:border-pink-800">

            <p className="text-gray-700 dark:text-gray-300">
              {paragraphs[2]}
            </p>

          </div>

        </section>

      </article>

    </main>
  );
};

export default Content;