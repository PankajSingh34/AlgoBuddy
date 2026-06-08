"use client";
import React, { useState } from "react";

const RadixSortCodeBlock = () => {
  const code = {
    javascript: `function getDigit(num, place) {
  return Math.floor(num / place) % 10;
}

function radixSort(arr) {
  const max = Math.max(...arr);
  let place = 1;

  while (Math.floor(max / place) > 0) {
    const buckets = Array.from({ length: 10 }, () => []);

    for (const num of arr) {
      const digit = getDigit(num, place);
      buckets[digit].push(num);
    }

    arr = [].concat(...buckets);
    place *= 10;
  }

  return arr;
}`,
    python: `def get_digit(num, place):
    return (num // place) % 10

def radix_sort(arr):
    if not arr:
        return []

    max_val = max(arr)
    place = 1

    while max_val // place > 0:
        buckets = [[] for _ in range(10)]

        for num in arr:
            digit = get_digit(num, place)
            buckets[digit].append(num)

        arr = [num for bucket in buckets for num in bucket]
        place *= 10

    return arr`,
    cpp: `#include <vector>
#include <algorithm>
using namespace std;

int getDigit(int num, int place) {
    return (num / place) % 10;
}

vector<int> radixSort(vector<int> arr) {
    if (arr.empty()) return arr;

    int maxVal = *max_element(arr.begin(), arr.end());

    for (int place = 1; maxVal / place > 0; place *= 10) {
        vector<vector<int>> buckets(10);

        for (int num : arr)
            buckets[getDigit(num, place)].push_back(num);

        arr.clear();
        for (auto& bucket : buckets)
            for (int num : bucket)
                arr.push_back(num);
    }

    return arr;
}`,
  };

  const [active, setActive] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Radix Sort Code</h2>

      <div className="flex gap-2 mb-4">
        {Object.keys(code).map((lang) => (
          <button
            key={lang}
            onClick={() => setActive(lang)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              active === lang
                ? "bg-[#a435f0] text-white"
                : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
            }`}
          >
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative">
        <pre className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          <code>{code[active]}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-3 py-1 rounded text-xs bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default RadixSortCodeBlock;
