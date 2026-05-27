"use client";

import ComplexityGraph from "@/app/components/ui/graph";

const Content = () => {
  const algorithm = [
    "Find the minimum and maximum values to determine the counting range.",
    "Create a count array with one slot for each value in the range.",
    "Scan the input and increment the matching count slot for every value.",
    "Convert the frequency counts into cumulative counts.",
    "Scan the input from right to left, place each value into its output position, and decrement its count.",
    "Copy the output array back as the sorted result.",
  ];

  const working = [
    "Input: [4, 2, 2, 8, 3, 3, 1]",
    "Frequencies: count[1] = 1, count[2] = 2, count[3] = 2, count[4] = 1, count[8] = 1",
    "Cumulative counts tell us the ending position of each value in sorted order.",
    "Stable placement from right to left produces: [1, 2, 2, 3, 3, 4, 8]",
  ];

  return (
    <main className="mx-auto max-w-4xl">
      <article className="mb-8 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white dark:border-[#222] dark:bg-[#111]">
        <section className="border-b border-[#f3f4f6] p-6 dark:border-[#1e1e1e]">
          <h1 className="mb-4 flex items-center text-2xl font-bold text-[#1a1a1a] dark:text-white">
            <span className="mr-3 h-6 w-1 rounded-full bg-[#a435f0]"></span>
            What is Counting Sort?
          </h1>
          <p className="leading-relaxed text-[#374151] dark:text-[#d1d5db]">
            Counting Sort is a non-comparison sorting algorithm for integers in a known, reasonably small range. Instead of comparing pairs of elements, it counts how often each value appears, turns those counts into positions, and writes each value directly into its sorted location.
          </p>
        </section>

        <section className="border-b border-[#f3f4f6] p-6 dark:border-[#1e1e1e]">
          <h1 className="mb-4 flex items-center text-2xl font-bold text-[#1a1a1a] dark:text-white">
            <span className="mr-3 h-6 w-1 rounded-full bg-[#a435f0]"></span>
            How Does It Work?
          </h1>
          <ol className="list-decimal space-y-3 pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {working.map((point, index) => (
              <li key={index} className="pl-2 text-[#374151] dark:text-[#d1d5db]">
                {point}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-b border-[#f3f4f6] p-6 dark:border-[#1e1e1e]">
          <h1 className="mb-4 flex items-center text-2xl font-bold text-[#1a1a1a] dark:text-white">
            <span className="mr-3 h-6 w-1 rounded-full bg-[#a435f0]"></span>
            Algorithm Steps
          </h1>
          <ol className="list-decimal space-y-3 pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {algorithm.map((point, index) => (
              <li key={index} className="pl-2 text-[#374151] dark:text-[#d1d5db]">
                {point}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-b border-[#f3f4f6] p-6 dark:border-[#1e1e1e]">
          <h1 className="mb-4 flex items-center text-2xl font-bold text-[#1a1a1a] dark:text-white">
            <span className="mr-3 h-6 w-1 rounded-full bg-[#a435f0]"></span>
            Time Complexity
          </h1>
          <ul className="list-disc space-y-3 pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            <li className="pl-2 text-[#374151] dark:text-[#d1d5db]">
              <span className="rounded-md bg-[#f3f4f6] px-2 py-1 font-mono text-sm dark:bg-[#222]">Best Case:</span>
              <span className="ml-2">O(n + k), where k is the value range.</span>
            </li>
            <li className="pl-2 text-[#374151] dark:text-[#d1d5db]">
              <span className="rounded-md bg-[#f3f4f6] px-2 py-1 font-mono text-sm dark:bg-[#222]">Average Case:</span>
              <span className="ml-2">O(n + k).</span>
            </li>
            <li className="pl-2 text-[#374151] dark:text-[#d1d5db]">
              <span className="rounded-md bg-[#f3f4f6] px-2 py-1 font-mono text-sm dark:bg-[#222]">Worst Case:</span>
              <span className="ml-2">O(n + k).</span>
            </li>
          </ul>

          <div className="mt-8">
            <ComplexityGraph
              bestCase={(n) => n * 2}
              averageCase={(n) => n * 2}
              worstCase={(n) => n * 3}
              maxN={25}
            />
          </div>
        </section>

        <section className="border-b border-[#f3f4f6] p-6 dark:border-[#1e1e1e]">
          <h1 className="mb-4 flex items-center text-2xl font-bold text-[#1a1a1a] dark:text-white">
            <span className="mr-3 h-6 w-1 rounded-full bg-[#a435f0]"></span>
            Space Complexity
          </h1>
          <p className="leading-relaxed text-[#374151] dark:text-[#d1d5db]">
            Counting Sort uses O(n + k) extra space for the output array and the count array. It is fast when k is close to n, but it becomes memory-heavy when the value range is very large.
          </p>
        </section>

        <section className="p-6">
          <div className="rounded-xl border border-[#e9d5ff] bg-[#faf5ff] px-4 dark:border-[#3b1a6e] dark:bg-[#1a0a2e]">
            <p className="leading-relaxed text-[#374151] dark:text-[#d1d5db]">
              Counting Sort highlights the key difference between comparison and non-comparison sorting: it can run in linear time for bounded integers because it uses the values themselves as direct indexes.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
