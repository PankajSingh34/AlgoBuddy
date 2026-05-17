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
    "The diameter of a tree (also called the longest path) is the length of the longest path between any two nodes in the tree. This path may or may not pass through the root. The diameter is measured in terms of the number of edges along the path between the two farthest nodes.",
    "Applications of tree diameter include network design where minimizing the diameter reduces latency, finding the most distant nodes in a network topology, analyzing biological tree structures, and solving competitive programming problems involving tree distances.",
  ];

  const algorithmSteps = [
    { points: "Pick any node (usually root) and run DFS/BFS to find the farthest node X" },
    { points: "Run a second DFS/BFS starting from node X" },
    { points: "The farthest node from X is node Y" },
    { points: "The distance between X and Y is the tree diameter" },
  ];

  const walkthroughSteps = [
    { points: "Consider a tree with nodes 1-2-3-4-5-6 arranged linearly" },
    { points: "Pass 1: Start DFS from node 1. Farthest node = 6 (distance 5 edges)" },
    { points: "Pass 2: Start DFS from node 6. Farthest node = 1 (distance 5 edges)" },
    { points: "Diameter = distance between 1 and 6 = 5 edges" },
    { points: "For a balanced tree, the diameter passes through the root" },
    { points: "The two farthest nodes are always leaf nodes" },
  ];

  const twoPassComplexity = [
    { points: "Time Complexity: O(n) — two DFS traversals" },
    { points: "Space Complexity: O(h) — recursion stack for DFS" },
  ];

  const dpComplexity = [
    { points: "Time Complexity: O(n) — single DFS traversal" },
    { points: "Space Complexity: O(h) — recursion stack for DFS" },
  ];

  const applications = [
    { points: "Network design — minimizing tree diameter reduces latency" },
    { points: "Finding the most distant nodes in a topology" },
    { points: "Analyzing biological tree structures (dendrograms)" },
    { points: "Competitive programming tree distance problems" },
    { points: "Graph center computation (middle of the diameter)" },
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
            What is Tree Diameter?
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
            Algorithm (Two-Pass DFS)
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              The two-pass DFS approach finds the diameter efficiently:
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
              Finding the diameter of a tree using the two-pass method:
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
            Two-Pass DFS vs DP Approach
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg border border-[#e5e7eb] dark:border-[#333]">
              <h3 className="font-bold text-[#1a1a1a] dark:text-white mb-2">Two-Pass DFS</h3>
              <pre className="text-xs bg-[#f3f4f6] dark:bg-[#1a1a2e] p-3 rounded overflow-x-auto font-mono text-[#374151] dark:text-[#d1d5db]">
{`// Find farthest node from given node
function dfs(node, adj, visited) {
  visited.add(node);
  let farthest = { node, dist: 0 };
  for (let neighbor of adj[node]) {
    if (!visited.has(neighbor)) {
      let result = dfs(neighbor, adj, visited);
      result.dist++;
      if (result.dist > farthest.dist)
        farthest = result;
    }
  }
  return farthest;
}`}
              </pre>
              <ul className="mt-3 space-y-1 list-disc pl-5 marker:text-gray-500">
                {twoPassComplexity.map((item, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2 text-sm">
                    <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-xs">
                      {item.points.split(":")[0]}:
                    </span>
                    <span className="ml-1">{item.points.split(":")[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-[#e5e7eb] dark:border-[#333]">
              <h3 className="font-bold text-[#1a1a1a] dark:text-white mb-2">DP (Single Pass)</h3>
              <pre className="text-xs bg-[#f3f4f6] dark:bg-[#1a1a2e] p-3 rounded overflow-x-auto font-mono text-[#374151] dark:text-[#d1d5db]">
{`let diameter = 0;
function height(node) {
  if (!node) return 0;
  leftHeight = height(node.left);
  rightHeight = height(node.right);
  diameter = Math.max(diameter,
    leftHeight + rightHeight);
  return 1 + Math.max(leftHeight,
    rightHeight);
}`}
              </pre>
              <ul className="mt-3 space-y-1 list-disc pl-5 marker:text-gray-500">
                {dpComplexity.map((item, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2 text-sm">
                    <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-xs">
                      {item.points.split(":")[0]}:
                    </span>
                    <span className="ml-1">{item.points.split(":")[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time & Space Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Both the two-pass DFS and the single-pass DP approach achieve O(n) time complexity, visiting each node a constant number of times. The space complexity is O(h) for the recursion stack in both methods.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-400">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="border border-gray-400 p-3">Approach</th>
                    <th className="border border-gray-400 p-3">Time</th>
                    <th className="border border-gray-400 p-3">Space</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="border border-gray-400 p-3">Two-Pass DFS</td>
                    <td className="border border-gray-400 p-3 font-mono">O(n)</td>
                    <td className="border border-gray-400 p-3 font-mono">O(h)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td className="border border-gray-400 p-3">DP (Single Pass)</td>
                    <td className="border border-gray-400 p-3 font-mono">O(n)</td>
                    <td className="border border-gray-400 p-3 font-mono">O(h)</td>
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
