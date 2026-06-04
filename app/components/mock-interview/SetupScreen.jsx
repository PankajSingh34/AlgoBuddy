"use client";

import { ArrowRight, Clock3, Layers3, Sparkles, ToggleLeft } from "lucide-react";

// ✅ FIX 1: These must exactly match ALGORITHMS in mockInterviewBank.js
const ALGORITHM_OPTIONS = [
  { value: "arrays",  label: "Arrays"  },
  { value: "strings", label: "Strings" },
  { value: "trees",   label: "Trees"   },
  { value: "graphs",  label: "Graphs"  },
  { value: "dp",      label: "DP"      },
  { value: "sorting", label: "Sorting" },
];

// ✅ FIX 2: "mixed" removed — bank only has easy/medium/hard/expert
const DIFFICULTY_OPTIONS = ["easy", "medium", "hard", "expert"];

const TIMER_OPTIONS = [
  { value: 900,  label: "15 min" },
  { value: 1800, label: "30 min" },
  { value: 2700, label: "45 min" },
  { value: 3600, label: "60 min" },
];

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python",     label: "Python"     },
  { value: "java",       label: "Java"       },
];

function optionClass(isActive) {
  return isActive
    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
    : "border-[var(--color-border)] bg-white dark:bg-[var(--udemy-dark-surface)] text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]";
}

export default function SetupScreen({ wizard }) {
  const { config, updateConfig, startInterview, submitting, error } = wizard;

  return (
    <section className="container-app section-app">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
              Mock Interview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
              Interview setup
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
              Pick the difficulty, topic, timer, language, and session controls before the interview begins.
            </p>
          </div>

          <button
            type="button"
            onClick={startInterview}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Preparing session..." : "Start interview"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="card-surface border-red-200 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="card-surface p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
              <Layers3 className="h-4 w-4 text-[var(--color-primary)]" />
              Session configuration
            </div>

            <div className="mt-6 space-y-6">
              {/* Difficulty */}
              <div>
                <div className="mb-3 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                  Difficulty
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateConfig({ difficulty: option })}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition ${optionClass(config.difficulty === option)}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Algorithm */}
              <div>
                <div className="mb-3 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                  Topic / algorithm
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                  {ALGORITHM_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateConfig({ algorithm: option.value })}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${optionClass(config.algorithm === option.value)}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer + Problems per session */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
                    Problems per session
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={config.problemCount ?? 1}
                    onChange={(e) => updateConfig({ problemCount: Math.max(1, Math.min(5, Number(e.target.value) || 1)) })}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--udemy-text)] outline-none transition focus:border-[var(--color-primary)] dark:bg-[var(--udemy-dark-surface)] dark:text-[var(--udemy-dark-text)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    <Clock3 className="h-4 w-4 text-[var(--color-primary)]" />
                    Timer setting
                  </span>
                  <select
                    value={config.durationSecs}
                    onChange={(e) => updateConfig({ durationSecs: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--udemy-text)] outline-none transition focus:border-[var(--color-primary)] dark:bg-[var(--udemy-dark-surface)] dark:text-[var(--udemy-dark-text)]"
                  >
                    {TIMER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Language */}
              <div>
                <div className="mb-3 text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                  Language preference
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateConfig({ language: option.value })}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${optionClass(config.language === option.value)}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] px-4 py-3">
                  <span className="text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    Hints enabled
                  </span>
                  <button
                    type="button"
                    onClick={() => updateConfig({ allowHints: !(config.allowHints ?? true) })}
                    className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
                  >
                    <ToggleLeft className="h-5 w-5" />
                    {(config.allowHints ?? true) ? "On" : "Off"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] px-4 py-3">
                  <span className="text-sm font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    Skip allowed
                  </span>
                  <button
                    type="button"
                    onClick={() => updateConfig({ allowSkip: !(config.allowSkip ?? true) })}
                    className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
                  >
                    <ToggleLeft className="h-5 w-5" />
                    {(config.allowSkip ?? true) ? "On" : "Off"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Session preview sidebar */}
          <aside className="card-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Session preview
            </p>
            <div className="mt-4 space-y-4 text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
              <div>
                <div className="font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">Selected track</div>
                <div className="mt-1 capitalize">{String(config.algorithm || "").replace(/-/g, " ")}</div>
              </div>
              <div>
                <div className="font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">Difficulty</div>
                <div className="mt-1 capitalize">{config.difficulty}</div>
              </div>
              <div>
                <div className="font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">Duration</div>
                <div className="mt-1">{Math.round((config.durationSecs ?? 1800) / 60)} minutes</div>
              </div>
              <div>
                <div className="font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">Language</div>
                <div className="mt-1 capitalize">{config.language}</div>
              </div>
              <div>
                <div className="font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">Problems</div>
                <div className="mt-1">{config.problemCount ?? 1}</div>
              </div>
            </div>

            {/* ✅ FIX 3: Show available combinations so user knows what's in the bank */}
            <div className="mt-6 rounded-3xl bg-[var(--color-primary)]/8 p-5 text-sm text-[var(--udemy-text)] dark:bg-[var(--color-primary)]/12 dark:text-[var(--udemy-dark-text)]">
              <p className="font-semibold">Practice bank</p>
              <p className="mt-2 text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                At least 5 questions per difficulty level are available for each algorithm track in the mock bank.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}