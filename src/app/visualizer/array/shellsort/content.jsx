"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { useEffect, useState, useCallback } from "react";

const Content = () => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const updateTheme = useCallback(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    updateTheme();
    setMounted(true);

    window.addEventListener("storage", updateTheme);
    window.addEventListener("themeChange", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("themeChange", updateTheme);
    };
  }, [updateTheme]);

  const paragraphs = [
    `Shell Sort is an in-place comparison sorting algorithm that can be seen as a generalization of insertion sort. It allows the exchange of items that are far apart. The algorithm first sorts elements that are far apart from each other and progressively reduces the gap between elements to be compared.`,
    `The time complexity of Shell Sort depends heavily on the gap sequence used. For the original sequence (n/2, n/4, ...), the worst-case is O(n²). Better gap sequences like Knuth's ( (3^k - 1) / 2 ) give O(n^(3/2)), and others can achieve even better performance, though the average case is complex to analyze.`,
    `Shell Sort is an in-place algorithm, meaning it requires a constant amount of extra space, O(1), for storing variables like the gap size and the element being inserted.`,
    `Shell Sort is a good choice for medium-sized datasets. It performs better than simple O(n²) algorithms like Insertion Sort or Bubble Sort, but is generally outperformed by more advanced algorithms like Quick Sort or Merge Sort for large datasets. It's also simple to implement.`,
  ];

  const working = [
    {
      steps: "Pass 1: Gap = 4",
      points: [
        "Compare and sort elements at indices (0, 4), (1, 5), (2, 6), (3, 7).",
        "Example: Compare 35 and 14, swap. Compare 33 and 19, swap.",
        "Array becomes partially sorted: [14, 19, 27, 10, 35, 33, 42, 44]",
      ],
    },
    {
      steps: "Pass 2: Gap = 2",
      points: [
        "Perform gapped insertion sort with a gap of 2.",
        "Array becomes more sorted: [14, 10, 27, 19, 35, 33, 42, 44]",
      ],
    },
    {
      steps: "Pass 3: Gap = 1",
      points: [
        "Perform a final insertion sort on the nearly sorted array.",
        "The array is now fully sorted: [10, 14, 19, 27, 33, 35, 42, 44]",
      ],
    },
  ];

  const algorithm = [
    {
      steps: "Start with a large gap:",
      points: ["Choose a gap sequence (e.g., n/2, n/4, ..., 1). Start with the largest gap."],
    },
    {
      steps: "Gapped Insertion Sort:",
      points: ["For the current gap, iterate through the array and perform an insertion sort on elements that are 'gap' distance apart."],
    },
    {
      steps: "Reduce the gap:",
      points: [
        "After sorting for the current gap, move to the next smaller gap in the sequence.",
        "Repeat the gapped insertion sort.",
      ],
    },
    {
      steps: "Final Pass:",
      points: ["The final pass is always with a gap of 1, which is equivalent to a standard insertion sort. By this stage, the array is nearly sorted, making this final step very efficient."],
    },
  ];

  const timeComplexity = [
    { points: "Best Case: O(n log n) (for certain gap sequences)" },
    { points: "Average Case: Depends on gap sequence, typically between O(n log n) and O(n²)" },
    { points: "Worst Case: O(n²) (for simple gap sequences like n/2)" },
  ];

  const strategies = [
    { strategy: "Shell's original sequence", details: "n/2, n/4, ..., 1. Simple but has a worst-case of O(n²)." },
    { strategy: "Hibbard's sequence", details: "2^k - 1. Leads to a worst-case of O(n^(3/2))." },
    { strategy: "Sedgewick's sequence", details: "Complex formula (e.g., 4^k + 3*2^(k-1) + 1). Provides better performance, closer to O(n^(4/3)) or O(n log² n)." },
    { strategy: "Knuth's sequence", details: "(3^k - 1) / 2. A popular choice with O(n^(3/2)) worst-case performance." },
  ];

  {
    /* Advantages */
  }
  const advantages = [
    { points: "Efficient for medium-sized lists." },
    { points: "In-place sorting algorithm (requires O(1) auxiliary space)." },
    { points: "Significantly better than simple quadratic (O(n²)) algorithms like Insertion Sort and Bubble Sort." },
    { points: "Relatively simple to implement." },
  ];

  {
    /* Disadvantages */
  }
  const disadvantages = [
    { points: "Not stable (relative order of equal elements may change)." },
    { points: "Time complexity is heavily dependent on the chosen gap sequence." },
    { points: "Generally slower than O(n log n) algorithms like Quick Sort, Merge Sort, or Heap Sort for large datasets." },
    {
      points: "The optimal gap sequence is still an open research problem.",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto">

      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        {/* What is Shell Sort */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Shell Sort?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[0]}
            </p>
          </div>
        </section>

        {/* How Does It Work */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            How Does It Work?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Consider this unsorted array: [35, 33, 42, 10, 14, 19, 27, 44]
            </p>

            <ul className="space-y-3">
              {working.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db]">
                  <span className="font-semibold">{item.steps}</span>
                  {item.points && (
                    <ol className="mt-2 space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400 font-normal">
                      {item.points.map((subitem, subindex) => (
                        <li
                          key={subindex}
                          className="text-[#6b7280] dark:text-[#9ca3af]"
                        >
                          {subitem}
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Algorithm Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Algorithm Steps
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {algorithm.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.steps}
                  {item.points && (
                    <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                      {item.points.map((subitem, subindex) => (
                        <li
                          key={subindex}
                          className="text-[#6b7280] dark:text-[#9ca3af]"
                        >
                          {subitem}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Time Complexity */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {timeComplexity.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm font-mono">
                    {item.points.split(":")[0]}:
                  </span>
                  <span className="ml-2">{item.points.split(":")[1]}</span>
                </li>
              ))}
            </ul>
            <p className="text-[#374151] dark:text-[#d1d5db] mt-4 leading-relaxed">
              {paragraphs[1]}
            </p>
            <div className="mt-8">
              <ComplexityGraph
                bestCase={(n) => n * Math.log2(n)} // O(n log n)
                averageCase={(n) => n * Math.pow(n, 0.26)} // Approximation for O(n^1.26)
                worstCase={(n) => n * Math.sqrt(n)} // O(n^1.5) for Hibbard's
                maxN={25}
              />
            </div>
          </div>
        </section>

        {/* Space Complexity */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Space Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[2]}
            </p>
          </div>
        </section>

        {/* Advantages */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Advantages
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {advantages.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Disadvantages */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Disadvantages
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {disadvantages.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Gap Sequences */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Gap Sequences
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {strategies.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  <span className="font-semibold">{item.strategy}:</span> {item.details}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Additional Info */}
        <section className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="px-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                {paragraphs[3]}
              </p>
            </div>
          </div>
        </section>
      </article>
</main>
  );
};

export default Content;
