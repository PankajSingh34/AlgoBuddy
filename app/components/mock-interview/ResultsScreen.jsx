"use client";

import Link from "next/link";
import { Brain, Layers3, ListChecks, Target } from "lucide-react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getReadiness(score) {
  return clamp(score ?? 0, 0, 100);
}

export default function ResultsScreen({ wizard }) {
  const { score, retry, abandon, reviewItems } = wizard;
  const readiness = getReadiness(score);
  const solvedCount = reviewItems.reduce(
    (sum, item) => sum + (item.visibleTestsPassed || 0),
    0,
  );
  const totalCount = reviewItems.reduce(
    (sum, item) => sum + (item.visibleTestsTotal || 0),
    0,
  );
  const totalHints = reviewItems.reduce((sum, item) => sum + (item.hintsUsed || 0), 0);
  const progressRows = [
    { label: "Accuracy", value: totalCount ? Math.round((solvedCount / totalCount) * 100) : readiness },
    { label: "Completion", value: reviewItems.length > 0 ? 100 : 0 },
  ];

  return (
    <section className="container-app section-app">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
            Results
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
            Interview readiness snapshot
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
            A compact results scaffold with score, breakdown bars, practice links, and review pointers.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
              <Target className="h-4 w-4 text-[var(--color-primary)]" />
              Readiness score
            </div>

            <div className="mt-6 flex items-center gap-6">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-8 border-[var(--color-primary)]/15 bg-[var(--color-primary)]/10 text-center">
                <div>
                  <div className="text-4xl font-bold text-[var(--color-primary)]">{readiness}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">out of 100</div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                <div className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-[var(--color-primary)]" />{solvedCount}/{totalCount || 0} visible tests passed</div>
                <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-[var(--color-primary)]" />{totalHints} hints used</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {progressRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    <span>{row.label}</span>
                    <span>{clamp(row.value, 0, 100)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]/40 dark:bg-[var(--udemy-dark-border)]">
                    <div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${clamp(row.value, 0, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={retry}
                className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                Retry interview
              </button>
              <button
                type="button"
                onClick={abandon}
                className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--udemy-text)] transition hover:border-red-300 hover:text-red-600 dark:text-[var(--udemy-dark-text)]"
              >
                Clear session
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-surface p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                <Layers3 className="h-4 w-4 text-[var(--color-primary)]" />
                Per-problem breakdown
              </div>

              <div className="mt-4 space-y-4">
                {reviewItems.map((item) => (
                  <div key={item.problemId} className="rounded-2xl border border-[var(--color-border)] p-4 dark:border-[var(--udemy-dark-border)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] capitalize">
                          {item.difficulty}
                        </div>
                      </div>
                      <div className="text-right text-sm font-semibold text-[var(--color-primary)]">
                        {item.perProblemScore}%
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-border)]/40 dark:bg-[var(--udemy-dark-border)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)]"
                        style={{ width: `${item.perProblemScore}%` }}
                      />
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] sm:grid-cols-2">
                      <div>Hints used: {item.hintsUsed}</div>
                      <div>Test cases: {item.visibleTestsPassed}/{item.visibleTestsTotal}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                <Brain className="h-4 w-4 text-[var(--color-primary)]" />
                Practice follow-up
              </div>
              <div className="mt-4 space-y-3 text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                <p>
                  Failed problems should link back into the practice section for focused drilling.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/practice" className="rounded-full bg-[var(--color-primary)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--color-primary-dark)]">
                    Go to practice
                  </Link>
                  <Link href="/practice/dp" className="rounded-full border border-[var(--color-border)] px-4 py-2 font-semibold text-[var(--udemy-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] dark:text-[var(--udemy-dark-text)]">
                    Review DP patterns
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}