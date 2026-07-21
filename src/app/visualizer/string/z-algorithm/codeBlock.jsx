"use client";

import { useState } from "react";

const code = `function zAlgorithmSearch(text, pattern) {
    const concat = pattern + "$" + text;
    const n = concat.length;
    const Z = new Array(n).fill(0);

    let left = 0;
    let right = 0;

    for (let i = 1; i < n; i++) {
        if (i <= right) {
            Z[i] = Math.min(right - i + 1, Z[i - left]);
        }

        while (
            i + Z[i] < n &&
            concat[Z[i]] === concat[i + Z[i]]
        ) {
            Z[i]++;
        }

        if (i + Z[i] - 1 > right) {
            left = i;
            right = i + Z[i] - 1;
        }
    }

    const result = [];

    for (let i = 0; i < n; i++) {
        if (Z[i] === pattern.length) {
            result.push(i - pattern.length - 1);
        }
    }

    return result;
}

const text = "aabcaabxaaaz";
const pattern = "aabx";

console.log(zAlgorithmSearch(text, pattern));
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