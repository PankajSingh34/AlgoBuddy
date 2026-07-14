"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Animation() {
  const [first, setFirst] = useState("listen");
  const [second, setSecond] = useState("silent");

  const result = useMemo(() => {
    const normalize = (str) =>
      str.toLowerCase().replace(/\s+/g, "").split("").sort().join("");

    const a = normalize(first);
    const b = normalize(second);

    return {
      isAnagram: a === b,
      firstSorted: a,
      secondSorted: b,
    };
  }, [first, second]);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            First String
          </label>

          <input
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            placeholder="Enter first string"
          />
        </div>

        <div>
          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Second String
          </label>

          <input
            value={second}
            onChange={(e) => setSecond(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            placeholder="Enter second string"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          layout
          className="rounded-xl border border-gray-200 bg-pink-50 p-5 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <h3 className="font-bold text-pink-600 dark:text-pink-400 mb-3">
            First String (Sorted)
          </h3>

          <div className="flex flex-wrap gap-2">
            {result.firstSorted.split("").map((ch, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold dark:bg-pink-600"
              >
                {ch}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          className="rounded-xl border border-gray-200 bg-pink-50 p-5 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <h3 className="font-bold text-pink-600 dark:text-pink-400 mb-3">
            Second String (Sorted)
          </h3>

          <div className="flex flex-wrap gap-2">
            {result.secondSorted.split("").map((ch, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold dark:bg-pink-600"
              >
                {ch}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        layout
        className={`rounded-xl p-6 text-center text-xl font-bold ${
          result.isAnagram
            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200"
            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200"
        }`}
      >
        {result.isAnagram
          ? "✅ These strings are Anagrams"
          : "❌ These strings are NOT Anagrams"}
      </motion.div>
    </div>
  );
}