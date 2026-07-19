"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const code = `function rabinKarp(text, pattern) {
  const d = 256;
  const q = 101;

  const n = text.length;
  const m = pattern.length;

  let patternHash = 0;
  let textHash = 0;
  let h = 1;

  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  for (let i = 0; i < m; i++) {
    patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
    textHash = (d * textHash + text.charCodeAt(i)) % q;
  }

  for (let i = 0; i <= n - m; i++) {

    if (patternHash === textHash) {

      let j = 0;

      while (j < m && text[i + j] === pattern[j]) {
        j++;
      }

      if (j === m) {
        return i;
      }

    }

    if (i < n - m) {
      textHash =
        (d * (textHash - text.charCodeAt(i) * h) +
          text.charCodeAt(i + m)) % q;

      if (textHash < 0) {
        textHash += q;
      }
    }
  }

  return -1;
}

// Example
const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";

console.log(rabinKarp(text, pattern));
`;

export default function CodeBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

      <div className="flex items-center justify-between px-5 py-4 bg-slate-100 dark:bg-slate-800">

        <h2 className="text-lg font-bold">
          JavaScript Implementation
        </h2>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>

      </div>

      <pre className="overflow-x-auto p-6 text-sm bg-[#0d1117] text-green-400">
        <code>{code}</code>
      </pre>

    </div>
  );
}