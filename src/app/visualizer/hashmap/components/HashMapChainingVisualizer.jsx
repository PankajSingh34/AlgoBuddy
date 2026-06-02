"use client";
import React, { useMemo, useState } from "react";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { AnimatePresence, motion } from "framer-motion";

const TABLE_SIZE = 8;
const makeTable = () => Array.from({ length: TABLE_SIZE }, () => []);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const HashMapChainingVisualizer = ({ mode = "insert" }) => {
  const [hashMap, setHashMap] = useState(makeTable());
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [insertKey, setInsertKey] = useState("");
  const [insertValue, setInsertValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [toast, setToast] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [activeNode, setActiveNode] = useState({ bucket: null, index: null });
  const [collisionIndex, setCollisionIndex] = useState(null);
  useVisualizerReset(() => {
    setHashMap(makeTable());
    setKeyInput("");
    setValueInput("");
    setInsertKey("");
    setInsertValue("");
    setOperation(null);
    setToast(null);
    setIsAnimating(false);
    setHighlightIndex(null);
    setActiveNode({ bucket: null, index: null });
    setCollisionIndex(null);
  });

  const totalCollisions = useMemo(
    () => hashMap.reduce((sum, bucket) => sum + Math.max(0, bucket.length - 1), 0),
    [hashMap]
  );

  const hashFunction = (key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
      hash = (hash + key.charCodeAt(i)) % TABLE_SIZE;
    }
    return hash;
  };

  const resetHighlights = () => {
    setHighlightIndex(null);
    setActiveNode({ bucket: null, index: null });
    setCollisionIndex(null);
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 1300);
  };

  const applyInsert = async (rawKey, rawValue) => {
    const key = rawKey.trim();
    const value = rawValue.trim();
    if (!key || !value || isAnimating) return;

    const index = hashFunction(key);
    setIsAnimating(true);
    setHighlightIndex(index);
    setOperation(`Key "${key}" hashes to index ${index}`);
    await sleep(450);

    const bucketBefore = hashMap[index];
    const existingIndex = bucketBefore.findIndex((pair) => pair.key === key);

    if (existingIndex === -1 && bucketBefore.length > 0) {
      setCollisionIndex(index);
      setOperation(`Collision Detected at bucket ${index}`);
      showToast("Collision Detected", "collision");
      await sleep(550);
      setOperation(`Key inserted into existing bucket ${index} using separate chaining`);
      await sleep(350);
    }

    if (existingIndex >= 0) {
      setHashMap((prev) => {
        const next = prev.map((bucket) => [...bucket]);
        next[index][existingIndex] = { ...next[index][existingIndex], value };
        return next;
      });
      setActiveNode({ bucket: index, index: existingIndex });
      setOperation(`Updated key "${key}" in bucket ${index}`);
    } else {
      setHashMap((prev) => {
        const next = prev.map((bucket) => [...bucket]);
        next[index].push({ key, value, id: `${key}-${Date.now()}` });
        return next;
      });
      setActiveNode({ bucket: index, index: bucketBefore.length });
      setOperation(`Inserted "${key}: ${value}" at index ${index}`);
    }

    await sleep(700);
    setIsAnimating(false);
    resetHighlights();
  };

  const handleInsert = async () => {
    await applyInsert(keyInput, valueInput);
    setKeyInput("");
    setValueInput("");
  };

  const handleAuxInsert = async () => {
    await applyInsert(insertKey, insertValue);
    setInsertKey("");
    setInsertValue("");
  };

  const handleSearch = async () => {
    const key = keyInput.trim();
    if (!key || isAnimating) return;
    const index = hashFunction(key);
    setIsAnimating(true);
    setHighlightIndex(index);
    setOperation(`Key "${key}" hashes to index ${index}`);
    await sleep(400);

    const bucket = hashMap[index];
    if (bucket.length === 0) {
      setOperation(`Bucket ${index} is empty. Key "${key}" not found`);
      await sleep(650);
      setIsAnimating(false);
      resetHighlights();
      setKeyInput("");
      return;
    }

    for (let i = 0; i < bucket.length; i += 1) {
      setActiveNode({ bucket: index, index: i });
      setOperation(`Traversing chained bucket ${index}: checking "${bucket[i].key}"`);
      await sleep(600);
      if (bucket[i].key === key) {
        setOperation(`Key "${key}" found at index ${index} with value "${bucket[i].value}"`);
        await sleep(700);
        setIsAnimating(false);
        resetHighlights();
        setKeyInput("");
        return;
      }
    }

    setOperation(`Traversal finished. Key "${key}" not found in bucket ${index}`);
    await sleep(700);
    setIsAnimating(false);
    resetHighlights();
    setKeyInput("");
  };

  const handleDelete = async () => {
    const key = keyInput.trim();
    if (!key || isAnimating) return;
    const index = hashFunction(key);
    setIsAnimating(true);
    setHighlightIndex(index);
    setOperation(`Key "${key}" hashes to index ${index}`);
    await sleep(350);

    const bucket = hashMap[index];
    if (bucket.length === 0) {
      setOperation(`Bucket ${index} is empty. Key "${key}" not found`);
      await sleep(650);
      setIsAnimating(false);
      resetHighlights();
      setKeyInput("");
      return;
    }

    for (let i = 0; i < bucket.length; i += 1) {
      setActiveNode({ bucket: index, index: i });
      setOperation(`Traversing chained bucket ${index}: checking "${bucket[i].key}"`);
      await sleep(600);
      if (bucket[i].key === key) {
        setHashMap((prev) => {
          const next = prev.map((b) => [...b]);
          next[index].splice(i, 1);
          return next;
        });
        setOperation(`Deleted key "${key}" from bucket ${index}`);
        await sleep(700);
        setIsAnimating(false);
        resetHighlights();
        setKeyInput("");
        return;
      }
    }

    setOperation(`Traversal finished. Key "${key}" not found in bucket ${index}`);
    await sleep(700);
    setIsAnimating(false);
    resetHighlights();
    setKeyInput("");
  };

  const handleReset = () => {
    setHashMap(makeTable());
    setOperation(null);
    setIsAnimating(false);
    resetHighlights();
    setKeyInput("");
    setValueInput("");
    setInsertKey("");
    setInsertValue("");
  };

  return (
    <main className="container mx-auto px-6 pb-8">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visual hash buckets with separate chaining collision handling
      </p>

      <div className="max-w-5xl mx-auto">
        {mode === "insert" ? (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <input
                type="text"
                placeholder="Key"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-36"
              />
              <input
                type="text"
                placeholder="Value"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-36"
              />
              <button
                onClick={handleInsert}
                disabled={isAnimating}
                className="bg-[#a435f0] text-white px-4 py-2 rounded hover:bg-[#8710d8] disabled:opacity-50"
              >
                Insert
              </button>
              <button
                onClick={handleReset}
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-4">
              <p className="text-sm text-gray-500 mb-3 font-medium">Add entries first:</p>
              <div className="flex flex-wrap gap-3 items-center justify-center">
                <input
                  type="text"
                  placeholder="Key"
                  value={insertKey}
                  onChange={(e) => setInsertKey(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-32"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-32"
                />
                <button
                  onClick={handleAuxInsert}
                  disabled={isAnimating}
                  className="bg-[#a435f0] text-white px-4 py-2 rounded hover:bg-[#8710d8] disabled:opacity-50"
                >
                  Insert
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
              <p className="text-sm text-gray-500 mb-3 font-medium">
                {mode === "search" ? "Search by key:" : "Delete by key:"}
              </p>
              <div className="flex flex-wrap gap-3 items-center justify-center">
                <input
                  type="text"
                  placeholder={mode === "search" ? "Key to search" : "Key to delete"}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-40"
                />
                <button
                  onClick={mode === "search" ? handleSearch : handleDelete}
                  disabled={isAnimating}
                  className={`text-white px-4 py-2 rounded disabled:opacity-50 ${
                    mode === "search" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {mode === "search" ? "Search" : "Delete"}
                </button>
                <button
                  onClick={handleReset}
                  className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Reset
                </button>
              </div>
            </div>
          </>
        )}

        {operation && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg text-center border ${
              collisionIndex !== null
                ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200"
                : "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-primary-dark dark:text-blue-200"
            }`}
          >
            {operation}
          </motion.div>
        )}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg border shadow-lg ${
                toast.type === "collision"
                  ? "bg-orange-100 dark:bg-orange-900/90 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200"
                  : "bg-blue-100 dark:bg-blue-900/90 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200"
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 className="text-xl font-semibold">Hash Table (Size: {TABLE_SIZE})</h2>
            <div className="text-sm px-3 py-1 rounded-full bg-[#faf5ff] dark:bg-[#1a0a2e] border border-[#e9d5ff] dark:border-[#3b1a6e]">
              Collisions: <span className="font-semibold text-[#a435f0]">{totalCollisions}</span>
            </div>
          </div>

          <div className="space-y-2">
            {hashMap.map((bucket, index) => {
              const bucketCollisions = Math.max(0, bucket.length - 1);
              const highlighted = highlightIndex === index;
              const collisionGlow = collisionIndex === index;
              return (
                <motion.div
                  key={index}
                  layout
                  initial={false}
                  animate={{
                    boxShadow: collisionGlow
                      ? "0 0 0 1px rgba(249,115,22,0.8), 0 0 24px rgba(249,115,22,0.35)"
                      : highlighted
                      ? "0 0 0 1px rgba(168,85,247,0.7), 0 0 16px rgba(168,85,247,0.22)"
                      : "0 0 0 0px rgba(0,0,0,0)",
                  }}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    collisionGlow
                      ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20"
                      : highlighted
                      ? "border-[#a435f0] bg-[#faf5ff] dark:bg-[#1a0a2e]"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#a435f0] text-white rounded font-bold text-sm shrink-0 mt-1">
                    {index}
                  </div>

                  <div className="flex-1 min-h-12">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">bucket[{index}]</span>
                      {bucketCollisions > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                          +{bucketCollisions} collision{bucketCollisions > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {bucket.length === 0 ? (
                        <span className="text-gray-400 text-sm">empty</span>
                      ) : (
                        <AnimatePresence>
                          {bucket.map((pair, i) => {
                            const isActive = activeNode.bucket === index && activeNode.index === i;
                            return (
                              <React.Fragment key={pair.id || `${pair.key}-${i}`}>
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                  animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    boxShadow: isActive
                                      ? "0 0 0 1px rgba(59,130,246,0.65), 0 0 14px rgba(59,130,246,0.3)"
                                      : "0 0 0 0px rgba(0,0,0,0)",
                                  }}
                                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                  transition={{ duration: 0.22 }}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border ${
                                    isActive
                                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                                      : "bg-[#f3f4f6] dark:bg-[#222] border-transparent"
                                  }`}
                                >
                                  <span className="font-medium text-[#a435f0]">{pair.key}</span>
                                  <span className="text-gray-500">:</span>
                                  <span>{pair.value}</span>
                                </motion.div>
                                {i < bucket.length - 1 && (
                                  <motion.span
                                    initial={{ opacity: 0.3, x: -2 }}
                                    animate={{ opacity: 1, x: 2 }}
                                    transition={{
                                      duration: 0.55,
                                      repeat: Infinity,
                                      repeatType: "reverse",
                                      ease: "easeInOut",
                                    }}
                                    className="text-orange-500 dark:text-orange-300 text-base font-semibold select-none"
                                  >
                                    →
                                  </motion.span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-lg border border-[#e9d5ff] dark:border-[#3b1a6e] text-sm text-gray-600 dark:text-gray-400">
            Hash Function: sum of char codes % {TABLE_SIZE}. Collision handling: Separate Chaining.
          </div>
        </div>
      </div>
    </main>
  );
};

export default HashMapChainingVisualizer;
