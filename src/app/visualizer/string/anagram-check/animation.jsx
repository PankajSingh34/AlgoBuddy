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
          <label className="font-medium text-sm">
            First String
          </label>

          <input
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter first string"
          />
        </div>

        <div>
          <label className="font-medium text-sm">
            Second String
          </label>

          <input
            value={second}
            onChange={(e) => setSecond(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter second string"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          layout
          className="rounded-xl border bg-pink-50 p-5"
        >
          <h3 className="font-bold text-pink-600 mb-3">
            First String (Sorted)
          </h3>

          <div className="flex flex-wrap gap-2">
            {result.firstSorted.split("").map((ch, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold"
              >
                {ch}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          className="rounded-xl border bg-pink-50 p-5"
        >
          <h3 className="font-bold text-pink-600 mb-3">
            Second String (Sorted)
          </h3>

          <div className="flex flex-wrap gap-2">
            {result.secondSorted.split("").map((ch, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold"
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
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {result.isAnagram
          ? "✅ These strings are Anagrams"
          : "❌ These strings are NOT Anagrams"}
      </motion.div>
    </div>
  );
}