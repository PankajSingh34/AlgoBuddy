"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { useEffect, useState } from "react";

const content = () => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
    };

    updateTheme();
    setMounted(true);

    window.addEventListener('storage', updateTheme);
    window.addEventListener('themeChange', updateTheme);

    return () => {
      window.removeEventListener('storage', updateTheme);
      window.removeEventListener('themeChange', updateTheme);
    };
  }, []);

  const paragraphs = [
    `Searching in a Binary Search Tree leverages the BST property to efficiently locate values. Starting at the root, compare the target value with the current node. If they match, the search is successful. If the target is smaller, move to the left child; if larger, move to the right child. This process repeats until the value is found or a null node is reached, indicating the value is not in the tree.`,
    `The search algorithm is elegant because at each step it eliminates an entire subtree from consideration. When you move left, you discard the entire right subtree and vice versa. This divide-and-conquer behavior is what makes BST search efficient — you never need to examine every node. The recursive implementation mirrors the iterative one: check the current node, then recurse on the appropriate child.`,
    `The time complexity of BST search is O(h), where h is the height of the tree. In a balanced BST, h = O(log n), making search very efficient even for large datasets. However, in a degenerate (skewed) tree where nodes are inserted in sorted order, h = O(n) and search degrades to linear time. This is why self-balancing BSTs like AVL and Red-Black trees are important — they maintain O(log n) search time guarantees.`,
    `BST search can be implemented both recursively and iteratively. The recursive version is elegant and easy to understand, while the iterative version avoids potential stack overflow for very deep trees. Both approaches have the same time complexity. The iterative version uses a while loop that traverses down the tree until the value is found or a null is reached.`,
  ];

  const working = [
    { points: "Start at the root node." },
    { points: "Compare the target value with the current node's value." },
    {
      points: "Based on the comparison:",
      subpoints: [
        "If equal: Return the current node (found).",
        "If smaller: Move to the left child.",
        "If larger: Move to the right child.",
      ],
    },
    { points: "Repeat until the value is found or a null node is reached." },
    { points: "If null is reached, the value is not in the tree." },
  ];

  const complexity = [
    { data: "Best Case: O(1) — target is the root" },
    { data: "Average Case: O(log n) — balanced tree" },
    { data: "Worst Case: O(n) — skewed tree" },
  ];

  const algorithm = [
    { points: "If the current node is null, return null (not found)." },
    { points: "If target equals current node's value, return the current node." },
    { points: "If target is smaller, search the left subtree recursively." },
    { points: "If target is larger, search the right subtree recursively." },
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
      <article className="col-span-4 max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        {/* What is BST Searching */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is BST Searching?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">{paragraphs[0]}</p>
          </div>
        </section>

        {/* How Does It Work */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            How Does It Work?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">{paragraphs[1]}</p>
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {working.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                  {item.subpoints && (
                    <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                      {item.subpoints.map((subitem, subindex) => (
                        <li key={subindex} className="text-[#6b7280] dark:text-[#9ca3af]">{subitem}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Algorithm Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Algorithm Steps
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {algorithm.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">{item.points}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Time Complexity */}
        <section className="p-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {complexity.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm">{item.data.split(":")[0]}:</span>
                  <span className="ml-2">{item.data.split(":")[1]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ComplexityGraph
                bestCase={(n) => 1}
                averageCase={(n) => Math.ceil(Math.log2(n + 1))}
                worstCase={(n) => n}
                maxN={25}
              />
            </div>

            <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">{paragraphs[2]}</p>
            </div>

            <div className="mt-4 p-4 bg-[#fef2f2] dark:bg-[#1a0000] rounded-xl border border-[#fecaca] dark:border-[#4a0000]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">{paragraphs[3]}</p>
            </div>
          </div>
        </section>
      </article>

      {/* Mobile iframe at bottom */}
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
            <a href="https://hw.glich.co/resources/daily" target="_blank" className="underline hover:text-blue-500 duration-300">Hello World</a>
          </span>
        </div>
      </div>
    </main>
  );
};

export default content;
