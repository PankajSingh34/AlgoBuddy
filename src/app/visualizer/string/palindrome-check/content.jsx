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
    `A palindrome is a string that reads the same forward and backward. The Palindrome Check algorithm compares characters from the beginning and the end of the string, moving inward until all pairs have been checked.`,

    `If every pair of characters matches, the string is a palindrome. If any pair differs, the algorithm immediately concludes that the string is not a palindrome.`,

    `Using the two-pointer technique makes palindrome checking very efficient because only half of the string needs to be examined.`,
  ];

  const example = [
    { points: "String: MADAM" },
    { points: "Compare M and M ✔" },
    { points: "Compare A and A ✔" },
    { points: "Middle character D ✔" },
    { points: "All comparisons matched → Palindrome" },
  ];

  const steps = [
    { points: "Initialize two pointers: left at the beginning and right at the end." },
    { points: "Compare the characters at both pointers." },
    { points: "If they match, move left forward and right backward." },
    { points: "If they do not match, stop — the string is not a palindrome." },
    { points: "If all pairs match, the string is a palindrome." },
  ];

  const complexity = [
    { points: "Best Case: O(1) (first comparison fails)." },
    { points: "Worst Case: O(n) (all characters are checked)." },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">

        {/* What is Palindrome */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Palindrome Check?
          </h1>

          <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
            {paragraphs[0]}
          </p>
        </section>

        {/* Example */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Example
          </h1>

          <ul className="list-disc pl-6 space-y-2">
            {example.map((item, index) => (
              <li
                key={index}
                className="text-[#374151] dark:text-[#d1d5db]"
              >
                {item.points}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[#374151] dark:text-[#d1d5db]">
            {paragraphs[1]}
          </p>
        </section>

        {/* Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Algorithm Steps
          </h1>

          <ol className="list-decimal pl-6 space-y-3">
            {steps.map((item, index) => (
              <li
                key={index}
                className="text-[#374151] dark:text-[#d1d5db]"
              >
                {item.points}
              </li>
            ))}
          </ol>
        </section>

        {/* Complexity */}
        <section className="p-6">
          <h1 className="text-2xl font-black mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time Complexity
          </h1>

          <ul className="list-disc pl-6 space-y-3">
            {complexity.map((item, index) => (
              <li
                key={index}
                className="text-[#374151] dark:text-[#d1d5db]"
              >
                {item.points}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ComplexityGraph
              bestCase={() => 1}
              averageCase={(n) => n}
              worstCase={(n) => n}
              maxN={25}
            />
          </div>

          <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
            <p className="text-[#374151] dark:text-[#d1d5db]">
              {paragraphs[2]}
            </p>
          </div>
        </section>

      </article>
    </main>
  );
};

export default Content;