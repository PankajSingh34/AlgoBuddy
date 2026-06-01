"use client";

import { useEffect, useState } from "react";

export function calculateReadingTime(text = "") {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return words === 0 ? 0 : Math.ceil(words / 200);
}

export default function ReadingTime({ targetRef }) {
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (!targetRef?.current) {
      return;
    }

    const calculate = () => {
      const text = targetRef.current?.textContent ?? "";
      setReadingTime(calculateReadingTime(text));
    };

    calculate();

    const observer = new MutationObserver(calculate);
    observer.observe(targetRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [targetRef]);

  if (!readingTime) {
    return null;
  }

  return (
    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mb-4">
      📖 {readingTime} min read
    </p>
  );
}
