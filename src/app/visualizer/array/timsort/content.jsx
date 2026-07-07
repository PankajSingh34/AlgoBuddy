"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { useEffect, useState, useCallback } from "react";

const Content = () => {
  const [theme, setTheme] = useState("light");
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
    "Tim Sort is a hybrid, stable sorting algorithm that combines ideas from Insertion Sort and Merge Sort. It first works with small ordered sections of the array called runs, sorts or extends those runs, and then merges them into one sorted array.",
    "Tim Sort is adaptive: it becomes especially efficient when the input is already partially sorted. Its best-case time complexity is O(n), while the average and worst cases are O(n log n), giving it strong performance on both real-world and random datasets.",
    "Tim Sort uses temporary storage while merging runs, so its worst-case space complexity is O(n). The algorithm is stable, meaning equal elements keep their original relative order after sorting.",
    "Tim Sort is used in production language runtimes because real data often contains existing order. Python's list sort and Java's object array sort are well-known examples of Tim Sort or Tim Sort-inspired implementations.",
  ];

  const working = [
    {
      steps: "Step 1: Identify Runs",
      points: [
        "Scan the array and divide it into small ordered sections called runs.",
        "In a simplified implementation, the array is split into minrun-sized chunks.",
      ],
    },
    {
      steps: "Step 2: Sort Small Runs",
      points: [
        "Each run is sorted using Insertion Sort because it is fast on small or nearly sorted ranges.",
        "For example, a run like [29, 25, 3, 49] becomes [3, 25, 29, 49].",
      ],
    },
    {
      steps: "Step 3: Merge Adjacent Runs",
      points: [
        "Once runs are individually sorted, Tim Sort merges neighboring runs using a Merge Sort-style merge step.",
        "The merge process repeatedly compares the front elements of two runs and writes the smaller value into the sorted position.",
      ],
    },
    {
      steps: "Step 4: Finish With One Sorted Array",
      points: [
        "Merging continues until all runs combine into one sorted run.",
        "For [29, 25, 3, 49, 9, 37, 21, 43], the final result is [3, 9, 21, 25, 29, 37, 43, 49].",
      ],
    },
  ];

  const algorithm = [
    {
      steps: "Calculate minrun:",
      points: ["Compute a small run size that keeps insertion sorting efficient and merging balanced."],
    },
    {
      steps: "Sort each run:",
      points: ["Move through the array in minrun-sized ranges and sort each range using Insertion Sort."],
    },
    {
      steps: "Merge sorted runs:",
      points: [
        "Merge pairs of adjacent sorted runs.",
        "Double the merge size after each pass until the whole array is covered.",
      ],
    },
    {
      steps: "Return the sorted array:",
      points: ["After the final merge pass, the array is completely sorted."],
    },
  ];

  const timeComplexity = [
    { points: "Best Case: O(n)" },
    { points: "Average Case: O(n log n)" },
    { points: "Worst Case: O(n log n)" },
  ];

  const advantages = [
    { points: "Adaptive: performs very well when the data is already partially sorted." },
    { points: "Stable: equal elements keep their relative order." },
    { points: "Reliable O(n log n) average and worst-case time complexity." },
    { points: "Excellent practical performance, which is why it is used in real language runtimes." },
  ];

  const disadvantages = [
    { points: "More complex to implement than basic sorting algorithms like Bubble Sort or Insertion Sort." },
    { points: "Requires extra temporary memory during merging." },
    { points: "For very small arrays, plain Insertion Sort can be simpler and competitive." },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Tim Sort?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[0]}
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            How Does It Work?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Consider an unsorted array. Tim Sort breaks it into runs, sorts those small runs, and merges them back together efficiently.
            </p>

            <ul className="space-y-3">
              {working.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db]">
                  <span className="font-semibold">{item.steps}</span>
                  {item.points && (
                    <ol className="mt-2 space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400 font-normal">
                      {item.points.map((subitem, subindex) => (
                        <li key={subindex} className="text-[#6b7280] dark:text-[#9ca3af]">
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

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Algorithm Steps
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {algorithm.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.steps}
                  {item.points && (
                    <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                      {item.points.map((subitem, subindex) => (
                        <li key={subindex} className="text-[#6b7280] dark:text-[#9ca3af]">
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

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {timeComplexity.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm">
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
                bestCase={(n) => n}
                averageCase={(n) => n * Math.log(n)}
                worstCase={(n) => n * Math.log(n)}
                maxN={25}
              />
            </div>
          </div>
        </section>

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

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Advantages
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {advantages.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Disadvantages
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {disadvantages.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ul>
          </div>
        </section>

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
