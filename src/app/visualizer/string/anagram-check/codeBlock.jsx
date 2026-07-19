"use client";

import ComplexityGraph from "@/app/components/ui/graph";

const Content = () => {
  const paragraphs = [
    `An Anagram Check determines whether two strings contain exactly the same characters with the same frequencies, regardless of their order. For example, "listen" and "silent" are anagrams because they contain the same letters.`,

    `There are multiple approaches to solve this problem. A common method is to sort both strings and compare them. Another efficient approach is to count the frequency of each character using a HashMap and compare the frequency maps.`,

    `Anagram checking is widely used in text processing, spell checkers, cryptography, word games, and coding interviews.`,
  ];

  const example = [
    { points: 'First String: "listen"' },
    { points: 'Second String: "silent"' },
    { points: 'Sort both strings' },
    { points: '"eilnst" == "eilnst"' },
    { points: "Therefore, both strings are anagrams." },
  ];

  const steps = [
    { points: "Check if both strings have the same length." },
    { points: "Convert both strings to lowercase (optional)." },
    { points: "Sort both strings alphabetically." },
    { points: "Compare the sorted strings." },
    {
      points: "If both are identical, return True; otherwise return False.",
    },
  ];

  const complexity = [
    {
      points: "Best Case: O(n log n) using sorting.",
    },
    {
      points:
        "Using HashMap Frequency Count: O(n) time and O(n) auxiliary space.",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden">

        {/* What is Anagram */}
        <section className="p-6 border-b dark:border-[#222]">
          <h1 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            What is Anagram Check?
          </h1>

          <p className="text-gray-700 dark:text-gray-300 leading-8">
            {paragraphs[0]}
          </p>
        </section>

        {/* Example */}
        <section className="p-6 border-b dark:border-[#222]">
          <h1 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            Example
          </h1>

          <ul className="space-y-3 list-disc pl-5">
            {example.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ul>

          <p className="mt-6 text-gray-700 dark:text-gray-300 leading-8">
            {paragraphs[1]}
          </p>
        </section>

        {/* Steps */}
        <section className="p-6 border-b dark:border-[#222]">
          <h1 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            Algorithm Steps
          </h1>

          <ol className="list-decimal pl-5 space-y-3">
            {steps.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ol>
        </section>

        {/* Complexity */}
        <section className="p-6">
          <h1 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            Time Complexity
          </h1>

          <ul className="space-y-3 list-disc pl-5">
            {complexity.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ul>

          <div className="mt-8">
            <ComplexityGraph
              bestCase={(n) => n * Math.log2(n)}
              averageCase={(n) => n * Math.log2(n)}
              worstCase={(n) => n * Math.log2(n)}
              maxN={25}
            />
          </div>

          <div className="mt-8 p-5 rounded-xl bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800">
            <p className="text-gray-700 dark:text-gray-300 leading-8">
              {paragraphs[2]}
            </p>
          </div>
        </section>

      </article>
    </main>
  );
};

export default Content;