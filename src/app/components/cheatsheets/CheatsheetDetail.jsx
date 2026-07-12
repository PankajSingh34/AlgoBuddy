"use client";

import { useMemo } from "react";
import { ArrowLeft, Bookmark, Download, Search } from "lucide-react";
import Link from "next/link";
import ComplexityTable from "./ComplexityTable";
import CodeSnippet from "./CodeSnippet";
import { allCheatsheets } from "./data";

const practiceProblemsById = {
  "binary-search": {
    easy: ["Search Insert Position"],
    medium: ["Find Peak Element"],
    hard: ["Median of Two Sorted Arrays"],
  },
  "hash-map": {
    easy: ["Two Sum"],
    medium: ["Group Anagrams"],
    hard: ["Substring with Concatenation of All Words"],
  },
  "linear-search": {
    easy: ["Find the First Occurrence"],
    medium: ["Count Target Occurrences"],
    hard: ["Minimum Subarray Cover"],
  },
  "jump-search": {
    easy: ["Implement Jump Search"],
    medium: ["Search in a Large Sorted Array"],
    hard: ["Block-Based Search Strategy"],
  },
  default: {
    easy: ["Practice the basic implementation"],
    medium: ["Solve a standard interview variation"],
    hard: ["Combine the technique with another pattern"],
  },
};

function getPracticeProblems(id) {
  return practiceProblemsById[id] || practiceProblemsById.default;
}

function SectionCard({ id, title, children, tone = "slate" }) {
  const toneClasses =
    tone === "success"
      ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/15"
      : tone === "danger"
        ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/15"
        : "border-slate-200 bg-white dark:border-slate-800/70 dark:bg-slate-950/40";

  return (
    <section id={id} className={`rounded-2xl border p-5 shadow-sm ${toneClasses}`}>
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#a435f0]/20 bg-[#a435f0]/10 px-3 py-1 text-xs font-semibold text-[#7c2bd6] dark:text-[#d8b4fe]">
      {children}
    </span>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
      {children}
    </span>
  );
}

export default function CheatsheetDetail({ cheatsheet }) {
  const relatedTopics = useMemo(() => {
    return allCheatsheets.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
    }));
  }, []);

  if (!cheatsheet) {
    return (
      <div className="py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Cheatsheet not found</h2>
        <Link href="/cheatsheets" className="text-[#a435f0] transition-colors hover:text-[#c084fc]">
          Back to cheatsheets
        </Link>
      </div>
    );
  }

  const { id, title, category, difficulty, code, steps, whenToUse, pitfalls } = cheatsheet;
  const overview =
    cheatsheet.overview ||
    `${title} is a quick-reference guide for solving problems with the ${title.toLowerCase()} pattern.`;
  const practiceProblems = getPracticeProblems(id);

  return (
    <div className="mx-auto max-w-7xl" id="cheatsheet-content">
      <Link
        href="/cheatsheets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft size={16} /> Back to cheatsheets
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="self-start lg:sticky lg:top-24 lg:w-1/5">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/40">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Search
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search cheatsheets"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-600 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Cheatsheets
              </h2>
              <nav className="max-h-[28rem] space-y-2 overflow-auto pr-1">
                {relatedTopics.map((item) => {
                  const isActive = item.id === id;

                  return (
                    <Link
                      key={item.id}
                      href={`/cheatsheets/${item.id}`}
                      className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-3 text-sm transition-colors ${
                        isActive
                          ? "border-[#a435f0]/40 bg-[#a435f0]/10 text-[#7c2bd6] dark:text-[#d8b4fe]"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#a435f0]/30 hover:bg-[#a435f0]/5 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.category}</div>
                      </div>
                      {isActive && (
                        <span className="rounded-full bg-[#a435f0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                          Active
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        <main className="space-y-6 lg:w-3/5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/40">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>{category}</Badge>
              <Badge>{difficulty}</Badge>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{overview}</p>

                <div className="flex flex-wrap gap-3">
                  <Pill>Time: {cheatsheet.timeComplexity?.average || cheatsheet.timeComplexity}</Pill>
                  <Pill>Space: {cheatsheet.spaceComplexity}</Pill>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-[#a435f0]/30 hover:text-[#7c2bd6] dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                >
                  <Bookmark size={16} />
                  Bookmark
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#a435f0] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8f2cd6]"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          </section>

          <SectionCard id="overview" title="Overview">
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{overview}</p>
          </SectionCard>

          <SectionCard id="complexity" title="Complexity">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Pill>Time: {cheatsheet.timeComplexity?.average || cheatsheet.timeComplexity}</Pill>
                <Pill>Space: {cheatsheet.spaceComplexity}</Pill>
              </div>
              {cheatsheet.timeComplexity?.best && <ComplexityTable cheatsheet={cheatsheet} />}
            </div>
          </SectionCard>

          {whenToUse && (
            <SectionCard id="when-to-use" title="When to Use" tone="success">
              {Array.isArray(whenToUse) ? (
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  {whenToUse.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{whenToUse}</p>
              )}
            </SectionCard>
          )}

          <SectionCard id="common-mistakes" title="Common Mistakes" tone="danger">
            {Array.isArray(pitfalls) ? (
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                {pitfalls.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                {pitfalls || "Watch boundary conditions, edge cases, and assumptions about the input."}
              </p>
            )}
          </SectionCard>

          {code && (
            <SectionCard id="code" title="Code">
              <div className="space-y-4">
                {code.javascript && <CodeSnippet code={code.javascript.trim()} language="javascript" />}
                {code.python && <CodeSnippet code={code.python.trim()} language="python" />}
              </div>
            </SectionCard>
          )}

          {steps && steps.length > 0 && (
            <SectionCard id="steps" title="Algorithm Steps">
              <ol className="space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#a435f0]/10 text-xs font-bold text-[#7c2bd6] dark:text-[#d8b4fe]">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </SectionCard>
          )}

          <SectionCard id="practice-problems" title="Practice Problems">
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries({
                Easy: practiceProblems.easy,
                Medium: practiceProblems.medium,
                Hard: practiceProblems.hard,
              }).map(([difficultyLabel, problems]) => (
                <div
                  key={difficultyLabel}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{difficultyLabel}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    {problems.map((problem) => (
                      <li key={problem} className="flex gap-2">
                        <span className="text-[#a435f0]">-</span>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionCard>
        </main>
         <aside className="self-start lg:sticky lg:top-24 lg:w-1/5">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/40">
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Table of Contents
              </h2>
              <nav className="space-y-2">
                {[
                  { label: "Overview", href: "#overview" },
                  { label: "Complexity", href: "#complexity" },
                  { label: "When to Use", href: "#when-to-use" },
                  { label: "Common Mistakes", href: "#common-mistakes" },
                  { label: "Code", href: "#code" },
                  { label: "Algorithm Steps", href: "#steps" },
                  { label: "Practice Problems", href: "#practice-problems" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-colors hover:border-[#a435f0]/30 hover:text-[#7c2bd6] dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:border-[#a435f0]/30 hover:text-[#7c2bd6] dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:border-[#a435f0]/30 hover:text-[#7c2bd6] dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                >
                  Open Visualizer
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:border-[#a435f0]/30 hover:text-[#7c2bd6] dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                >
                  Practice Problems
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
