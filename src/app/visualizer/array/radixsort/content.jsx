import React from "react";

const RadixSortContent = () => {
  return (
    <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="text-2xl font-semibold mb-4">What is Radix Sort?</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Radix Sort is a non-comparative integer sorting algorithm that sorts data by processing individual digits. It groups numbers into buckets based on each digit position — starting from the least significant digit (ones) through to the most significant digit — using Counting Sort as a stable subroutine at each pass.
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-6">
        <li>It avoids element-to-element comparisons entirely, making it faster than O(n log n) comparison sorts when the digit count d is small.</li>
        <li>LSD (Least Significant Digit) Radix Sort processes digits from right to left, preserving stability at each pass.</li>
        <li>It is particularly effective for sorting large sets of integers, fixed-length strings, or dates.</li>
        <li>Each pass groups elements into exactly 10 buckets (0–9 for decimal), then collects them back in order.</li>
      </ul>

      <h3 className="text-xl font-semibold mb-3">How It Works — Step by Step</h3>
      <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-6">
        <li>Find the maximum number to determine how many digit passes are needed.</li>
        <li>For each digit place (ones, tens, hundreds, ...):</li>
        <li className="ml-6">Distribute every element into bucket 0–9 based on that digit.</li>
        <li className="ml-6">Collect elements from buckets in order (bucket 0 first, then 1, …, then 9) back into the array.</li>
        <li>After d passes the array is fully sorted.</li>
      </ol>

      <h3 className="text-xl font-semibold mb-3">Complexity Analysis</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="text-left p-3 border-b border-gray-200 dark:border-gray-700">Case</th>
              <th className="text-left p-3 border-b border-gray-200 dark:border-gray-700">Time Complexity</th>
              <th className="text-left p-3 border-b border-gray-200 dark:border-gray-700">Space Complexity</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr>
              <td className="p-3 border-b border-gray-100 dark:border-gray-800">Best</td>
              <td className="p-3 border-b border-gray-100 dark:border-gray-800 font-mono">O(d × (n + k))</td>
              <td className="p-3 border-b border-gray-100 dark:border-gray-800 font-mono" rowSpan={3}>O(n + k)</td>
            </tr>
            <tr>
              <td className="p-3 border-b border-gray-100 dark:border-gray-800">Average</td>
              <td className="p-3 border-b border-gray-100 dark:border-gray-800 font-mono">O(d × (n + k))</td>
            </tr>
            <tr>
              <td className="p-3">Worst</td>
              <td className="p-3 font-mono">O(d × (n + k))</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Where <strong>n</strong> = number of elements, <strong>d</strong> = number of digits in the maximum value, and <strong>k</strong> = base (10 for decimal). Space is O(n + k) for the bucket buffers.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">When to Use Radix Sort</h3>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
        <li>Sorting large arrays of integers or fixed-width strings where d ≪ log₂ n.</li>
        <li>Sorting phone numbers, ZIP codes, dates, or similar fixed-length records.</li>
        <li>When a stable, linear-time sort is required and the key range is bounded.</li>
        <li>Avoid Radix Sort for floating-point numbers or highly variable-length strings.</li>
      </ul>
    </div>
  );
};

export default RadixSortContent;
