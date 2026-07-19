"use client";

import ComplexityGraph from "@/app/components/ui/graph";

const Content = () => {
  const paragraphs = [
    `Character Frequency is a string-processing technique used to count how many times each character appears in a given string. It is commonly implemented using a HashMap (or dictionary) where each character is stored as a key and its occurrence count as the value.`,

    `The algorithm scans the string one character at a time. If the character already exists in the map, its count is increased. Otherwise, it is added with a frequency of 1.`,

    `Character Frequency is widely used in text analysis, data compression, anagram detection, and many interview problems involving strings and hashing.`,
  ];

  const example = [
    { points: 'Input String: "banana"' },
    { points: "Read 'b' → { b: 1 }" },
    { points: "Read 'a' → { b: 1, a: 1 }" },
    { points: "Read 'n' → { b: 1, a: 1, n: 1 }" },
    { points: "Read 'a' → { b: 1, a: 2, n: 1 }" },
    { points: "Read 'n' → { b: 1, a: 2, n: 2 }" },
    { points: "Read 'a' → { b: 1, a: 3, n: 2 }" },
  ];

  const steps = [
    { points: "Create an empty HashMap (or Dictionary)." },
    { points: "Traverse the string character by character." },
    {
      points: "For each character:",
      subpoints: [
        "If already present, increment its count.",
        "Otherwise insert it with count = 1.",
      ],
    },
    { points: "Display all characters with their frequencies." },
  ];

  const complexity = [
    {
      points:
        "Best Case: O(n) (every character processed once).",
    },
    {
      points:
        "Worst Case: O(n) (HashMap insertion/search is O(1) on average).",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto">

      <article className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden">

        {/* What is Character Frequency */}
        <section className="p-6 border-b dark:border-[#222]">
          <h1 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            What is Character Frequency?
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

          <p className="mt-5 text-gray-700 dark:text-gray-300 leading-8">
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
              <li key={index}>
                {item.points}

                {item.subpoints && (
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    {item.subpoints.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Complexity */}
        <section className="p-6">
          <h1 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            Time Complexity
          </h1>

          <ul className="list-disc pl-5 space-y-3">
            {complexity.map((item, index) => (
              <li key={index}>{item.points}</li>
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