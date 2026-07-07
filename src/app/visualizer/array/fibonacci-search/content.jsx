"use client";

import React from "react";

export default function Content() {
  return (
    <div className="space-y-10">

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Overview</h2>

        <p className="text-gray-700 dark:text-gray-300 leading-8">
          <strong>Fibonacci Search</strong> is a searching algorithm used to
          find an element in a <strong>sorted array</strong>. Instead of
          dividing the array into halves like Binary Search, Fibonacci Search
          uses <strong>Fibonacci numbers</strong> to determine the probe
          positions. It is particularly useful when random memory access is
          expensive because it relies on addition and subtraction instead of
          division.
        </p>
      </section>

      {/* Working */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          How Fibonacci Search Works
        </h2>

        <ol className="list-decimal ml-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Ensure the array is sorted in ascending order.</li>
          <li>Generate Fibonacci numbers until one is greater than or equal to the array size.</li>
          <li>Use the Fibonacci sequence to determine the probe index.</li>
          <li>Compare the target with the probe element.</li>
          <li>
            If the target is smaller, move to the left portion by adjusting the
            Fibonacci numbers.
          </li>
          <li>
            If the target is larger, move to the right portion and update the
            offset.
          </li>
          <li>Repeat until the target is found or the search space becomes empty.</li>
        </ol>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Example</h2>

        <div className="bg-gray-100 dark:bg-neutral-900 rounded-xl p-5 font-mono">
          <p>Array = [10, 20, 30, 40, 50, 60, 70]</p>
          <p>Target = 50</p>

          <br />

          <p>Step 1 → Generate Fibonacci numbers.</p>
          <p>Step 2 → Probe at calculated Fibonacci index.</p>
          <p>Step 3 → Compare with 50.</p>
          <p>Step 4 → Narrow the search range.</p>
          <p>Step 5 → Target found at index 4.</p>
        </div>
      </section>

      {/* Complexity */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Time Complexity</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">

            <thead className="bg-violet-100 dark:bg-violet-900">
              <tr>
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

              <tr>
                <td className="border p-3">Space Complexity</td>
                <td className="border p-3">O(1)</td>
              </tr>
            </tbody>

          </table>
        </div>
      </section>

      {/* Advantages */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Advantages</h2>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Works efficiently on sorted arrays.</li>
          <li>Requires only constant extra space.</li>
          <li>Uses addition and subtraction instead of division.</li>
          <li>Can perform better than Binary Search on certain storage devices.</li>
          <li>Simple iterative implementation.</li>
        </ul>
      </section>

      {/* Disadvantages */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Disadvantages</h2>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Only works on sorted arrays.</li>
          <li>Requires preprocessing of Fibonacci numbers.</li>
          <li>Usually not faster than Binary Search on modern computers.</li>
          <li>Less commonly used in practical applications.</li>
        </ul>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Applications</h2>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Searching large sorted datasets.</li>
          <li>Database indexing.</li>
          <li>Memory-constrained systems.</li>
          <li>Searching data stored on slow-access storage devices.</li>
          <li>Educational demonstrations of divide-and-conquer searching.</li>
        </ul>
      </section>

      {/* Comparison */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          Fibonacci Search vs Binary Search
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">

            <thead className="bg-violet-100 dark:bg-violet-900">
              <tr>
                <th className="border p-3">Feature</th>
                <th className="border p-3">Fibonacci Search</th>
                <th className="border p-3">Binary Search</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-3">Requirement</td>
                <td className="border p-3">Sorted Array</td>
                <td className="border p-3">Sorted Array</td>
              </tr>

              <tr>
                <td className="border p-3">Time Complexity</td>
                <td className="border p-3">O(log n)</td>
                <td className="border p-3">O(log n)</td>
              </tr>

              <tr>
                <td className="border p-3">Space Complexity</td>
                <td className="border p-3">O(1)</td>
                <td className="border p-3">O(1)</td>
              </tr>

              <tr>
                <td className="border p-3">Uses Division</td>
                <td className="border p-3">No</td>
                <td className="border p-3">Yes</td>
              </tr>

              <tr>
                <td className="border p-3">Uses Fibonacci Numbers</td>
                <td className="border p-3">Yes</td>
                <td className="border p-3">No</td>
              </tr>
            </tbody>

          </table>
        </div>
      </section>

    </div>
  );
}