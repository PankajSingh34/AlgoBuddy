"use client";

import ComplexityGraph from "@/app/components/ui/graph";

export default function Content() {
  return (
    <main className="max-w-5xl mx-auto">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden">

        {/* Introduction */}
        <section className="p-6 border-b dark:border-[#222]">
          <h2 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            What is Longest Common Prefix?
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-8">
            The <strong>Longest Common Prefix (LCP)</strong> of a group of
            strings is the longest prefix shared by every string. If no common
            prefix exists, the result is an empty string.
          </p>

          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-8">
            This problem frequently appears in coding interviews and is useful
            in autocomplete systems, dictionaries, search engines, and text
            processing.
          </p>
        </section>

        {/* Example */}
        <section className="p-6 border-b dark:border-[#222]">
          <h2 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            Example
          </h2>

          <div className="rounded-xl bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800 p-5">
            <p>
              <strong>Input:</strong>
            </p>

            <pre className="mt-2 text-pink-700 dark:text-pink-300">
{`["flower", "flow", "flight"]`}
            </pre>

            <p className="mt-4">
              <strong>Output:</strong>
            </p>

            <pre className="mt-2 text-green-600 font-bold">
"fl"
            </pre>
          </div>
        </section>

        {/* Algorithm */}
        <section className="p-6 border-b dark:border-[#222]">
          <h2 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            Algorithm
          </h2>

          <ol className="list-decimal pl-6 space-y-3">
            <li>Take the first string as the initial prefix.</li>
            <li>Compare it with every remaining string.</li>
            <li>
              If the current string doesn't start with the prefix, remove the
              last character from the prefix.
            </li>
            <li>Repeat until every string begins with the prefix.</li>
            <li>Return the final prefix.</li>
          </ol>
        </section>

        {/* Complexity */}
        <section className="p-6">
          <h2 className="text-2xl font-black flex items-center mb-4">
            <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>
            Complexity Analysis
          </h2>

          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Best Case:</strong> O(n)
            </li>

            <li>
              <strong>Average Case:</strong> O(n × m)
            </li>

            <li>
              <strong>Worst Case:</strong> O(n × m)
            </li>

            <li>
              <strong>Space Complexity:</strong> O(1)
            </li>
          </ul>

          <div className="mt-8">
            <ComplexityGraph
              bestCase={(n) => n}
              averageCase={(n) => n * Math.log2(n)}
              worstCase={(n) => n * Math.log2(n)}
              maxN={25}
            />
          </div>
        </section>

      </article>
    </main>
  );
}