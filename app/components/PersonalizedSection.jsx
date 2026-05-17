"use client";
import React from "react";
import Link from "next/link";

const TOPIC_ROWS = [
  [
    { label: "Arrays", done: true },
    { label: "Strings", done: true },
    { label: "Hashing", done: true },
    { label: "Recursion", done: true },
  ],
  [
    { label: "Linked List", done: true },
    { label: "Stack", done: true },
    { label: "Queue", done: true },
    { label: "Binary Search", done: true },
    { label: "Two Pointers", done: false, lock: true },
  ],
  [
    { label: "Trees", done: true },
    { label: "BST", done: true },
    { label: "Heaps", done: false },
    { label: "Tries", done: false },
    { label: "Graphs", done: false, lock: true },
    { label: "Sorting", done: false, lock: true },
  ],
  [
    { label: "BFS / DFS", done: false },
    { label: "Backtracking", done: false, lock: true },
    { label: "Greedy", done: false, lock: true },
    { label: "Divide & Conquer", done: false, lock: true },
    { label: "Dynamic Prog.", done: false, lock: true },
  ],
  [
    { label: "Sliding Window", done: false, lock: true },
    { label: "Bit Manipulation", done: false, lock: true },
    { label: "Segment Tree", done: false, lock: true },
    { label: "Disjoint Set", done: false, lock: true },
  ],
];

function TopicCard({ label, done, lock }) {
  return (
    <div
      className="relative flex flex-col gap-1 px-3 py-2 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] shadow-sm select-none transition-all duration-200 hover:shadow-md hover:border-[hsl(var(--primary)/0.3)]"
      style={{
        filter: lock ? "blur(3px)" : "none",
        opacity: lock ? 0.55 : 1,
        minWidth: "90px",
      }}
    >
      <div className="h-[3px] w-8 rounded-full bg-[hsl(var(--primary))]" />
      <span className="font-body text-xs font-semibold text-[hsl(var(--text))] leading-tight">
        {label}
      </span>
      {done && (
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex items-center justify-center text-[10px] text-[hsl(var(--success))] font-bold shadow-sm">
          ✓
        </span>
      )}
    </div>
  );
}

export default function PersonalizedSection() {
  return (
    <section className="py-24 px-6 overflow-hidden bg-gradient-to-b from-[hsl(var(--bg))] via-[hsl(var(--primary-subtle))] to-[hsl(var(--accent-subtle))]">
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        <div className="flex-1 flex flex-col gap-5 items-start lg:min-w-[320px]">
          <h2 className="font-display text-[2.6rem] sm:text-[3.2rem] font-black leading-[1.08] tracking-tight text-[hsl(var(--text))]">
            Your DSA path, your pace
          </h2>
          <p className="font-body text-lg text-[hsl(var(--text-muted))] leading-relaxed max-w-[400px]">
            Every topic you master unlocks the next. AlgoBuddy maps your progress
            across Arrays, Trees, Graphs and beyond — so you always know exactly
            where to go next.
          </p>
          <Link
            href="/visualizer"
            className="inline-flex items-center gap-2 h-[46px] px-7 rounded-full bg-[hsl(var(--text))] text-[hsl(var(--bg))] text-[15px] font-bold hover:bg-[hsl(var(--primary))] transition-all duration-200"
          >
            Start your path
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="flex-1 relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-[hsl(var(--bg))] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[hsl(var(--accent-subtle))] to-transparent" />
          <div className="absolute left-0 right-0 bottom-0 h-20 z-10 pointer-events-none bg-gradient-to-t from-[hsl(var(--accent-subtle))] to-transparent" />

          <div className="flex flex-col gap-3 py-2">
            {TOPIC_ROWS.map((row, ri) => (
              <div
                key={ri}
                className="flex gap-3 flex-wrap"
                style={{ paddingLeft: `${ri * 14}px` }}
              >
                {row.map((topic, ti) => (
                  <TopicCard key={ti} {...topic} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
