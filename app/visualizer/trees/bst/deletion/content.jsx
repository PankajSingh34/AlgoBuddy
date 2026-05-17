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
    `Deleting a node from a Binary Search Tree has three distinct cases based on how many children the target node has. Understanding each case is essential because the deletion operation must preserve the BST property — all values in the left subtree must remain smaller than the root, and all values in the right subtree must remain larger.`,
    `Case 1 — Leaf Node (0 children): This is the simplest case. If the node to delete has no children, simply remove it by setting its parent's pointer to null. No further restructuring is needed since removing a leaf doesn't affect the BST ordering of other nodes.`,
    `Case 2 — One Child (1 child): If the node has exactly one child, replace the node with that child. The parent of the deleted node now points directly to the grandchild, bypassing the deleted node. This preserves the BST property because all values in the child's subtree were already on the correct side of the parent.`,
    `Case 3 — Two Children (2 children): This is the most complex case. The node must be replaced by its inorder successor (the smallest value in the right subtree) or inorder predecessor (the largest value in the left subtree). The successor is found by going right once, then left repeatedly until reaching a null left child. The successor's value is copied into the node to delete, and then the successor node itself is removed using Case 1 or Case 2.`,
  ];

  const working = [
    { points: "Find the node to delete using BST search (compare and traverse)." },
    { points: "Count the number of children of the target node." },
    {
      points: "Apply the appropriate deletion case:",
      subpoints: [
        "0 children: Simply remove the node (set parent's pointer to null).",
        "1 child: Replace the node with its only child.",
        "2 children: Find the inorder successor, copy its value, and delete the successor.",
      ],
    },
    { points: "Return the (possibly new) root of the tree." },
  ];

  const complexity = [
    { data: "Best Case: O(log n) — balanced tree, leaf deletion" },
    { data: "Worst Case: O(n) — skewed tree, two-child deletion" },
    { data: "Average Case: O(log n) — random tree" },
  ];

  const algorithm = [
    { points: "If root is null, return null (value not found)." },
    { points: "If value < root.val, delete from left subtree recursively." },
    { points: "If value > root.val, delete from right subtree recursively." },
    { points: "If value == root.val, apply deletion case based on children count." },
    { points: "Return the (possibly updated) node." },
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
        {/* What is BST Deletion */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is BST Deletion?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[0]}
            </p>
          </div>
        </section>

        {/* The Three Cases */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            The Three Deletion Cases
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">{paragraphs[1]}</p>
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">{paragraphs[2]}</p>
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">{paragraphs[3]}</p>
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
                bestCase={(n) => Math.ceil(Math.log2(n + 1))}
                averageCase={(n) => Math.ceil(Math.log2(n + 1))}
                worstCase={(n) => n}
                maxN={25}
              />
            </div>

            <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                The time complexity of BST deletion is O(h), where h is the height of the tree. Finding the node requires traversing from root to the target, and in the two-child case, finding the inorder successor adds another traversal. Self-balancing trees maintain O(log n) deletion time.
              </p>
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
