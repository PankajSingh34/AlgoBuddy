"use client";
import React from "react";
import Link from "next/link";

const CONCEPTS = [
  {
    heading: "Concepts that click",
    body: "Step-by-step interactive visualizations make even complex algorithms feel intuitive. See exactly what's happening at every step.",
    cta: { label: "Try Sorting", href: "/visualizer" },
    visual: <SortingVisual />,
  },
  {
    heading: "Code that makes sense",
    body: "Watch the algorithm execute line by line alongside the visualization. Learn how code maps to real behaviour.",
    cta: { label: "Try Searching", href: "/visualizer" },
    visual: <SearchVisual />,
    flip: true,
  },
  {
    heading: "Structures you can touch",
    body: "Manipulate data structures directly — push, pop, enqueue, dequeue — and see the state update in real time.",
    cta: { label: "Try Stack & Queue", href: "/visualizer" },
    visual: <StackVisual />,
  },
];

function SortingVisual() {
  const bars = [65, 30, 80, 45, 55, 20, 70, 40, 90, 35];
  const active = [2, 6];
  return (
    <div className="w-full max-w-[340px] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-[hsl(var(--bg-subtle))] border-b border-[hsl(var(--border))]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs font-mono text-[hsl(var(--text-muted))]">bubbleSort.js — step 4</span>
      </div>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-[hsl(var(--text-muted))] mb-4 font-semibold">Comparing indices 2 & 3</p>
        <div className="flex items-end gap-1.5 h-[80px]">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm transition-all duration-300"
                style={{
                  height: `${(h / 90) * 72}px`,
                  background: active.includes(i) ? "hsl(var(--success))" : "hsl(var(--success-subtle))",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--text-muted))]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--success))] inline-block" /> comparing
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--text-muted))]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--success-subtle))] inline-block" /> unsorted
          </span>
        </div>
      </div>
    </div>
  );
}

function SearchVisual() {
  const arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72];
  const mid = 4;
  const eliminated = [0, 1, 2, 3];
  return (
    <div className="w-full max-w-[340px] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-[hsl(var(--bg-subtle))] border-b border-[hsl(var(--border))]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs font-mono text-[hsl(var(--text-muted))]">binarySearch.js — step 2</span>
      </div>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-[hsl(var(--text-muted))] mb-4 font-semibold">Target: 16 &nbsp;·&nbsp; mid = index 4</p>
        <div className="flex gap-1.5">
          {arr.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-9 rounded-md flex items-center justify-center text-[11px] font-bold transition-all"
                style={{
                  background: i === mid ? "hsl(var(--primary))" : eliminated.includes(i) ? "hsl(var(--surface-muted))" : "hsl(var(--primary-subtle))",
                  color: i === mid ? "hsl(var(--primary-foreground))" : eliminated.includes(i) ? "hsl(var(--text-subtle))" : "hsl(var(--primary))",
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--text-muted))]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--primary))] inline-block" /> mid
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--text-muted))]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--primary-subtle))] inline-block" /> active
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--text-muted))]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--surface-muted))] inline-block" /> eliminated
          </span>
        </div>
      </div>
    </div>
  );
}

function StackVisual() {
  const stack = ["push(42)", "push(17)", "push(8)", "peek → 8"];
  return (
    <div className="w-full max-w-[340px] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-[hsl(var(--bg-subtle))] border-b border-[hsl(var(--border))]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs font-mono text-[hsl(var(--text-muted))]">stack.js — operations</span>
      </div>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-[hsl(var(--text-muted))] mb-4 font-semibold">Stack — top of stack ↑</p>
        <div className="flex flex-col-reverse gap-2">
          {stack.map((item, i) => (
            <div
              key={i}
              className="w-full h-10 rounded-lg flex items-center px-4 text-[13px] font-semibold transition-all"
              style={{
                background: `hsl(var(--primary) / ${0.1 + (i + 1) * 0.2})`,
                color: i === stack.length - 1 ? "hsl(var(--primary-foreground))" : "hsl(var(--text))",
                boxShadow: i === stack.length - 1 ? "0 2px 12px hsl(var(--primary) / 0.25)" : "none",
              }}
            >
              {item}
              {i === stack.length - 1 && (
                <span className="ml-auto text-[11px] bg-[hsl(var(--primary-foreground))/0.3] rounded px-2 py-0.5">TOP</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ConceptsSection() {
  return (
    <section>
      {CONCEPTS.map((c, idx) => (
        <div key={idx} className="py-20 px-6 bg-[hsl(var(--bg-subtle))] even:bg-[hsl(var(--bg))]">
          <div
            className={`max-w-[1100px] mx-auto flex flex-col ${
              c.flip ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-16 lg:gap-24`}
          >
            <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto">
              {c.visual}
            </div>

            <div className="flex-1 flex flex-col gap-5 items-start">
              <h2 className="font-display text-[2.6rem] sm:text-[3.2rem] font-black leading-[1.08] tracking-tight text-[hsl(var(--text))]">
                {c.heading}
              </h2>
              <p className="font-body text-lg text-[hsl(var(--text-muted))] leading-relaxed max-w-[460px]">
                {c.body}
              </p>
              <Link
                href={c.cta.href}
                className="inline-flex items-center gap-2 h-[46px] px-7 rounded-full bg-[hsl(var(--text))] text-[hsl(var(--bg))] text-[15px] font-bold hover:bg-[hsl(var(--primary))] transition-all duration-200"
              >
                {c.cta.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="py-20 px-6 bg-[hsl(var(--accent-subtle))]">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
          <div className="flex-1 flex flex-col gap-5 items-start">
            <h2 className="font-display text-[2.6rem] sm:text-[3.2rem] font-black leading-[1.08] tracking-tight text-[hsl(var(--text))]">
              More effective, more fun
            </h2>
            <p className="font-body text-lg text-[hsl(var(--text-muted))] leading-relaxed max-w-[460px]">
              AlgoBuddy&apos;s interactive approach helps you master DSA concepts in less time, with more purpose and joy.
            </p>
            <Link
              href="/visualizer"
              className="inline-flex items-center gap-2 h-[46px] px-7 rounded-full bg-[hsl(var(--text))] text-[hsl(var(--bg))] text-[15px] font-bold hover:bg-[hsl(var(--primary))] transition-all duration-200"
            >
              Start learning
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
