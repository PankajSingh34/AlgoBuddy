"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Animation() {
  const [text, setText] = useState("AlgoBuddy");

  const frequency = useMemo(() => {
    const map = {};

    for (const ch of text) {
      const key = ch.toLowerCase();

      if (key === " ") continue;

      map[key] = (map[key] || 0) + 1;
    }

    return Object.entries(map);
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
          Enter a String
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {frequency.map(([char, count], index) => (
          <motion.div
            key={char}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-xl border border-gray-200 bg-pink-50 p-5 text-center text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {char}
            </div>

            <div className="mt-2 text-gray-600 dark:text-gray-400">
              Frequency
            </div>

            <div className="text-2xl font-bold">
              {count}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}