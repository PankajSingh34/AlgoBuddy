"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/app/components/UserContext";
import { supabase } from "@/lib/supabase";

export default function MockInterviewHistoryPage() {
  const { user, loading } = useUser();
  const [sessions, setSessions] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setSessions([]);
      setFetching(false);
      return;
    }

    let mounted = true;

    supabase
      .from("mock_interview_sessions")
      .select("id, algorithm, difficulty, score, time_taken_secs, created_at, status, hints_used")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!mounted) return;
        setSessions(data ?? []);
        setFetching(false);
      })
      .catch(() => {
        if (!mounted) return;
        setSessions([]);
        setFetching(false);
      });

    return () => {
      mounted = false;
    };
  }, [user, loading]);

  if (loading || fetching) {
    return (
      <main className="container-app section-app min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
        <section className="card-surface mx-auto max-w-5xl p-6 sm:p-8">
          <p className="text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">Loading history...</p>
        </section>
      </main>
    );
  }

  if (!user || sessions.length === 0) {
    return (
      <main className="container-app section-app min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
        <section className="card-surface mx-auto max-w-3xl p-8 sm:p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
            Mock Interview History
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
            No interviews yet
          </h1>
          <p className="mt-2 text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
            Complete your first mock interview to see attempt history and score trends here.
          </p>
          <Link
            href="/mock-interview"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            Start interview
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container-app section-app min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
          Mock Interview History
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
          Interview attempts
        </h1>
        <div className="mt-6 space-y-4">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/mock-interview/history/${session.id}`}
              className="card-surface block p-5 transition hover:border-[var(--color-primary)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold capitalize text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    {session.algorithm} - {session.difficulty}
                  </p>
                  <p className="mt-1 text-xs text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    {new Date(session.created_at).toLocaleDateString()}
                    {session.time_taken_secs ? ` · ${Math.round(session.time_taken_secs / 60)} min` : ""}
                    {session.hints_used ? ` · ${session.hints_used} hint${session.hints_used > 1 ? "s" : ""}` : ""}
                  </p>
                </div>
                <span className="text-2xl font-bold text-[var(--color-primary)]">
                  {session.score ?? "--"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}