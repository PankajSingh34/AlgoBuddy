"use client";

import Link from "next/link";
import { Code2, LightbulbIcon, PlayCircle, ShieldAlert, TimerReset, XCircle } from "lucide-react";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python",     label: "Python"     },
  { value: "java",       label: "Java"       },
];

function formatCountdown(totalSeconds) {
  const safeTotal = Math.max(0, totalSeconds || 0);
  const minutes = Math.floor(safeTotal / 60);
  const seconds = safeTotal % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function timerTone(totalSeconds) {
  if (totalSeconds <= 600)  return "text-red-500";
  if (totalSeconds <= 1200) return "text-amber-500";
  return "text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]";
}

export default function ActiveScreen({ wizard }) {
  const {
    problem,
    code,
    setCode,
    secondsLeft,
    testResults,
    submitting,
    error,
    config,
    hintsUsed,
    currentProblemNumber,
    totalProblems,
    isLastProblem,
    submitCode,
    useHint,
    abandon,
  } = wizard;

  // ✅ FIX: How many hints are left and what's the current hint text
  const hints = problem?.hints ?? [];
  const hintsAllowed = config.allowHints ?? true;
  const currentHint  = hints[hintsUsed - 1] ?? null;   // last revealed hint
  const nextHintIdx  = hintsUsed;                       // 0-based index of next hint
  const hasMoreHints = hintsAllowed && nextHintIdx < hints.length;

  return (
    <section className="container-app section-app">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header row */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
              Active Interview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
              Solve under pressure
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
              Problem statement on the left, editor on the right — timer, test runner, and visualizer access included.
            </p>
            {totalProblems > 0 && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Problem {currentProblemNumber} of {totalProblems}
              </p>
            )}
          </div>

          {/* Countdown timer */}
          <div className={`rounded-2xl border px-4 py-3 text-right ${
            secondsLeft <= 600
              ? "border-red-200 bg-red-50/90 dark:border-red-900/40 dark:bg-red-950/20"
              : secondsLeft <= 1200
              ? "border-amber-200 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/20"
              : "border-[var(--color-border)] bg-white dark:bg-[var(--udemy-dark-surface)]"
          }`}>
            <div className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
              <TimerReset className="h-4 w-4" />
              Countdown
            </div>
            <div className={`mt-1 text-3xl font-bold ${timerTone(secondsLeft)}`}>
              {formatCountdown(secondsLeft)}
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="card-surface border-red-200 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200">
            {error}
          </div>
        )}

        {/* ✅ FIX: Hint reveal panel — shows up after useHint() is called */}
        {currentHint && (
          <div className="card-surface flex items-start gap-3 border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                Hint {hintsUsed} of {hints.length}
              </p>
              <p className="mt-1 text-sm text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                {currentHint}
              </p>
            </div>
          </div>
        )}

        {/* Main split layout */}
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">

          {/* Left panel — problem statement */}
          <article className="card-surface flex flex-col overflow-hidden">
            <div className="border-b border-[var(--color-border)] p-5 dark:border-[var(--udemy-dark-border)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    Problem statement
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    {problem?.title || "Problem loading..."}
                  </h2>
                </div>
                {problem?.visualizerSlug ? (
                  <Link
                    href={`/visualizer/${problem.visualizerSlug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch Visualizer
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    <PlayCircle className="h-4 w-4" />
                    Visualizer coming soon
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                {problem?.description || "The selected prompt will appear here."}
              </p>

              {/* Examples */}
              {problem?.examples?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    Examples
                  </h3>
                  {problem.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-[var(--udemy-dark-bg)] p-3 font-mono text-xs text-white"
                    >
                      <div><span className="text-green-400">Input: </span>{ex.input}</div>
                      <div><span className="text-blue-400">Output: </span>{ex.output}</div>
                      {ex.explanation && (
                        <div className="mt-1 text-gray-400">{ex.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {problem?.constraints && (
                <div className="rounded-2xl bg-surface-50 p-4 text-sm dark:bg-[var(--udemy-dark-bg)]">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    <ShieldAlert className="h-4 w-4 text-[var(--color-primary)]" />
                    Constraints
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    {problem.constraints}
                  </pre>
                </div>
              )}

              {/* Language indicator (read-only in active screen) */}
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-4 dark:border-[var(--udemy-dark-border)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                  <Code2 className="h-4 w-4 text-[var(--color-primary)]" />
                  Language
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className={`rounded-xl border px-3 py-2 text-center text-sm font-semibold ${
                        config.language === option.value
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border-[var(--color-border)] bg-white text-[var(--udemy-muted)] dark:bg-[var(--udemy-dark-surface)] dark:text-[var(--udemy-dark-muted)]"
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Test runner */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    Visible test cases
                  </h3>
                  <button
                    type="button"
                    onClick={submitCode}
                    disabled={submitting}
                    className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting
                      ? "Running..."
                      : isLastProblem
                      ? "Finish interview"
                      : "Next problem"}
                  </button>
                </div>

                <div className="rounded-2xl bg-[var(--udemy-dark-bg)] p-4 text-sm text-white shadow-inner">
                  {(problem?.testCases?.filter((tc) => !tc.isHidden) ?? []).length === 0 ? (
                    <p className="text-center text-gray-500 text-xs py-2">
                      No visible test cases for this problem — submit to run all.
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {problem.testCases
                        .filter((tc) => !tc.isHidden)
                        .map((tc, index) => {
                          const result = testResults?.find((r) => r.caseId === tc.id);
                          return (
                            <div
                              key={tc.id || index}
                              className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                            >
                              <span className="font-medium">Case {index + 1}</span>
                              <span className={
                                !result
                                  ? "text-gray-400"
                                  : result.passed
                                  ? "text-green-400"
                                  : "text-red-400"
                              }>
                                {!result ? "Not run" : result.passed ? "Passed ✓" : `Failed — got ${result.output}`}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Right panel — code editor */}
          <aside className="card-surface flex flex-col overflow-hidden">
            <div className="border-b border-[var(--color-border)] p-5 dark:border-[var(--udemy-dark-border)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                <Code2 className="h-4 w-4 text-[var(--color-primary)]" />
                Code editor
              </div>
            </div>

            <div className="flex-1 p-5">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="min-h-[420px] w-full rounded-3xl border border-[var(--color-border)] bg-[var(--udemy-dark-bg)] p-4 font-mono text-sm leading-6 text-white outline-none transition focus:border-[var(--color-primary)] dark:border-[var(--udemy-dark-border)]"
                placeholder="Write your solution here..."
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {/* ✅ FIX: Hint button — disabled when hints off or exhausted */}
                <button
                  type="button"
                  onClick={useHint}
                  disabled={!hasMoreHints}
                  title={
                    !hintsAllowed
                      ? "Hints disabled for this session"
                      : !hasMoreHints
                      ? "No more hints available"
                      : `Reveal hint ${nextHintIdx + 1} of ${hints.length}`
                  }
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--udemy-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40 dark:text-[var(--udemy-dark-text)]"
                >
                  <span className="flex items-center gap-2">
                    <LightbulbIcon className="h-4 w-4" />
                    {hintsUsed === 0
                      ? "Use hint"
                      : hasMoreHints
                      ? `Next hint (${hintsUsed}/${hints.length})`
                      : "No more hints"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={abandon}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--udemy-text)] transition hover:border-red-300 hover:text-red-600 dark:text-[var(--udemy-dark-text)]"
                >
                  <span className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Abandon
                  </span>
                </button>

                {/* Hints used counter */}
                {hintsUsed > 0 && (
                  <span className="ml-auto text-xs text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    {hintsUsed} hint{hintsUsed > 1 ? "s" : ""} used (−{hintsUsed * 5} pts)
                  </span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}