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

const TernarySearchContent = () => {
  return (
    <div className="space-y-8">

      {/* Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Overview</h2>

        <p className="text-gray-700 dark:text-gray-300 leading-8">
          <strong>Ternary Search</strong> is a divide-and-conquer searching
          algorithm used to find an element in a <strong>sorted array</strong>.
          Instead of dividing the search space into two parts like Binary Search,
          it divides the array into <strong>three equal parts</strong> using two
          middle indices (<code>mid1</code> and <code>mid2</code>). Based on the
          comparison with these middle elements, one-third of the array is
          selected for the next search iteration.
        </p>
      </section>

      {/* Working */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="text-purple-600" />
          How Ternary Search Works
        </h2>

        <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Start with two pointers: <strong>low</strong> and <strong>high</strong>.</li>
          <li>Find two middle indices:</li>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono">
            mid1 = low + (high - low) / 3
            <br />
            mid2 = high - (high - low) / 3
          </div>

          <li>Compare the target with both middle elements.</li>

          <li>If the target equals either middle element, return its index.</li>

          <li>
            If the target is smaller than <strong>mid1</strong>, search the left
            third.
          </li>

          <li>
            If the target is greater than <strong>mid2</strong>, search the right
            third.
          </li>

          <li>
            Otherwise, search the middle third.
          </li>

          <li>
            Repeat until the target is found or the search range becomes empty.
          </li>
        </ol>
      </section>

      {/* Complexity */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Clock className="text-blue-500" />
          Time Complexity
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">

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
                <td className="p-3">O(log₃ n)</td>
              </tr>

              <tr className="border-t">
                <td className="p-3">Worst Case</td>
                <td className="p-3">O(log₃ n)</td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

      {/* Space Complexity */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Database className="text-green-600" />
          Space Complexity
        </h2>

        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
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
          <li>Efficient searching in sorted arrays.</li>
          <li>Uses divide-and-conquer strategy.</li>
          <li>Reduces the search space to one-third in each iteration.</li>
          <li>Easy to understand once Binary Search is known.</li>
          <li>Works well for theoretical divide-and-conquer problems.</li>
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
          <li>Performs more comparisons than Binary Search.</li>
          <li>Binary Search is generally faster in practice.</li>
          <li>Not suitable for unsorted data.</li>
        </ul>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="text-yellow-500" />
          Applications
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Searching in sorted arrays.</li>
          <li>Competitive programming problems.</li>
          <li>Mathematical optimization problems.</li>
          <li>Finding maxima or minima in unimodal functions.</li>
          <li>Divide-and-conquer algorithm demonstrations.</li>
        </ul>
      </section>

      {/* Comparison */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Binary Search vs Ternary Search
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">

            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3 text-left">Feature</th>
                <th className="p-3 text-left">Binary Search</th>
                <th className="p-3 text-left">Ternary Search</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-t">
                <td className="p-3">Divisions</td>
                <td className="p-3">2</td>
                <td className="p-3">3</td>
              </tr>

              <tr className="border-t">
                <td className="p-3">Middle Points</td>
                <td className="p-3">1</td>
                <td className="p-3">2</td>
              </tr>

              <tr className="border-t">
                <td className="p-3">Time Complexity</td>
                <td className="p-3">O(log₂ n)</td>
                <td className="p-3">O(log₃ n)</td>
              </tr>

              <tr className="border-t">
                <td className="p-3">Comparisons</td>
                <td className="p-3">Fewer</td>
                <td className="p-3">More</td>
              </tr>

              <tr className="border-t">
                <td className="p-3">Practical Performance</td>
                <td className="p-3">Usually Faster</td>
                <td className="p-3">Usually Slower</td>
              </tr>

            </tbody>

          </table>
        </div>
      </section>

    </div>
  );
};

export default TernarySearchContent;