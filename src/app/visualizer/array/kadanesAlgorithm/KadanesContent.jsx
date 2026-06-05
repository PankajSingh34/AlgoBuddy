"use client";
import React, { useState } from "react";

const Section = ({ title, children, accent = false }) => (
  <div
    className={`bg-white dark:bg-neutral-950 rounded-xl border p-6 shadow-sm ${
      accent
        ? "border-[#a435f0]/30 dark:border-[#a435f0]/20"
        : "border-gray-200 dark:border-gray-700"
    }`}
  >
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
      {title}
    </h2>
    {children}
  </div>
);

const Callout = ({ type = "info", children }) => {
  const styles = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200",
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200",
    purple:
      "bg-[#a435f0]/5 dark:bg-[#a435f0]/10 border-[#a435f0]/30 text-[#6b21a8] dark:text-[#c084fc]",
  };
  return (
    <div className={`border-l-4 rounded-r-lg px-4 py-3 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
};

const ComplexityBadge = ({ label, value, color }) => (
  <div className="flex flex-col items-center bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
    <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">
      {label}
    </span>
  </div>
);

const TraceRow = ({ idx, val, prev, cur, best, note }) => (
  <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
    <td className="px-4 py-2 text-center font-mono text-sm text-gray-600 dark:text-gray-400">{idx}</td>
    <td className="px-4 py-2 text-center font-mono font-semibold text-gray-800 dark:text-gray-200">{val}</td>
    <td className="px-4 py-2 text-center font-mono text-sm text-gray-600 dark:text-gray-400">{prev}</td>
    <td className="px-4 py-2 text-center font-mono font-semibold text-indigo-600 dark:text-indigo-400">{cur}</td>
    <td className="px-4 py-2 text-center font-mono font-semibold text-[#a435f0]">{best}</td>
    <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 italic">{note}</td>
  </tr>
);

const KadanesContent = () => {
  const [showAllNegTrace, setShowAllNegTrace] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* What is Kadane's */}
      <Section title="What is Kadane's Algorithm?" accent>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Kadane&apos;s Algorithm is a classic dynamic programming technique that solves the{" "}
          <strong className="text-gray-900 dark:text-white">Maximum Subarray Problem</strong> in{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[#a435f0] font-mono text-sm">O(n)</code>{" "}
          time with{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[#a435f0] font-mono text-sm">O(1)</code>{" "}
          space. The problem: given an array of integers (possibly negative), find the contiguous subarray with the largest sum.
        </p>
        <Callout type="purple">
          <strong>Core Idea:</strong> At every index, make a greedy choice — should we extend the current subarray by including this element, or start fresh from this element? We always pick whichever gives a larger value.
        </Callout>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
          This greedy insight turns a brute-force O(n³) problem into a single elegant linear scan, making it one of the most elegant algorithms in computer science.
        </p>
      </Section>

      {/* Core Recurrence */}
      <Section title="The Recurrence Relation">
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Kadane&apos;s algorithm maintains two running values at every step:
        </p>
        <div className="space-y-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <p className="font-mono text-sm text-indigo-800 dark:text-indigo-200 font-semibold mb-1">
              maxEndingHere = max(arr[i], maxEndingHere + arr[i])
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">
              Local maximum: the best sum of a subarray ending exactly at index i
            </p>
          </div>
          <div className="bg-[#a435f0]/5 dark:bg-[#a435f0]/10 rounded-lg p-4 border border-[#a435f0]/20">
            <p className="font-mono text-sm text-[#6b21a8] dark:text-[#c084fc] font-semibold mb-1">
              maxSoFar = max(maxSoFar, maxEndingHere)
            </p>
            <p className="text-xs text-[#9333ea] dark:text-[#a855f7]">
              Global maximum: the best sum seen across all subarrays so far
            </p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 leading-relaxed">
          The key insight in the recurrence: if <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono">maxEndingHere + arr[i]</code> is less than <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono">arr[i]</code> alone, then the previous accumulation was dragging us down — we discard it and restart.
        </p>
      </Section>

      {/* Step-by-step trace */}
      <Section title="Step-by-Step Trace">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Array: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-[#a435f0]">[-2, 1, -3, 4, -1, 2, 1, -5, 4]</code>
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">idx</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">val</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">prev+val</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-indigo-500">maxHere</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#a435f0]">maxSoFar</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">note</th>
              </tr>
            </thead>
            <tbody>
              <TraceRow idx={0} val={-2} prev="—" cur={-2} best={-2} note="Initialize" />
              <TraceRow idx={1} val={1} prev={-1} cur={1} best={1} note="Reset: 1 > -1" />
              <TraceRow idx={2} val={-3} prev={-2} cur={-2} best={1} note="Extend: -2 > -3" />
              <TraceRow idx={3} val={4} prev={2} cur={4} best={4} note="Reset: 4 > 2 ✨" />
              <TraceRow idx={4} val={-1} prev={3} cur={3} best={4} note="Extend" />
              <TraceRow idx={5} val={2} prev={5} cur={5} best={5} note="Extend ✨" />
              <TraceRow idx={6} val={1} prev={6} cur={6} best={6} note="Extend ✨" />
              <TraceRow idx={7} val={-5} prev={1} cur={1} best={6} note="Extend" />
              <TraceRow idx={8} val={4} prev={5} cur={5} best={6} note="Extend" />
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Result: <strong className="text-[#a435f0]">maxSoFar = 6</strong> from subarray <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono">[4, -1, 2, 1]</code> (indices 3–6).
        </p>
      </Section>

      {/* Edge Cases */}
      <Section title="Edge Cases & Variants">
        <div className="space-y-4">
          {/* All negative */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setShowAllNegTrace((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-left"
            >
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                All-Negative Arrays
              </span>
              <span className="text-[#a435f0] text-lg">{showAllNegTrace ? "−" : "+"}</span>
            </button>
            {showAllNegTrace && (
              <div className="px-4 py-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>When all elements are negative, the algorithm returns the <strong>least negative</strong> element (the largest single element).</p>
                <div className="font-mono bg-gray-50 dark:bg-neutral-800 rounded p-3 text-sm">
                  arr = [-5, -2, -8, -1, -4]<br />
                  → maxSoFar = -1 (just the element at index 3)
                </div>
                <Callout type="warning">
                  The initialization <code>maxSoFar = arr[0]</code> (not <code>-Infinity</code>) is what handles this correctly — the loop naturally keeps the best single element.
                </Callout>
              </div>
            )}
          </div>

          {/* Circular */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-800">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                Maximum Circular Subarray
              </span>
            </div>
            <div className="px-4 py-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>The circular variant allows the subarray to wrap around the ends of the array. The answer is either:</p>
              <ul className="space-y-1 ml-4 list-disc text-gray-600 dark:text-gray-400">
                <li><strong>Non-circular</strong>: standard Kadane&apos;s result (<code className="font-mono">maxNormal</code>)</li>
                <li><strong>Circular</strong>: wraps around edges → equals <code className="font-mono">totalSum − minSubarray</code></li>
              </ul>
              <div className="bg-gray-50 dark:bg-neutral-800 rounded p-3 font-mono text-sm">
                result = max(maxNormal, totalSum − minSubarraySum)
              </div>
              <Callout type="info">
                The circular trick works because removing the minimum middle subarray is equivalent to keeping the maximum circular ends.
              </Callout>
              <Callout type="warning">
                Special case: if all elements are negative, <code>maxCircular</code> would be 0 (empty subarray of totalSum − total = 0). In this case, return <code>maxNormal</code> instead.
              </Callout>
            </div>
          </div>
        </div>
      </Section>

      {/* Complexity */}
      <Section title="Complexity Analysis">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <ComplexityBadge label="Time (Classic)" value="O(n)" color="text-green-600 dark:text-green-400" />
          <ComplexityBadge label="Space (Classic)" value="O(1)" color="text-green-600 dark:text-green-400" />
          <ComplexityBadge label="Time (Circular)" value="O(n)" color="text-green-600 dark:text-green-400" />
          <ComplexityBadge label="Space (Circular)" value="O(1)" color="text-green-600 dark:text-green-400" />
        </div>
        <Callout type="success">
          Both variants require exactly 1–2 linear passes and only a handful of scalar variables — no extra arrays needed.
        </Callout>
      </Section>

      {/* When to use */}
      <Section title="When to Apply This Pattern">
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {[
            "Find max/min sum contiguous subarray (classic interview problem — LeetCode #53)",
            "Stock profit problems where profit = price[j] − price[i] for j > i",
            "Maximum circular subarray (LeetCode #918)",
            "Any DP where the optimal subproblem only depends on the immediately previous state",
            "Variants with constraints: max product subarray, max subarray with at most k negatives",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[#a435f0]/10 text-[#a435f0] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* Common Mistakes */}
      <Section title="Common Mistakes">
        <div className="space-y-3">
          {[
            {
              wrong: "Initializing maxSoFar = 0",
              right: "Initialize maxSoFar = arr[0]. Starting at 0 breaks all-negative arrays.",
            },
            {
              wrong: "Using maxEndingHere = max(0, maxEndingHere + arr[i])",
              right: "The 0-reset form returns 0 for all-negative arrays (empty subarray). Only use if the problem allows empty subarrays.",
            },
            {
              wrong: "For circular: forgetting the all-negative edge case",
              right: "If all elements are negative, totalSum − minSubarray = 0 (empty). Return maxNormal instead.",
            },
          ].map(({ wrong, right }, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/10">
                <span className="text-red-500 mt-0.5">✗</span>
                <p className="text-sm text-red-700 dark:text-red-300">{wrong}</p>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/10">
                <span className="text-green-500 mt-0.5">✓</span>
                <p className="text-sm text-green-700 dark:text-green-300">{right}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default KadanesContent;