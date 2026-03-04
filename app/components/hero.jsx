"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { event } from "@/lib/gtag";

/* ── typewriter words ── */
const WORDS = ["Data Structures", "Sorting Algorithms", "Binary Search", "Graph Traversal", "Dynamic Programming"];

const HeroSection = () => {
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* typewriter effect */
  useEffect(() => {
    const current = WORDS[wordIndex];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 35);
    } else {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  const handleStart = () => {
    event({ action: "click_start_visualizing", category: "Hero", label: "Start Visualizing Button" });
    router.push("/visualizer");
  };

  return (
    <main
      className="bg-white dark:bg-[#1c1d1f]"
      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
    >
      <section className="min-h-[calc(100vh-60px)] flex items-center justify-center px-5 py-20 relative overflow-hidden">

        {/* ── very subtle background grid ── */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#1c1d1f 1px,transparent 1px),linear-gradient(90deg,#1c1d1f 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* ══ LEFT — text ══ */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-7">

            {/* eyebrow badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d1d7dc] dark:border-[#3e4143] text-[13px] font-semibold text-[#6a6f73] dark:text-[#9e9e9e] tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse" />
              Interactive Learning Platform
            </span>

            {/* headline */}
            <h1
              className="text-[2.8rem] sm:text-[3.5rem] lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight text-[#1c1d1f] dark:text-[#f7f9fa]"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              Visualize &amp; Master
              <br />
              <span className="text-[#a435f0]">Algo</span>Buddy the Smart Way.
            </h1>

            {/* typewriter */}
            <p className="text-[1.15rem] text-[#6a6f73] dark:text-[#9e9e9e] font-medium h-7">
              Currently visualizing:{" "}
              <span className="text-[#1c1d1f] dark:text-[#f7f9fa] font-semibold">
                {displayed}
                <span className="animate-pulse">|</span>
              </span>
            </p>

            {/* sub-copy */}
            <p className="text-[1.05rem] text-[#6a6f73] dark:text-[#9e9e9e] max-w-[480px] leading-relaxed">
              Step-by-step animations for every major algorithm and data structure.
              Build intuition before you write a single line of code.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                onClick={handleStart}
                className="group inline-flex items-center gap-2 h-[48px] px-8 bg-[#1c1d1f] dark:bg-[#f7f9fa] text-white dark:text-[#1c1d1f] text-[15px] font-bold hover:bg-[#a435f0] dark:hover:bg-[#a435f0] dark:hover:text-white transition-colors"
              >
                Start Visualizing
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 h-[48px] px-8 border-[1.5px] border-[#1c1d1f] dark:border-[#f7f9fa] text-[#1c1d1f] dark:text-[#f7f9fa] text-[15px] font-bold hover:border-[#a435f0] hover:text-[#a435f0] dark:hover:border-[#a435f0] dark:hover:text-[#a435f0] transition-colors"
              >
                Read Blogs
              </Link>
            </div>

            {/* social proof row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-[14px] text-[#6a6f73] dark:text-[#9e9e9e]">
              {/* avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["A","S","R"].map((l) => (
                    <div key={l} className="w-8 h-8 rounded-full bg-[#a435f0] border-2 border-white dark:border-[#1c1d1f] flex items-center justify-center text-white text-xs font-bold">
                      {l}
                    </div>
                  ))}
                </div>
                <span className="font-semibold text-[#1c1d1f] dark:text-[#f7f9fa]">1,000+</span> active learners
              </div>

              {/* divider */}
              <div className="w-px h-5 bg-[#d1d7dc] dark:bg-[#3e4143]" />

              {/* stars */}
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < 4 ? "text-[#f4c430]" : "text-[#d1d7dc]"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span><span className="font-semibold text-[#1c1d1f] dark:text-[#f7f9fa]">4.5</span> / 5 · 200+ reviews</span>
              </div>
            </div>
          </div>

          {/* ══ RIGHT — DSA visual card ══ */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto">
            <div className="relative w-full max-w-[460px]">

              {/* ── main card: code editor window ── */}
              <div className="rounded-2xl border border-[#d1d7dc] dark:border-[#3e4143] bg-[#1c1d1f] shadow-2xl overflow-hidden">

                {/* title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2f31] border-b border-[#3e4143]">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-[12px] text-[#9e9e9e] font-mono">binarySearch.js</span>
                </div>

                {/* code body */}
                <div className="px-5 py-5 font-mono text-[13px] leading-[1.85] select-none">
                  <div><span className="text-[#c792ea]">function</span> <span className="text-[#82aaff]">binarySearch</span><span className="text-[#f7f9fa]">(arr, target) {"{"}</span></div>
                  <div className="pl-5"><span className="text-[#c792ea]">let</span> <span className="text-[#f78c6c]">left</span> <span className="text-[#89ddff]">=</span> <span className="text-[#f78c6c]">0</span><span className="text-[#f7f9fa]">,</span> <span className="text-[#f78c6c]">right</span> <span className="text-[#89ddff]">=</span> <span className="text-[#f7f9fa]">arr.length</span> <span className="text-[#89ddff]">-</span> <span className="text-[#f78c6c]">1</span><span className="text-[#f7f9fa]">;</span></div>
                  <div className="pl-5 mt-1"><span className="text-[#c792ea]">while</span> <span className="text-[#f7f9fa]">(left</span> <span className="text-[#89ddff]">&lt;=</span> <span className="text-[#f7f9fa]">right) {"{"}</span></div>
                  <div className="pl-10"><span className="text-[#c792ea]">const</span> <span className="text-[#f78c6c]">mid</span> <span className="text-[#89ddff]">=</span> <span className="text-[#f7f9fa]">Math.floor((left</span> <span className="text-[#89ddff]">+</span> <span className="text-[#f7f9fa]">right)</span> <span className="text-[#89ddff]">/</span> <span className="text-[#f78c6c]">2</span><span className="text-[#f7f9fa]">);</span></div>
                  <div className="pl-10 bg-[#a435f0]/20 rounded px-2 -mx-2"><span className="text-[#c792ea]">if</span> <span className="text-[#f7f9fa]">(arr[mid]</span> <span className="text-[#89ddff]">===</span> <span className="text-[#f7f9fa]">target)</span> <span className="text-[#c792ea]">return</span> <span className="text-[#f78c6c]">mid</span><span className="text-[#f7f9fa]">;</span></div>
                  <div className="pl-10"><span className="text-[#c792ea]">else if</span> <span className="text-[#f7f9fa]">(arr[mid]</span> <span className="text-[#89ddff]">&lt;</span> <span className="text-[#f7f9fa]">target) left</span> <span className="text-[#89ddff]">=</span> <span className="text-[#f7f9fa]">mid</span> <span className="text-[#89ddff]">+</span> <span className="text-[#f78c6c]">1</span><span className="text-[#f7f9fa]">;</span></div>
                  <div className="pl-10"><span className="text-[#c792ea]">else</span> <span className="text-[#f7f9fa]">right</span> <span className="text-[#89ddff]">=</span> <span className="text-[#f7f9fa]">mid</span> <span className="text-[#89ddff]">-</span> <span className="text-[#f78c6c]">1</span><span className="text-[#f7f9fa]">;</span></div>
                  <div className="pl-5"><span className="text-[#f7f9fa]">{"}"}</span></div>
                  <div className="pl-5"><span className="text-[#c792ea]">return</span> <span className="text-[#f78c6c]">-1</span><span className="text-[#f7f9fa]">;</span></div>
                  <div><span className="text-[#f7f9fa]">{"}"}</span></div>
                </div>

                {/* visualizer strip */}
                <div className="px-5 pb-5">
                  <div className="rounded-lg bg-[#2d2f31] border border-[#3e4143] p-4">
                    <p className="text-[11px] text-[#9e9e9e] font-mono mb-3 uppercase tracking-wider">Visualization — step 2 of 4</p>
                    {/* array bars */}
                    <div className="flex items-end gap-1.5 h-[60px]">
                      {[2, 5, 8, 12, 16, 23, 38, 45, 56, 72].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-sm transition-all"
                            style={{
                              height: `${(v / 72) * 52}px`,
                              background:
                                i === 5 ? "#a435f0"       // mid — purple
                                : i >= 5 ? "#3e4143"       // right half — dimmed
                                : "#6a6f73",               // left half
                            }}
                          />
                          <span className="text-[9px] text-[#9e9e9e] font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                    {/* legend */}
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-[11px] text-[#9e9e9e]"><span className="w-2.5 h-2.5 rounded-sm bg-[#a435f0]" /> mid</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-[#9e9e9e]"><span className="w-2.5 h-2.5 rounded-sm bg-[#6a6f73]" /> active</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-[#9e9e9e]"><span className="w-2.5 h-2.5 rounded-sm bg-[#3e4143]" /> eliminated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── floating badge top-right ── */}
              <div className="absolute -top-4 -right-4 flex items-center gap-2 bg-white dark:bg-[#2d2f31] border border-[#d1d7dc] dark:border-[#3e4143] rounded-full pl-2.5 pr-4 py-2 shadow-xl text-[13px] font-semibold text-[#1c1d1f] dark:text-[#f7f9fa]">
                <span className="w-7 h-7 rounded-full bg-[#a435f0] flex items-center justify-center text-white text-[11px] font-bold">O</span>
                O(log n)
              </div>

              {/* ── floating badge bottom-left ── */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 bg-white dark:bg-[#2d2f31] border border-[#d1d7dc] dark:border-[#3e4143] rounded-full pl-2.5 pr-4 py-2 shadow-xl text-[13px] font-semibold text-[#1c1d1f] dark:text-[#f7f9fa]">
                <span className="w-7 h-7 rounded-full bg-[#28c840] flex items-center justify-center text-white text-[11px] font-bold">✓</span>
                Found at index 5
              </div>

              {/* glow */}
              <div className="absolute inset-0 rounded-2xl bg-[#a435f0]/8 blur-3xl -z-10 scale-110" />
            </div>
          </div>

        </div>

        {/* ── scroll hint ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#6a6f73] dark:text-[#9e9e9e]">
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* divider */}
      <div className="px-6">
        <div className="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-[#d1d7dc] dark:via-[#3e4143] to-transparent" />
      </div>
    </main>
  );
};

export default HeroSection;
