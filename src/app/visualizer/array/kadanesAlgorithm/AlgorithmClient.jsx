"use client";
import React, { useState } from "react";
import Animation from "./Animation";
import KadanesCodeBlock from "./KadanesCodeBlock";
import KadanesContent from "./KadanesContent";
import KadanesQuiz from "./KadanesQuiz";

const TABS = [
  { id: "visualizer", label: "Visualizer" },
  { id: "theory", label: "Theory" },
  { id: "code", label: "Code" },
  { id: "quiz", label: "Quiz" },
];

const AlgorithmClient = () => {
  const [activeTab, setActiveTab] = useState("visualizer");
  const [markedDone, setMarkedDone] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#a435f0] bg-[#a435f0]/10 px-2 py-0.5 rounded-full border border-[#a435f0]/20">
                  Interview Pattern
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                  O(n) · Dynamic Programming
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Kadane&apos;s Algorithm
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Maximum Subarray Sum · Maximum Circular Subarray
              </p>
            </div>

            <button
              onClick={() => setMarkedDone((prev) => !prev)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 border ${
                markedDone
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
                  : "bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#a435f0] hover:text-[#a435f0]"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={markedDone ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {markedDone ? "Completed!" : "Mark as Done"}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-1 border-b border-gray-200 dark:border-gray-800 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all duration-150 border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#a435f0] text-[#a435f0] bg-[#a435f0]/5"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "visualizer" && <Animation />}
        {activeTab === "theory" && <KadanesContent />}
        {activeTab === "code" && <KadanesCodeBlock />}
        {activeTab === "quiz" && <KadanesQuiz />}
      </div>
    </div>
  );
};

export default AlgorithmClient;