"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MockInterviewHistoryDetailPage() {
  const { attemptId } = useParams();
  const [session, setSession] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!attemptId) return;

    let mounted = true;

    supabase
      .from("mock_interview_sessions")
      .select("*")
      .eq("id", attemptId)
      .single()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data ?? null);
        setFetching(false);
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
        setFetching(false);
      });

    return () => {
      mounted = false;
    };
  }, [attemptId]);

  if (fetching) {
    return (
      <main className="container-app section-app min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
        <section className="card-surface mx-auto max-w-5xl p-6 sm:p-8">
          <p className="text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">Loading attempt...</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="container-app section-app min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
        <section className="card-surface mx-auto max-w-5xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">Attempt not found</h1>
          <p className="mt-2 text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
            This interview record is unavailable or has been removed.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="container-app section-app min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <section className="card-surface mx-auto max-w-5xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
          Mock Interview History Detail
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
          Attempt details
        </h1>
        <p className="mt-2 capitalize text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
          {session.algorithm} · {session.difficulty} · Score: {session.score ?? "--"}
        </p>

        {session.final_code && (
          <pre className="mt-6 overflow-x-auto rounded-2xl bg-[var(--udemy-dark-bg)] p-4 font-mono text-sm text-white">
            {session.final_code}
          </pre>
        )}

        {Array.isArray(session.test_results) && session.test_results.length > 0 && (
          <div className="mt-6 space-y-3">
            {session.test_results.map((item, idx) => {
              const passed = item.visibleTestsPassed ?? 0;
              const total = item.visibleTestsTotal ?? 0;

              return (
                <div key={item.problemId || idx} className="rounded-xl border border-[var(--color-border)] p-3 text-sm dark:border-[var(--udemy-dark-border)]">
                  <p className="font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    {item.title || `Problem ${idx + 1}`}
                  </p>
                  <p className="mt-1 text-xs text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    Difficulty: {item.difficulty || "n/a"}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">Visible tests:</span>{" "}
                    <span className={passed === total && total > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {passed}/{total}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}