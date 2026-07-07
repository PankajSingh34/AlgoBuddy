"use client";

import React from "react";

export default function InterpolationSearchContent() {
  return (
    <div className="space-y-10">

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          Overview
        </h2>

        <p className="text-gray-700 dark:text-gray-300 leading-8">
          <strong>Interpolation Search</strong> is an improved searching
          algorithm for <strong>sorted and uniformly distributed arrays</strong>.
          Instead of always checking the middle element like Binary Search,
          it estimates the most likely position of the target using an
          interpolation formula.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-8 mt-4">
          When data is uniformly distributed, Interpolation Search performs
          significantly faster than Binary Search by jumping directly near the
          expected location of the target.
        </p>
      </section>

      {/* Working */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          How Interpolation Search Works
        </h2>

        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Start with the first and last elements of the sorted array.</li>
          <li>Estimate the probable position of the target using interpolation.</li>
          <li>Compare the estimated position with the target.</li>
          <li>If equal, return the index.</li>
          <li>If the target is larger, search the right portion.</li>
          <li>If the target is smaller, search the left portion.</li>
          <li>Repeat until the target is found or the search space becomes empty.</li>
        </ol>
      </section>

      {/* Formula */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          Position Formula
        </h2>

        <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg p-5 font-mono text-lg overflow-x-auto">
          pos = low + ((target - arr[low]) × (high - low)) / (arr[high] - arr[low])
        </div>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          The formula predicts where the target should be based on the value
          rather than simply choosing the middle element.
        </p>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          Example
        </h2>

        <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg p-6">

          <p><strong>Array:</strong></p>

          <p className="font-mono mt-2">
            [10, 20, 30, 40, 50, 60, 70]
          </p>

          <p className="mt-4">
            <strong>Target:</strong> 40
          </p>

          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>low = 0</li>
            <li>high = 6</li>
            <li>Estimated position = 3</li>
            <li>arr[3] = 40</li>
            <li>Target found at index 3.</li>
          </ul>

        </div>

      </section>

      {/* Time Complexity */}
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

                <td className="border p-3">O(log log n)</td>

              </tr>

              <tr>

                <td className="border p-3">Worst Case</td>

                <td className="border p-3">O(n)</td>

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
          Interpolation Search only requires a few variables during execution.
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

          <li>Very fast for uniformly distributed data.</li>

          <li>Can outperform Binary Search.</li>

          <li>Uses constant extra memory.</li>

          <li>Efficient for large sorted datasets.</li>

        </ul>

      </section>

      {/* Disadvantages */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Disadvantages
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">

          <li>Works only on sorted arrays.</li>

          <li>Performance drops for non-uniformly distributed data.</li>

          <li>Worst-case complexity is O(n).</li>

        </ul>

      </section>

      {/* Applications */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Applications
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">

          <li>Searching in uniformly distributed databases.</li>

          <li>Large sorted numerical datasets.</li>

          <li>Telephone directories.</li>

          <li>Student record systems.</li>

          <li>Financial and statistical datasets.</li>

        </ul>

      </section>

    </div>
  );
}