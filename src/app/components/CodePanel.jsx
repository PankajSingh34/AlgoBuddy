"use client";

import { useState } from "react";

export default function CodePanel({
  code,
  currentLine = -1,
  language,
  onLanguageChange,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = Object.keys(code);
  const lines = code[language] || [];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="bg-black text-white rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161616] border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-sm">Code Panel</h2>

          {languages.length > 1 && (
            <select
              className="text-black text-xs rounded px-1 py-0.5"
              value={language}
              onChange={(e) => onLanguageChange?.(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`px-2 py-0.5 rounded whitespace-pre ${
                index === currentLine ? "bg-yellow-500 text-black" : ""
              }`}
            >
              <span className="inline-block w-6 text-gray-500 select-none">
                {index + 1}
              </span>
              {line}
            </div>
          ))}
        </pre>
      )}
    </div>
  );
}
