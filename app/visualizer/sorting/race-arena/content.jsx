"use client";
import React from "react";
import ComplexityGraph from "@/app/components/ui/graph";

const ArenaContent = () => {
  const paragraphs = [
    `The Sorting Race Arena compares the real-time visual behavior and speed of 4 foundational sorting algorithms: Bubble Sort, Selection Sort, Insertion Sort, and Quick Sort. While they all achieve the same goal—re-ordering elements into ascending order—their mathematical approaches, pivot selections, stable characteristics, and recursion limits vary widely.`,
    `Sorting algorithms are primarily split into two speed classes based on their average-case time complexities: Quadratic Algorithms ($O(N^2)$) and Logarithmic Algorithms ($O(N \\log N)$). On small arrays, the difference is negligible, but as the array size grows, logarithmic algorithms execute exponentially faster.`,
    `In addition to speed, developers evaluate algorithms based on 'Space Complexity' (whether they sort in-place or require extra temp memory) and 'Stability' (whether they preserve the relative order of identical elements).`
  ];

  const algorithmComparisons = [
    {
      name: "Bubble Sort",
      complexity: "Average/Worst: O(N^2), Best: O(N)",
      space: "O(1) Auxiliary Space",
      stability: "Stable",
      desc: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. It is simple but highly inefficient for larger arrays."
    },
    {
      name: "Selection Sort",
      complexity: "Average/Worst/Best: O(N^2)",
      space: "O(1) Auxiliary Space",
      stability: "Unstable (by default)",
      desc: "Divides the array into sorted and unsorted parts, repeatedly locates the minimum element in the unsorted part, and swaps it with the first unsorted element. Minimizes write/swap operations."
    },
    {
      name: "Insertion Sort",
      complexity: "Average/Worst: O(N^2), Best: O(N)",
      space: "O(1) Auxiliary Space",
      stability: "Stable",
      desc: "Builds a sorted array one element at a time by sliding the current element backward into its correct position. Highly efficient for almost-sorted arrays."
    },
    {
      name: "Quick Sort",
      complexity: "Average/Best: O(N log N), Worst: O(N^2)",
      space: "O(log N) recursion stack space",
      stability: "Unstable",
      desc: "A divide-and-conquer algorithm. It selects a 'pivot' element, partitions the array around the pivot (smaller elements to the left, larger to the right), and recursively sorts the sub-arrays. It is extremely fast in practice."
    }
  ];

  return (
    <main className="max-w-7xl mx-auto mt-8">
      <article className="max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        {/* Intro */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Comparing Sorting Algorithms
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>{paragraphs[0]}</p>
            <p>{paragraphs[1]}</p>
          </div>
        </section>

        {/* Detailed Comparison cards */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] space-y-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Algorithm Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {algorithmComparisons.map((algo, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10 space-y-2">
                <h3 className="font-bold text-lg text-purple-900 dark:text-purple-300">{algo.name}</h3>
                <div className="text-xs space-y-0.5 text-gray-500">
                  <div><strong>Time:</strong> {algo.complexity}</div>
                  <div><strong>Space:</strong> {algo.space}</div>
                  <div><strong>Stability:</strong> {algo.stability}</div>
                </div>
                <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-normal pt-1">{algo.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Graph & Comparison bounds */}
        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Speed scaling: O(N^2) vs O(N log N)
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p>{paragraphs[2]}</p>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3">Mathematical Complexity Curves</h3>
              <ComplexityGraph
                bestCase={(n) => n * Math.log2(n)}
                averageCase={(n) => n * Math.log2(n)}
                worstCase={(n) => n * n}
                maxN={20}
              />
            </div>

            <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Key Observation from the Race:</h4>
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                When you increase the array size above 20 elements, you will notice Quick Sort completing instantly. In comparison, Bubble, Selection, and Insertion Sort spend significantly more time making redundant passes and swapping elements, visually demonstrating why O(N log N) algorithms dominate processing pipelines in modern software architecture.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default ArenaContent;
