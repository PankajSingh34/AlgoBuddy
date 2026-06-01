"use client";
import React from "react";
import ComplexityGraph from "@/app/components/ui/graph";

const DpContent = () => {
  const paragraphs = [
    "Dynamic Programming (DP) is a highly optimized algorithmic technique used to solve complex problems by breaking them down into simpler, overlapping subproblems. It solves each subproblem exactly once and stores their solutions using either a bottom-up table (tabulation) or a top-down cache (memoization), completely eliminating redundant computations.",
    "Dynamic Programming is the key framework behind hundreds of highly optimized real-world systems, including biological genome sequencing (Needleman-Wunsch algorithm), diff engines (Longest Common Subsequence), search engine spelling correctors (Levenshtein Edit Distance), network routing tables, and portfolio capital allocation.",
    "In bottom-up dynamic programming, we build a physical 2D grid where rows represent options (e.g. items) and columns represent capacities or limits. The algorithm steps through the grid cell-by-cell, looking up solved smaller problems (dependencies) to compute larger states until the bottom-right corner represents the final global optimal solution.",
    "In top-down memoization, we run recursive solver trees. However, as soon as any tree node encounters a state that has already been calculated, it retrieves the stored value from our lookup table in O(1) time. Visually, this 'prunes' the recursive branch, converting exponential O(2^N) call trees into highly efficient polynomial or linear paths."
  ];

  const bottomUpSteps = [
    { points: "Define state space: Let dp[i][w] be the optimal value using subset of items up to index i with weight limit w." },
    { points: "Initialize base cases: All cells in row 0 (no items) and column 0 (no capacity) are initialized to 0." },
    { points: "Double-loop traversal: Iterate row i from 1 to N and column w from 0 to W." },
    { points: "Apply transition recurrence: If weight of item i <= w, then dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i]). Otherwise, dp[i][w] = dp[i-1][w]." },
    { points: "Trace optimal solution: Start from bottom-right corner dp[N][W] and backtrack through cell choices to reconstruct the chosen item set." }
  ];

  const topDownSteps = [
    { points: "Create recursive function solve(i, w) returning the optimal value for i items and capacity w." },
    { points: "Initialize cache matrix of size N x W with sentinel values (-1)." },
    { points: "Enforce base cases: If i < 0 or w == 0, return 0." },
    { points: "Check cache: If memo[i][w] != -1, immediately return memo[i][w] (Cache Hit!)." },
    { points: "Recursive split: Compute solve(i-1, w) and solve(i-1, w-weight[i]) + value[i]. Store the maximum in memo[i][w] and return it." }
  ];

  const complexity = [
    "Unoptimized Recursive Time Complexity: O(2^N) - due to exponential overlapping subproblem branches in standard recursion.",
    "Optimized DP Time Complexity: O(N * W) - where N is the number of items and W is the capacity (running in pseudo-polynomial time).",
    "Space Complexity: O(N * W) - to allocate the 2D state lookup matrix.",
    "Space Optimization: O(W) - by retaining only the current and previous rows in memory since dp[i][w] only references dp[i-1]."
  ];

  return (
    <main className="max-w-7xl mx-auto mt-8">
      <article className="max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        
        {/* What is DP */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Dynamic Programming?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>{paragraphs[0]}</p>
            <p>{paragraphs[1]}</p>
          </div>
        </section>

        {/* Tabulation vs Memoization */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            How DP Solves Complexity
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>{paragraphs[2]}</p>
            <p>{paragraphs[3]}</p>
          </div>
        </section>

        {/* Algorithms Breakdown */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              Bottom-Up Tabulation (Grid Method)
            </h2>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 text-[#374151] dark:text-[#d1d5db]">
              {bottomUpSteps.map((step, idx) => (
                <li key={idx} className="pl-1">{step.points}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              Top-Down Memoization (Tree Method)
            </h2>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 text-[#374151] dark:text-[#d1d5db]">
              {topDownSteps.map((step, idx) => (
                <li key={idx} className="pl-1">{step.points}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Complexity and Graph */}
        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Complexity Analysis
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {complexity.map((item, index) => (
                <li key={index} className="pl-2">
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm font-semibold text-purple-700 dark:text-purple-300">
                    {item.split(":")[0]}:
                  </span>
                  <span className="ml-2">{item.split(":")[1]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3">Time Scaling Comparison: Polynomial O(N*W) vs Exponential O(2^N)</h3>
              <ComplexityGraph
                bestCase={(n) => n * 5}
                averageCase={(n) => n * 10}
                worstCase={(n) => Math.pow(2, n)}
                maxN={10}
              />
            </div>

            <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Understanding Overlapping States:</h4>
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                By populating a grid layout, the dynamic programming solver resolves the recursion bottleneck. Instead of spawning 2^N tree branches, we guarantee that each subproblem represents an exact coordinate cell. This maps the complexity down to a simple number of states, allowing fast lookups in O(1) and transforming unsolvable tasks into simple table scans.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default DpContent;
