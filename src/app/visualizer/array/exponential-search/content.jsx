"use client";

import React from "react";

export default function ExponentialSearchContent() {
  return (
    <div className="space-y-10">

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Overview</h2>

        <p className="text-gray-700 dark:text-gray-300 leading-8">
          <strong>Exponential Search</strong> is an efficient searching
          algorithm designed for <strong>sorted arrays</strong>. Instead of
          searching the entire array, it first finds a range where the target
          element may exist by repeatedly doubling the search index. Once the
          range is identified, it performs a standard Binary Search within that
          range.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-8 mt-4">
          This technique is especially useful when the size of the array is
          unknown or when the target element is located near the beginning of
          the array.
        </p>
      </section>

      {/* Working */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          How Exponential Search Works
        </h2>

        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300 leading-8">
          <li>Check whether the first element is the target.</li>
          <li>
            Start from index <code>1</code>.
          </li>
          <li>
            Double the index (1, 2, 4, 8, 16...) until the target is smaller
            than or equal to the current element or the array ends.
          </li>
          <li>
            The target must lie between the previous and current indices.
          </li>
          <li>
            Perform Binary Search within that identified range.
          </li>
        </ol>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Example</h2>

        <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg p-6">

          <p>
            <strong>Array:</strong>
          </p>

          <p className="font-mono mt-2">
            [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
          </p>

          <p className="mt-4">
            <strong>Target:</strong> 14
          </p>

          <ul className="list-disc pl-6 mt-4 space-y-2">

            <li>Start at index 1 → value = 4</li>

            <li>Double → index 2 → value = 6</li>

            <li>Double → index 4 → value = 10</li>

            <li>Double → index 8 → value = 18</li>

            <li>
              Target lies between indices <strong>4</strong> and{" "}
              <strong>8</strong>.
            </li>

            <li>Binary Search is performed between these indices.</li>

            <li>Target found at index 6.</li>

          </ul>

        </div>
      </section>

      {/* Complexity */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Time Complexity
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full border border-gray-300 dark:border-gray-700">

            <thead>

              <tr className="bg-gray-100 dark:bg-neutral-900">

                <th className="border p-3">Case</th>

                <th className="border p-3">Complexity</th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td className="border p-3">Best Case</td>

                <td className="border p-3">O(1)</td>

              </tr>

              <tr>

                <td className="border p-3">Average Case</td>

                <td className="border p-3">O(log n)</td>

              </tr>

              <tr>

                <td className="border p-3">Worst Case</td>

                <td className="border p-3">O(log n)</td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

      {/* Space */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Space Complexity
        </h2>

        <p className="text-gray-700 dark:text-gray-300 leading-8">
          Exponential Search requires only a few extra variables while searching
          and therefore uses:
        </p>

        <div className="mt-4 text-xl font-semibold">
          O(1)
        </div>

      </section>

      {/* Advantages */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Advantages
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">

          <li>Very efficient for sorted arrays.</li>

          <li>Excellent when array size is unknown.</li>

          <li>Finds the search range very quickly.</li>

          <li>Uses Binary Search for efficient searching.</li>

          <li>Requires constant extra memory.</li>

        </ul>

      </section>

      {/* Disadvantages */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Disadvantages
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">

          <li>Works only on sorted arrays.</li>

          <li>Less useful on unsorted data.</li>

          <li>
            Requires Binary Search after identifying the search range.
          </li>

        </ul>

      </section>

      {/* Applications */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Applications
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">

          <li>Searching in infinite or unbounded arrays.</li>

          <li>Large sorted databases.</li>

          <li>Memory-efficient searching.</li>

          <li>Search engines and indexing systems.</li>

          <li>Competitive programming.</li>

        </ul>

      </section>

    </div>
  );
}