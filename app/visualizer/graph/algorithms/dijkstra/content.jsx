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
    `Dijkstra's Algorithm is a classic greedy algorithm that finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. It was conceived by computer scientist Edsger W. Dijkstra in 1956 and remains one of the most important algorithms in graph theory.`,
    `The algorithm maintains a set of settled vertices (whose shortest distance is finalized) and a priority queue of unsettled vertices keyed by their current distance estimate. At each step, it extracts the vertex with the smallest distance, relaxes all its outgoing edges, and updates distances of neighboring vertices if a shorter path is found.`,
    `Consider a weighted graph with vertices A, B, C, D, E and source A. Initially, dist[A]=0, dist[B]=dist[C]=dist[D]=dist[E]=∞. The algorithm processes A first, updating distances to its neighbors, then picks the closest unsettled vertex, and repeats until all vertices are settled.`,
    `Dijkstra's algorithm fails when negative edge weights are present — use Bellman-Ford instead. It is widely used in GPS navigation, network routing protocols (OSPF, IS-IS), and as a subroutine in many other graph algorithms.`,
  ];

  const working = [
    { points: "Initialize all distances to infinity except the source (distance 0). Enqueue all vertices with their distances into a min-priority queue." },
    { points: "Extract the vertex u with the smallest distance from the priority queue. Mark u as settled." },
    { points: "For each neighbor v of u, calculate the new distance = dist[u] + weight(u, v). If this is less than dist[v], update dist[v] and adjust the priority queue." },
    { points: "Repeat steps 2-3 until the priority queue is empty. All vertices now have their shortest distance from the source." },
  ];

  const complexity = [
    { data: "Best Case: Target is the first extracted vertex → O((V+E) log V)" },
    { data: "Worst Case: Full graph traversal → O((V+E) log V) with binary heap" },
    { data: "Space Complexity: O(V) for distances and priority queue" },
  ];

  const algorithm = [
    { points: "Create a distance array initialized to infinity. Set dist[source] = 0." },
    { points: "Insert all vertices into a min-priority queue keyed by distance." },
    { points: "While the priority queue is not empty:", subpoints: [
      "Extract the vertex u with the minimum distance.",
      "For each neighbor v of u that is still in the queue:",
      "Calculate alt = dist[u] + weight(u, v).",
      "If alt < dist[v], update dist[v] = alt and decrease-key in the queue.",
    ]},
    { points: "Return the distance array containing shortest distances from source." },
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
        {/* What is Dijkstra's Algorithm */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Dijkstra's Algorithm?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[0]}
            </p>
          </div>
        </section>

        {/* How Does It Work */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            How Does It Work?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              {paragraphs[1]}
            </p>

            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {working.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                </li>
              ))}
            </ol>

            <p className="text-[#374151] dark:text-[#d1d5db] mt-4 leading-relaxed">
              {paragraphs[2]}
            </p>
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
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                  {item.subpoints && (
                    <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                      {item.subpoints.map((subitem, subindex) => (
                        <li
                          key={subindex}
                          className="text-[#6b7280] dark:text-[#9ca3af]"
                        >
                          {subitem}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Complexity Analysis */}
        <section className="p-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Complexity Analysis
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {complexity.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm font-mono">
                    {item.data.split(":")[0]}:
                  </span>
                  <span className="ml-2">{item.data.split(":")[1]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ComplexityGraph
                bestCase={(n) => n * Math.log2(n)}
                averageCase={(n) => n * Math.log2(n)}
                worstCase={(n) => n * Math.log2(n)}
                maxN={25}
              />
            </div>

            <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                {paragraphs[3]}
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
