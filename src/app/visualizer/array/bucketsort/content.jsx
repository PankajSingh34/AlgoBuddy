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
    `Bucket Sort is a distribution sorting algorithm that works by distributing the elements of an array into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm or by recursively applying the bucket sort algorithm. Finally, the sorted buckets are concatenated to form the final sorted array.`,
    `The efficiency of Bucket Sort depends heavily on the input data being uniformly distributed over a range. When the data is uniformly distributed, Bucket Sort can perform in linear time, O(n + k), where 'n' is the number of elements and 'k' is the number of buckets. However, its worst-case performance is O(n²) if all elements are placed into a single bucket.`,
    `Bucket Sort is not an in-place algorithm as it requires extra space for the buckets. The space complexity is O(n + k), where 'n' is the space for the elements across all buckets and 'k' is the space for the bucket containers themselves.`,
    `Bucket Sort is an excellent choice when the input data is known to be uniformly distributed. It's often used in scenarios where data is spread out, such as sorting a large set of floating-point numbers that are evenly distributed between 0.0 and 1.0.`,
  ];

  const working = [
    {
      steps: "Step 1: Create Buckets",
      points: [
        "First, create an array of empty buckets. The number of buckets can be chosen based on the data range or size.",
        "For our example with array [29, 25, 3, 49, 9, 37, 21, 43] and 5 buckets, we create 5 empty lists.",
      ],
    },
    {
      steps: "Step 2: Distribute Elements",
      points: [
        "Go through the original array and put each element in its corresponding bucket based on a distribution formula.",
        "Example: 29 goes to bucket 2, 25 to bucket 2, 3 to bucket 0, 49 to bucket 4, etc.",
        "After distribution: Bucket 0: [3, 9], Bucket 1: [], Bucket 2: [29, 25, 21], Bucket 3: [37], Bucket 4: [49, 43]",
      ],
    },
    {
      steps: "Step 3: Sort Individual Buckets",
      points: [
        "Sort each non-empty bucket using another sorting algorithm (like Insertion Sort) or by recursively calling Bucket Sort.",
        "After sorting: Bucket 0: [3, 9], Bucket 2: [21, 25, 29], Bucket 3: [37], Bucket 4: [43, 49]",
      ],
    },
    {
      steps: "Step 4: Concatenate Buckets",
      points: [
        "Visit the buckets in order and place all their elements back into the original array.",
        "The array is now fully sorted: [3, 9, 21, 25, 29, 37, 43, 49]",
      ],
    },
  ];

  const algorithm = [
    {
      steps: "Create Buckets:",
      points: ["Initialize 'k' empty buckets."],
    },
    {
      steps: "Distribute Elements:",
      points: ["For each element in the input array, calculate its bucket index and place it in the corresponding bucket."],
    },
    {
      steps: "Sort Buckets:",
      points: [
        "Iterate through all the buckets and sort each one individually.",
        "A common choice for sorting the buckets is Insertion Sort, due to its efficiency on small or nearly-sorted lists.",
      ],
    },
    {
      steps: "Concatenate:",
      points: ["Gather the sorted elements from each bucket and place them back into the original array in order."],
    },
  ];

  const timeComplexity = [
    { points: "Best Case: O(n + k)" },
    { points: "Average Case: O(n + k)" },
    { points: "Worst Case: O(n²)" },
  ];

  {
    /* Advantages */
  }
  const advantages = [
    { points: "Extremely fast when the input data is uniformly distributed, achieving linear time complexity." },
    { points: "Can be easily parallelized since each bucket can be sorted independently." },
  ];

  {
    /* Disadvantages */
  }
  const disadvantages = [
    { points: "Performance degrades significantly if the data is not uniformly distributed, leading to a worst-case of O(n²)." },
    { points: "Requires extra space for the buckets, making its space complexity O(n + k)." },
    { points: "The stability of the sort depends on the stability of the underlying algorithm used to sort the buckets." },
  ];

  return (
    <main className="max-w-4xl mx-auto">

      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        {/* What is Bucket Sort */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Bucket Sort?
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
              Consider this unsorted array: [29, 25, 3, 49, 9, 37, 21, 43]
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
                bestCase={(n) => n} // O(n+k) -> O(n)
                averageCase={(n) => n} // O(n+k) -> O(n)
                worstCase={(n) => n * n} // O(n^2)
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
