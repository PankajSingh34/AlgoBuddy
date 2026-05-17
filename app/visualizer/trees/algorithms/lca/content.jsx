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
    "The Lowest Common Ancestor (LCA) of two nodes in a tree is the deepest node that has both given nodes as descendants. In other words, it is the shared ancestor located farthest from the root. For any two nodes, the LCA is guaranteed to exist since the root is always a common ancestor.",
    "LCA has numerous applications including computing distances between nodes in a tree, solving problems in suffix trees for string matching, computational biology for phylogenetic trees, and routing algorithms for network topologies. The concept generalizes to Binary Search Trees where the algorithm can be simplified using BST properties.",
  ];

  const algorithmSteps = [
    { points: "Find the path from the root to the first node and store it" },
    { points: "Find the path from the root to the second node and store it" },
    { points: "Traverse both paths simultaneously until they diverge" },
    { points: "The last common node before divergence is the LCA" },
  ];

  const walkthroughSteps = [
    { points: "Tree: root 1, children 2 (left) and 3 (right), node 2 has children 4, 5" },
    { points: "Find LCA of nodes 4 and 5:" },
    { points: "Path to 4: [1, 2, 4]" },
    { points: "Path to 5: [1, 2, 5]" },
    { points: "Compare paths: 1 matches, 2 matches, then diverges" },
    { points: "LCA of 4 and 5 = 2 (the deepest common ancestor)" },
    { points: "LCA of 4 and 3 = 1 (only root is common)" },
  ];

  const recursiveComplexity = [
    { points: "Time Complexity: O(n) — visits nodes until both are found" },
    { points: "Space Complexity: O(h) — recursion stack depth" },
  ];

  const parentPointerComplexity = [
    { points: "Time Complexity: O(h) — traverses upward from both nodes" },
    { points: "Space Complexity: O(h) — stores ancestor path" },
  ];

  const applications = [
    { points: "Computing distance between two nodes in a tree" },
    { points: "String matching using suffix trees" },
    { points: "Phylogenetic tree analysis in computational biology" },
    { points: "Network routing and topology algorithms" },
    { points: "Solving tree-based competitive programming problems" },
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
            What is Lowest Common Ancestor?
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
            Algorithm (Path Comparison)
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              The simplest approach to find LCA uses path comparison:
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
              Consider a tree and find the LCA of different node pairs:
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
            Recursive vs Parent-Pointer Approach
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg border border-[#e5e7eb] dark:border-[#333]">
              <h3 className="font-bold text-[#1a1a1a] dark:text-white mb-2">Recursive</h3>
              <pre className="text-xs bg-[#f3f4f6] dark:bg-[#1a1a2e] p-3 rounded overflow-x-auto font-mono text-[#374151] dark:text-[#d1d5db]">
{`findLCA(root, n1, n2) {
  if (!root) return null;
  if (root == n1 || root == n2)
    return root;
  left = findLCA(root.left, n1, n2);
  right = findLCA(root.right, n1, n2);
  if (left && right) return root;
  return left ? left : right;
}`}
              </pre>
              <ul className="mt-3 space-y-1 list-disc pl-5 marker:text-gray-500">
                {recursiveComplexity.map((item, index) => (
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
              <h3 className="font-bold text-[#1a1a1a] dark:text-white mb-2">Parent Pointer</h3>
              <pre className="text-xs bg-[#f3f4f6] dark:bg-[#1a1a2e] p-3 rounded overflow-x-auto font-mono text-[#374151] dark:text-[#d1d5db]">
{`findLCA(root, n1, n2) {
  ancestors = new Set();
  while (n1) {
    ancestors.add(n1);
    n1 = n1.parent;
  }
  while (n2) {
    if (ancestors.has(n2))
      return n2;
    n2 = n2.parent;
  }
  return null;
}`}
              </pre>
              <ul className="mt-3 space-y-1 list-disc pl-5 marker:text-gray-500">
                {parentPointerComplexity.map((item, index) => (
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
              The recursive approach visits nodes until both targets are found (O(n) worst case), while the parent-pointer approach traverses upward from both nodes (O(h)). More advanced techniques like binary lifting answer LCA queries in O(log n) after O(n log n) preprocessing.
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
                    <td className="border border-gray-400 p-3">Recursive</td>
                    <td className="border border-gray-400 p-3 font-mono">O(n)</td>
                    <td className="border border-gray-400 p-3 font-mono">O(h)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td className="border border-gray-400 p-3">Parent Pointer</td>
                    <td className="border border-gray-400 p-3 font-mono">O(h)</td>
                    <td className="border border-gray-400 p-3 font-mono">O(h)</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="border border-gray-400 p-3">Binary Lifting</td>
                    <td className="border border-gray-400 p-3 font-mono">O(log n)</td>
                    <td className="border border-gray-400 p-3 font-mono">O(n log n)</td>
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
