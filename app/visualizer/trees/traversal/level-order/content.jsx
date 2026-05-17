"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { useEffect, useState } from "react";

const content = () => {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    };

    updateTheme();
    setMounted(true);

    window.addEventListener("storage", updateTheme);
    window.addEventListener("themeChange", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("themeChange", updateTheme);
    };
  }, []);

  const paragraphs = [
    "Level-order traversal, also known as Breadth-First Search (BFS) for trees, visits nodes level by level from top to bottom. Unlike depth-first traversals that go deep before visiting siblings, level-order processes all nodes at the current depth before moving to the next level using a queue data structure.",
    "Level-order traversal is essential for finding the shortest path in unweighted trees, serializing trees for storage, printing trees in a structured format, and solving problems like finding the minimum depth of a tree or the right-side view of a binary tree.",
  ];

  const algorithmSteps = [
    { points: "Enqueue the root node into the queue" },
    { points: "Dequeue a node, visit it (process its value)" },
    { points: "Enqueue its left child (if exists)" },
    { points: "Enqueue its right child (if exists)" },
    { points: "Repeat steps 2-4 until the queue is empty" },
  ];

  const walkthroughSteps = [
    { points: "Queue = [1]. Dequeue 1 → visit 1. Enqueue 2, 3." },
    { points: "Queue = [2, 3]. Dequeue 2 → visit 2. Enqueue 4, 5." },
    { points: "Queue = [3, 4, 5]. Dequeue 3 → visit 3. Enqueue 6." },
    { points: "Queue = [4, 5, 6]. Dequeue 4 → visit 4. No children." },
    { points: "Queue = [5, 6]. Dequeue 5 → visit 5. No children." },
    { points: "Queue = [6]. Dequeue 6 → visit 6. No children." },
    { points: "Queue = []. Traversal complete." },
    { points: "Final order: [1, 2, 3, 4, 5, 6]" },
  ];

  const complexityList = [
    { points: "Time Complexity: O(n) — visits each node exactly once" },
    { points: "Space Complexity: O(w) — queue holds at most one level (w = max width)" },
  ];

  const applications = [
    { points: "Finding the shortest path in unweighted trees" },
    { points: "Tree serialization for storage or transmission" },
    { points: "Printing trees level by level in structured format" },
    { points: "Finding minimum depth or maximum width of a tree" },
    { points: "Right-side view / left-side view of a binary tree" },
  ];

  return (
    <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 md:gap-4">
      <div className="col-span-1">
        <div className="hidden md:block">
          {mounted && (
            <iframe
              key={theme}
              src={
                theme === "dark"
                  ? "https://hw.glich.co/resources/embed/daily/dsa?theme=dark"
                  : "https://hw.glich.co/resources/embed/daily/dsa?theme=light"
              }
              width="100%"
              height="400"
              title="Daily DSA Challenge"
            ></iframe>
          )}
        </div>
        <div className="flex justify-center">
          <span className="text-xs hidden md:block">
            Daily DSA Challenge by{" "}
            <a
              href="https://hw.glich.co/resources/daily"
              target="_blank"
              className="underline hover:text-blue-500 duration-300"
            >
              Hello World
            </a>
          </span>
        </div>
      </div>
      <article className="col-span-4 max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Level-Order Traversal?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[0]}
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Algorithm (BFS using Queue)
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              The level-order traversal follows a queue-based iterative pattern:
            </p>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {algorithmSteps.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Step-by-Step Walkthrough
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Consider this tree: Root = 1, Left = 2 (with children 4, 5), Right = 3 (with left child 6).
            </p>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {walkthroughSteps.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Queue-Based Approach
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="text-xs bg-[#f3f4f6] dark:bg-[#1a1a2e] p-3 rounded overflow-x-auto font-mono text-[#374151] dark:text-[#d1d5db] mb-4">
{`levelOrder(root) {
  if (!root) return [];
  queue = [root], result = [];
  while (queue.length) {
    curr = queue.shift();
    result.push(curr.value);
    if (curr.left) queue.push(curr.left);
    if (curr.right) queue.push(curr.right);
  }
  return result;
}`}
            </pre>
            <ul className="space-y-1 list-disc pl-5 marker:text-gray-500">
              {complexityList.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2 text-sm">
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-xs">
                    {item.points.split(":")[0]}:
                  </span>
                  <span className="ml-1">{item.points.split(":")[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time & Space Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Level-order traversal visits each of the n nodes exactly once, giving O(n) time complexity.
              The queue holds at most one level of nodes — in a perfect binary tree, this can be up to n/2 nodes at the leaf level, giving O(n) worst-case space.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-400">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="border border-gray-400 p-3">Metric</th>
                    <th className="border border-gray-400 p-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="border border-gray-400 p-3">Time Complexity</td>
                    <td className="border border-gray-400 p-3 font-mono">O(n)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td className="border border-gray-400 p-3">Space Complexity</td>
                    <td className="border border-gray-400 p-3 font-mono">O(w) — queue width</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ComplexityGraph
              bestCase={(n) => n}
              averageCase={(n) => n}
              worstCase={(n) => n}
              maxN={25}
            />
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Applications
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {applications.map((items, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {items.points}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="px-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                {paragraphs[1]}
              </p>
            </div>
          </div>
        </section>
      </article>

      <div className="block md:hidden w-full">
        {mounted && (
          <iframe
            key={theme}
            src={
              theme === "dark"
                ? "https://hw.glich.co/resources/embed/daily/dsa?theme=dark"
                : "https://hw.glich.co/resources/embed/daily/dsa?theme=light"
            }
            width="100%"
            height="320"
            title="Daily DSA Challenge"
          ></iframe>
        )}
        <div className="flex justify-center pb-8">
          <span className="text-xs">
            Daily DSA Challenge By{" "}
            <a
              href="https://hw.glich.co/resources/daily"
              target="_blank"
              className="underline hover:text-blue-500 duration-300"
            >
              Hello World
            </a>
          </span>
        </div>
      </div>
    </main>
  );
};

export default content;
