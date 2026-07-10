"use client";
import { memo, useMemo } from "react";

const HighlightText = memo(function HighlightText({ text, query, className = "" }) {
  const parts = useMemo(() => {
    if (!query.trim() || !text) {
      return null;
    }

    const str = String(text);
    const lower = str.toLowerCase();
    const lowerQuery = query.toLowerCase();

    if (!lower.includes(lowerQuery)) {
      return null;
    }

    const result = [];
    let lastIndex = 0;

    let matchIndex = lower.indexOf(lowerQuery, lastIndex);
    while (matchIndex !== -1) {
      if (matchIndex > lastIndex) {
        result.push(str.slice(lastIndex, matchIndex));
      }
      result.push(
        <mark
          key={matchIndex}
          className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5 not-italic font-semibold"
        >
          {str.slice(matchIndex, matchIndex + query.length)}
        </mark>
      );
      lastIndex = matchIndex + query.length;
      matchIndex = lower.indexOf(lowerQuery, lastIndex);
    }

    if (lastIndex < str.length) {
      result.push(str.slice(lastIndex));
    }

    return result;
  }, [text, query]);

  if (!parts) {
    return <span className={className}>{text || ""}</span>;
  }

  return <span className={className}>{parts}</span>;
});

export default HighlightText;
