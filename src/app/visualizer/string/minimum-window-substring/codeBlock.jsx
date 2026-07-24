"use client";

import { useState } from "react";

const code = `function minWindow(s, t) {
    if (!s.length || !t.length) return "";

    const need = {};
    const window = {};

    for (const ch of t) {
        need[ch] = (need[ch] || 0) + 1;
    }

    let required = Object.keys(need).length;
    let formed = 0;

    let left = 0;
    let right = 0;

    let minLength = Infinity;
    let start = 0;

    while (right < s.length) {
        const ch = s[right];
        window[ch] = (window[ch] || 0) + 1;

        if (need[ch] && window[ch] === need[ch]) {
            formed++;
        }

        while (left <= right && formed === required) {

            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                start = left;
            }

            const leftChar = s[left];
            window[leftChar]--;

            if (
                need[leftChar] &&
                window[leftChar] < need[leftChar]
            ) {
                formed--;
            }

            left++;
        }

        right++;
    }

    return minLength === Infinity
        ? ""
        : s.substring(start, start + minLength);
}

const text = "ADOBECODEBANC";
const pattern = "ABC";

console.log(minWindow(text, pattern));
`;

export default function CodeBlock() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1b1b1b] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          JavaScript Implementation
        </h2>

        <button
          onClick={copyCode}
          className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-medium"
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      <pre className="overflow-x-auto rounded-xl bg-slate-100 dark:bg-slate-900 p-5 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}