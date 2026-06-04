"use client";

import Link from "next/link";
import { ArrowRightLeft, Code2, Eye, Layers3 } from "lucide-react";

export default function ReviewScreen({ wizard }) {
  const { finishReview, retry, reviewItems } = wizard;

  return (
    <section className="container-app section-app">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
            Problem Review
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
            Compare your approach with the optimal one
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
            Review includes every attempted problem and its optimal reference solution.
          </p>
        </div>

        <div className="space-y-6">
          {reviewItems.map((item) => (
            <div key={item.problemId} className="card-surface p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    Problem {item.index + 1}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    {item.title}
                  </h2>
                </div>
                <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-primary)]">
                  {item.perProblemScore}%
                </span>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    <Code2 className="h-4 w-4 text-[var(--color-primary)]" />
                    Your solution
                  </div>
                  <pre className="min-h-[260px] overflow-auto rounded-2xl bg-[var(--udemy-dark-bg)] p-4 text-sm leading-6 text-white">
                    {item.userCode || "No solution submitted."}
                  </pre>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    <Layers3 className="h-4 w-4 text-[var(--color-primary)]" />
                    Optimal solution
                  </div>
                  <pre className="min-h-[260px] overflow-auto rounded-2xl bg-surface-50 p-4 text-sm leading-6 text-[var(--udemy-text)] dark:bg-[var(--udemy-dark-bg)] dark:text-[var(--udemy-dark-text)]">
                    {item.optimalCode || "Optimal solution will be added."}
                  </pre>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.visualizerSlug && (
                  <Link
                    href={`/visualizer/${item.visualizerSlug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]"
                  >
                    <Eye className="h-4 w-4" />
                    Visualize
                  </Link>
                )}
              </div>
            </div>
          ))}

          <div className="card-surface p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
              <ArrowRightLeft className="h-4 w-4 text-[var(--color-primary)]" />
              Next actions
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={finishReview}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                Continue to results
              </button>
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--udemy-text)] transition hover:border-red-300 hover:text-red-600 dark:text-[var(--udemy-dark-text)]"
              >
                Retry interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}