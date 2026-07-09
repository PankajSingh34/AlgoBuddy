"use client";

import { useMemo, useState } from "react";
import AlgorithmComparator from "./components/AlgorithmComparator";
import CodeEstimator from "./components/CodeEstimator";
import ComplexityCard from "./components/ComplexityCard";
import ComplexityGraph from "./components/ComplexityGraph";
import {
  algorithmComparisons,
  complexityInfo,
} from "./utils/complexityData";
import { generateComplexityData } from "./utils/complexityFunctions";

export default function ComplexityAnalyzerClient() {
  const [selectedComplexities, setSelectedComplexities] = useState(
    complexityInfo.map((item) => item.complexity)
  );

  const graphData = useMemo(() => generateComplexityData(60), []);

  const toggleComplexity = (complexity) => {
    setSelectedComplexities((current) => {
      if (current.includes(complexity)) {
        return current.length === 1
          ? current
          : current.filter((item) => item !== complexity);
      }

      return [...current, complexity];
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm font-black uppercase tracking-wider text-[#a435f0]">
          Big-O Analyzer
        </p>
        <h1 className="mt-2 text-3xl font-black text-neutral-950 dark:text-white sm:text-4xl">
          Time and Space Complexity Analyzer
        </h1>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-neutral-600 dark:text-neutral-400">
          Explore common complexity classes, compare algorithm growth, and use
          the code estimator to reason about custom snippets.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {complexityInfo.map((item) => (
          <button
            key={item.complexity}
            type="button"
            onClick={() => toggleComplexity(item.complexity)}
            className={`text-left transition ${
              selectedComplexities.includes(item.complexity)
                ? "opacity-100"
                : "opacity-45"
            }`}
          >
            <ComplexityCard {...item} />
          </button>
        ))}
      </section>

      <ComplexityGraph
        data={graphData}
        selectedComplexities={selectedComplexities}
      />

      <AlgorithmComparator algorithms={algorithmComparisons} />

      <CodeEstimator />
    </main>
  );
}
