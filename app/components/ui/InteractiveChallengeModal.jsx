"use client";

import React from "react";

const InteractiveChallengeModal = ({
  open,
  question,
  options,
  selectedOption,
  onSelect,
  onSubmit,
  totalQuestions,
  correctAnswers,
  feedback,
}) => {
  if (!open) return null;

  const accuracy = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-white p-5 shadow-2xl dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Interactive Challenge Mode
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              Answer to continue
            </h2>
          </div>
          <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            {accuracy}% accuracy
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
          {question}
        </p>

        <div className="mt-4 space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedOption === index;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(index)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                    : "border-slate-300 bg-slate-50 text-slate-800 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {feedback ? (
          <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">{feedback}</p>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            Choose an option and submit to resume the animation.
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-300">
            Questions: {totalQuestions} • Correct: {correctAnswers}
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={selectedOption === null}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            Submit answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChallengeModal;
