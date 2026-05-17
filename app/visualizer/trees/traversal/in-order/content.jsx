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
    "In-order traversal is a depth-first tree traversal technique where nodes are visited in the order: Left → Root → Right. For Binary Search Trees (BSTs), this produces nodes in ascending sorted order, making it one of the most useful traversal methods.",
    "In-order traversal is widely used in expression tree evaluation, BST sort, and finding the kth smallest element. Its recursive nature makes it elegant, while the iterative approach offers better control over the traversal process.",
  ];

  const algorithmSteps = [
    { points: "Traverse the left subtree recursively (or iteratively via stack)" },
    { points: "Visit/process the current root node" },
    { points: "Traverse the right subtree recursively (or iteratively via stack)" },
  ];

  const walkthroughSteps = [
    { points: "Start at root (10). Go left to 5." },
    { points: "From 5, go left to 2. No left child → visit 2." },
    { points: "Back to 5, no right child → visit 5." },
    { points: "Back to 10, left done → visit 10." },
    { points: "Go right to 15. From 15, go left to 12. No left child → visit 12." },
    { points: "Back to 15, no right child → visit 15." },
    { points: "Final order: [2, 5, 10, 12, 15] (sorted!)" },
  ];

  const recursiveComplexity = [
    { points: "Time Complexity: O(n) — visits each node exactly once" },
    { points: "Space Complexity: O(h) — call stack depth equals tree height" },
  ];

  const iterativeComplexity = [
    { points: "Time Complexity: O(n) — visits each node exactly once" },
    { points: "Space Complexity: O(h) — explicit stack stores at most h nodes" },
  ];

  const applications = [
    { points: "BST sort — produces sorted output from any BST" },
    { points: "Expression tree evaluation — evaluates infix expressions" },
    { points: "Finding kth smallest element in BST" },
    { points: "Converting BST to a sorted array" },
    { points: "Validating BST property (in-order must be strictly increasing)" },
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
            What is In-Order Traversal?
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
            Traversal Algorithm (Left &rarr; Root &rarr; Right)
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              The in-order traversal follows a simple recursive pattern:
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
              Consider this BST: Root = 10, Left = 5 (with left child 2), Right = 15 (with left child 12).
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
            Recursive vs Iterative Approach
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg border border-[#e5e7eb] dark:border-[#333]">
              <h3 className="font-bold text-[#1a1a1a] dark:text-white mb-2">Recursive</h3>
              <pre className="text-xs bg-[#f3f4f6] dark:bg-[#1a1a2e] p-3 rounded overflow-x-auto font-mono text-[#374151] dark:text-[#d1d5db]">
{`inOrder(node) {
  if (!node) return;
  inOrder(node.left);
  visit(node);
  inOrder(node.right);
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
              <h3 className="font-bold text-[#1a1a1a] dark:text-white mb-2">Iterative</h3>
              <pre className="text-xs bg-[#f3f4f6] dark:bg-[#1a1a2e] p-3 rounded overflow-x-auto font-mono text-[#374151] dark:text-[#d1d5db]">
{`inOrder(root) {
  stack = [], curr = root;
  while (curr || stack) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    visit(curr);
    curr = curr.right;
  }
}`}
              </pre>
              <ul className="mt-3 space-y-1 list-disc pl-5 marker:text-gray-500">
                {iterativeComplexity.map((item, index) => (
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
              Both recursive and iterative in-order traversal visit each node exactly once, giving O(n) time.
              The space differs slightly: recursive uses the call stack (O(h)), while iterative uses an explicit stack (O(h)).
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
                    <td className="border border-gray-400 p-3">Iterative</td>
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
