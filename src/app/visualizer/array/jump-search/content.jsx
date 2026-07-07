"use client";

import React from "react";
import {
  Clock,
  Database,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
} from "lucide-react";

const JumpSearchContent = () => {
  return (
    <div className="space-y-8">

      {/* Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Overview
        </h2>

        <p className="text-gray-700 dark:text-gray-300 leading-8">
          <strong>Jump Search</strong> is an efficient searching algorithm
          designed for <strong>sorted arrays</strong>. Instead of checking every
          element one by one, it jumps ahead by a fixed block size (usually √n)
          until it finds the block where the target may exist. It then performs
          a linear search within that block.
        </p>
      </section>

      {/* Working */}
      <section>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="text-purple-600" />
          How Jump Search Works
        </h2>

        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">

          <li>Ensure the array is sorted.</li>

          <li>
            Compute the jump size as:
          </li>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono">
            Jump Size = √n
          </div>

          <li>
            Jump ahead by one block at a time.
          </li>

          <li>
            Stop when the current block contains the target or exceeds it.
          </li>

          <li>
            Perform a linear search inside that block.
          </li>

          <li>
            Return the index if found; otherwise return -1.
          </li>

        </ol>

      </section>

      {/* Time Complexity */}

      <section>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Clock className="text-blue-500" />
          Time Complexity
        </h2>

        <table className="min-w-full border border-gray-300 dark:border-gray-700">

          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-3 text-left">Case</th>
              <th className="p-3 text-left">Complexity</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-t">
              <td className="p-3">Best Case</td>
              <td className="p-3">O(1)</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Average Case</td>
              <td className="p-3">O(√n)</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Worst Case</td>
              <td className="p-3">O(√n)</td>
            </tr>

          </tbody>

        </table>

      </section>

      {/* Space */}

      <section>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Database className="text-green-600" />
          Space Complexity
        </h2>

        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
          <strong>O(1)</strong> (Iterative implementation)
        </div>

      </section>

      {/* Advantages */}

      <section>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-500" />
          Advantages
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">

          <li>Faster than Linear Search for large sorted arrays.</li>

          <li>Easy to understand and implement.</li>

          <li>No recursion required.</li>

          <li>Works efficiently on sequential storage.</li>

          <li>Reduces unnecessary comparisons.</li>

        </ul>

      </section>

      {/* Disadvantages */}

      <section>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <XCircle className="text-red-500" />
          Disadvantages
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">

          <li>Requires the array to be sorted.</li>

          <li>Slower than Binary Search.</li>

          <li>Not suitable for linked lists.</li>

          <li>Performance depends on jump size.</li>

        </ul>

      </section>

      {/* Applications */}

      <section>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="text-yellow-500" />
          Applications
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">

          <li>Searching in large sorted arrays.</li>

          <li>Memory-efficient searching.</li>

          <li>Database indexing.</li>

          <li>File searching.</li>

          <li>Educational demonstrations of search algorithms.</li>

        </ul>

      </section>

      {/* Comparison */}

      <section>

        <h2 className="text-2xl font-bold mb-4">
          Jump Search vs Binary Search
        </h2>

        <table className="min-w-full border border-gray-300 dark:border-gray-700">

          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">Jump Search</th>
              <th className="p-3 text-left">Binary Search</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-t">
              <td className="p-3">Requirement</td>
              <td className="p-3">Sorted Array</td>
              <td className="p-3">Sorted Array</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Time Complexity</td>
              <td className="p-3">O(√n)</td>
              <td className="p-3">O(log n)</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Extra Space</td>
              <td className="p-3">O(1)</td>
              <td className="p-3">O(1)</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Searching Strategy</td>
              <td className="p-3">Jump + Linear Search</td>
              <td className="p-3">Divide & Conquer</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Practical Speed</td>
              <td className="p-3">Moderate</td>
              <td className="p-3">Fast</td>
            </tr>

          </tbody>

        </table>

      </section>

    </div>
  );
};

export default JumpSearchContent;