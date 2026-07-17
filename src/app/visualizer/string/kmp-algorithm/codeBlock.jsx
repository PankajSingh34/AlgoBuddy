"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

const code = `function computeLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);

  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

function KMPSearch(text, pattern) {
  const lps = computeLPS(pattern);

  let i = 0;
  let j = 0;

  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }

    if (j === pattern.length) {
      console.log("Pattern found at index", i - j);
      j = lps[j - 1];
    } else if (
      i < text.length &&
      pattern[j] !== text[i]
    ) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
}`;

export default function CodeBlock() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border bg-[#0d1117]">

      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">

        <h2 className="text-white font-semibold">
          JavaScript Implementation
        </h2>

        <button
          onClick={copyCode}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition"
        >
          <Copy size={16} />

          {copied ? "Copied!" : "Copy"}
        </button>

      </div>

      <pre className="overflow-x-auto p-6 text-sm text-green-400">
        <code>{code}</code>
      </pre>

    </div>
  );
}