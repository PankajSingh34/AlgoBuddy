"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, CheckCircle2, Circle, ArrowRight, Trophy } from "lucide-react";
import Footer from "@/app/components/footer";

const ROADMAP_STAGES = [
  {
    stage: 1,
    title: "Foundations & Basics",
    description: "Understand the fundamentals of logic building, space/time complexity analysis, and simple recursion.",
    topics: [
      { id: "lang-basics", label: "Programming language syntax & basics" },
      { id: "big-o-analysis", label: "Space & Time Complexity (Big O)" },
      { id: "rec-math", label: "Basic Math and Simple Recursion" },
    ],
    links: [
      { label: "Complexity Cheatsheet", href: "/cheatsheets" },
      { label: "Recursion Visualizer", href: "/visualizer/recursion" },
    ],
  },
  {
    stage: 2,
    title: "Linear Data Structures",
    description: "Master storing sequences of elements in continuous memory or linked nodes.",
    topics: [
      { id: "arrays", label: "Arrays & Dynamic Arrays" },
      { id: "linked-lists", label: "Singly, Doubly, and Circular Linked Lists" },
      { id: "stacks-queues", label: "Stacks (LIFO) and Queues (FIFO)" },
    ],
    links: [
      { label: "Linked List Visualizer", href: "/visualizer/linkedlist" },
      { label: "Stack Visualizer", href: "/visualizer/stack" },
      { label: "Queue Visualizer", href: "/visualizer/queue" },
    ],
  },
  {
    stage: 3,
    title: "Sorting & Searching",
    description: "Learn how to organize, rearrange, and quickly search through data.",
    topics: [
      { id: "searching", label: "Linear Search and Binary Search" },
      { id: "simple-sort", label: "Bubble Sort, Selection Sort, Insertion Sort" },
      { id: "divide-conquer-sort", label: "Merge Sort and Quick Sort" },
    ],
    links: [
      { label: "Sorting Visualizer", href: "/visualizer/array" },
    ],
  },
  {
    stage: 4,
    title: "Non-Linear Data Structures",
    description: "Explore hierarchical structures like Trees and networks of nodes called Graphs.",
    topics: [
      { id: "trees-bst", label: "Binary Trees & Binary Search Trees" },
      { id: "heaps", label: "Binary Heaps & Priority Queues" },
      { id: "graphs", label: "Graphs (Representations, BFS & DFS)" },
    ],
    links: [
      { label: "Tree Visualizer", href: "/visualizer/tree" },
      { label: "Graph Visualizer", href: "/visualizer/graph" },
    ],
  },
  {
    stage: 5,
    title: "Advanced Algorithmic Design",
    description: "Solve complex optimization problems using state-of-the-art programming paradigms.",
    topics: [
      { id: "greedy", label: "Greedy Algorithms" },
      { id: "backtracking", label: "Backtracking (N-Queens, Sudoku)" },
      { id: "dp", label: "Dynamic Programming (Memoization & Tabulation)" },
    ],
    links: [
      { label: "Recursion & DP Lab", href: "/visualizer/recursion" },
    ],
  },
];

export default function Roadmaps() {
  const [completedTopics, setCompletedTopics] = useState({});
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("algobuddy_roadmap_progress");
      if (stored) {
        setCompletedTopics(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading roadmap progress:", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  const handleToggle = (id) => {
    const nextState = {
      ...completedTopics,
      [id]: !completedTopics[id],
    };
    setCompletedTopics(nextState);
    try {
      localStorage.setItem("algobuddy_roadmap_progress", JSON.stringify(nextState));
    } catch (e) {
      console.error("Error saving roadmap progress:", e);
    }
  };

  const allTopics = ROADMAP_STAGES.flatMap((s) => s.topics);
  const totalTopics = allTopics.length;
  const completedCount = allTopics.filter((t) => completedTopics[t.id]).length;
  const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <main className="container-app section-app">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-sm font-bold tracking-wider uppercase mb-4">
              <Compass className="w-4 h-4 animate-spin-slow" />
              Learning Path
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-serif text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-6">
              DSA Learning{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] dark:from-[var(--color-primary-light)] dark:to-[var(--color-primary)]">
                Roadmap
              </span>
            </h1>
            <p className="text-xl text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] max-w-2xl mx-auto">
              Follow this step-by-step curriculum to master data structures and algorithms. Check off topics as you go!
            </p>
          </div>

          {/* Progress Tracker card */}
          {mounted && (
            <div className="card-surface p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-udemy-purple/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--udemy-text)] dark:text-white">Your Progress</h2>
                  <p className="text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    {completedCount} of {totalTopics} topics completed ({percentage}%)
                  </p>
                </div>
              </div>
              <div className="w-full md:w-64 bg-[var(--color-neutral-200)] dark:bg-[var(--color-neutral-700)] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[var(--color-primary)] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Timeline Stages */}
          <div className="relative border-l-2 border-[var(--color-border)] ml-4 md:ml-6 pl-6 md:pl-10 space-y-12 py-4">
            {ROADMAP_STAGES.map((item) => (
              <div key={item.stage} className="relative group">
                {/* Timeline node icon indicator */}
                <span className="absolute -left-[39px] md:-left-[55px] top-1.5 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-white dark:bg-[var(--udemy-dark-bg)] border-2 border-[var(--color-primary)] text-xs md:text-sm font-bold text-[var(--color-primary)] transition-all">
                  {item.stage}
                </span>

                <div className="card-surface p-6 group-hover:border-[var(--color-primary)]/50 transition-colors duration-200">
                  <h3 className="text-xl font-bold font-serif text-[var(--udemy-text)] dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] mb-6">
                    {item.description}
                  </p>

                  {/* Checklist */}
                  <div className="space-y-3 mb-6 bg-[var(--udemy-surface)] dark:bg-[var(--udemy-dark-bg)] rounded-xl p-4 border border-[var(--color-border)]/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2">Core Topics</h4>
                    {item.topics.map((topic) => {
                      const isDone = completedTopics[topic.id];
                      return (
                        <button
                          key={topic.id}
                          onClick={() => handleToggle(topic.id)}
                          className="flex items-start gap-3 w-full text-left group/btn"
                        >
                          <span className="mt-0.5 text-[var(--color-primary)] hover:scale-110 transition-transform">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 fill-[var(--color-primary)] text-white" />
                            ) : (
                              <Circle className="w-5 h-5 text-[var(--color-border)] group-hover/btn:text-[var(--color-primary)]" />
                            )}
                          </span>
                          <span
                            className={`text-sm transition-colors ${
                              isDone
                                ? "text-[var(--color-muted)] line-through"
                                : "text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]"
                            }`}
                          >
                            {topic.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Practice links */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                    <span className="text-xs font-semibold text-[var(--color-muted)]">Practice on AlgoBuddy:</span>
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:gap-1.5 transition-all bg-udemy-purple/5 dark:bg-udemy-purple-light/5 px-2.5 py-1 rounded-md"
                      >
                        {link.label}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back Home */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all font-semibold text-sm text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
