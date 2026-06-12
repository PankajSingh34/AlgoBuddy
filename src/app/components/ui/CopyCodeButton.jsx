"use client";

import { useState } from "react";

export default function CopyCodeButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="
        absolute top-2 right-2
        bg-purple-600 hover:bg-purple-700
        text-white text-xs font-medium
        px-3 py-1 rounded-md
        transition-all duration-200
        cursor-pointer z-10
      "
    >
      {copied ? "Copied! ✅" : "Copy 📋"}
    </button>
  );
}