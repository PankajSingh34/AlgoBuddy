"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  LayoutDashboard,
  Layers3,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { useUser } from "@/features/user/UserContext";
import { useBookmark } from "@/app/hooks/useBookmark";
import { useProblemBookmarks } from "@/app/hooks/useProblemBookmarks";
import { practiceData } from "@/lib/practiceData";

function buildProblemIndex() {
  const index = new Map();

  practiceData.forEach((topic) => {
    topic.subsections.forEach((section) => {
      section.items.forEach((item) => {
        index.set(item.id, {
          ...item,
          topicSlug: topic.slug,
          topicTitle: topic.title,
          sectionTitle: section.title,
        });
      });
    });
  });

  return index;
}

function groupBy(items, getKey) {
  const groups = new Map();

  items.forEach((item) => {
    const key = getKey(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  });

  return Array.from(groups.entries()).map(([name, groupItems]) => ({
    name,
    items: groupItems,
  }));
}

function buildProfileCompletion(user) {
  const metadata = user?.user_metadata || {};
  const checks = [
    {
      label: "Display name",
      complete: Boolean(metadata.name || metadata.display_name || metadata.full_name),
    },
    {
      label: "Email address",
      complete: Boolean(user?.email),
    },
    {
      label: "Avatar",
      complete: Boolean(metadata.avatar_url || metadata.picture),
    },
    {
      label: "Learning goal",
      complete: Boolean(metadata.learning_goal || metadata.goal),
    },
    {
      label: "Skill level",
      complete: Boolean(metadata.skill_level || metadata.level),
    },
  ];

  const completed = checks.filter((item) => item.complete).length;
  const percentage = Math.round((completed / checks.length) * 100);

  return {
    checks,
    completed,
    percentage,
    missing: checks.filter((item) => !item.complete).map((item) => item.label),
  };
}

export default function DashboardClient() {
  const { user } = useUser();
  const {
    bookmarks: resourceBookmarks,
    removeBookmark,
    clearBookmarks,
  } = useBookmark();
  const {
    bookmarks: problemBookmarks,
    loading: problemLoading,
    toggleBookmark,
  } = useProblemBookmarks();

  const problemIndex = useMemo(() => buildProblemIndex(), []);

  const groupedResourceBookmarks = useMemo(() => {
    return groupBy(resourceBookmarks, (item) => item.category || "General")
      .map((group) => ({
        ...group,
        items: group.items.slice().sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [resourceBookmarks]);

  const groupedProblemBookmarks = useMemo(() => {
    const enriched = problemBookmarks
      .map((item) => {
        const meta = problemIndex.get(item.id);
        return {
          ...item,
          meta,
          sortKey: item.createdAt ? new Date(item.createdAt).getTime() : 0,
        };
      })
      .sort((a, b) => b.sortKey - a.sortKey);

    return groupBy(
      enriched,
      (item) => item.meta?.topicTitle || item.topicSlug || "Saved Problems"
    ).map((group) => ({
      ...group,
      items: group.items,
    }));
  }, [problemBookmarks, problemIndex]);

  const stats = [
    { label: "Saved pages", value: resourceBookmarks.length },
    { label: "Practice bookmarks", value: problemBookmarks.length },
    { label: "Bookmark groups", value: groupedResourceBookmarks.length },
  ];
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Guest";
  const profileCompletion = useMemo(
    () => buildProfileCompletion(user),
    [user]
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100">
      <section className="border-b border-slate-200/80 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/30 dark:text-purple-300">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
                Your saved AlgoBuddy resources, in one place.
              </h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-600 dark:text-neutral-400">
                Pick up where you left off, jump back into bookmarked visualizers
                and practice problems, and keep your study flow moving without
                hunting through the app.
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-neutral-400">
                {user
                  ? `Welcome back, ${displayName}.`
                  : "You’re viewing local bookmarks in guest mode."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-[96px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="text-2xl font-black text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/practice"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-primary focus-ring dark:bg-white dark:text-slate-900"
            >
              Open Practice
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/visualizer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-primary hover:text-primary focus-ring dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            >
              Open Visualizer
            </Link>
            <Link
              href="/recently-viewed"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-primary hover:text-primary focus-ring dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            >
              Recently Viewed
            </Link>
          </div>

          {user && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-neutral-300">
                      Profile completion
                    </h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
                    {profileCompletion.missing.length > 0
                      ? `Add ${profileCompletion.missing.join(", ")} to improve your profile.`
                      : "Your profile has the core details needed for personalized guidance."}
                  </p>
                </div>

                <div className="min-w-full md:min-w-[240px]">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-neutral-300">
                    <span>{profileCompletion.completed} of {profileCompletion.checks.length} items</span>
                    <span>{profileCompletion.percentage}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${profileCompletion.percentage}%` }}
                    />
                  </div>
                  <Link
                    href="/profile"
                    className="mt-3 inline-flex text-sm font-bold text-primary hover:underline"
                  >
                    Complete profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10">
        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-black tracking-tight">
                Saved visualizers and pages
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-neutral-400">
                These are grouped by category so you can jump straight to the
                thing you were studying.
              </p>
            </div>
            {resourceBookmarks.length > 0 && (
              <button
                type="button"
                onClick={clearBookmarks}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-500 focus-ring dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>

          {resourceBookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <FolderOpen className="mx-auto h-12 w-12 text-slate-400" />

              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                No saved visualizers yet
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
                Start bookmarking visualizers and resources to build your personalized study library.
              </p>

              <Link
                href="/visualizer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
              >
                Explore Visualizer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedResourceBookmarks.map((group) => (
                <div
                  key={group.name}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                        {group.name}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500">
                      {group.items.length} saved
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((item) => (
                      <div
                        key={item.path}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-bold">{item.name}</div>
                          <div className="mt-1 text-[11px] uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                            {item.category || "General"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={item.path}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-primary hover:text-primary focus-ring dark:border-neutral-700 dark:text-neutral-300"
                            aria-label={`Open ${item.name}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeBookmark(item.path)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:border-red-300 hover:text-red-500 focus-ring dark:border-neutral-700 dark:text-neutral-400"
                            aria-label={`Remove ${item.name} from bookmarks`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-black tracking-tight">
              Practice bookmarks
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-neutral-400">
              Saved problems stay grouped by topic so you can jump back into the
              exact learning lane quickly.
            </p>
          </div>

          {problemLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              Loading practice bookmarks...
            </div>
          ) : problemBookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400" />

              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                No practice bookmarks yet
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
                Save practice problems to quickly revisit them and continue your learning journey.
              </p>

              <Link
                href="/practice"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
              >
                Start Practicing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedProblemBookmarks.map((group) => (
                <div
                  key={group.name}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Layers3 className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                        {group.name}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500">
                      {group.items.length} saved
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((item) => {
                      const meta = item.meta;

                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-bold">
                                {meta?.name || item.id}
                              </div>
                              <div className="mt-1 text-[11px] uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                                {meta?.difficulty || "Saved problem"}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                meta && toggleBookmark(item.id, item.topicSlug)
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:border-red-300 hover:text-red-500 focus-ring dark:border-neutral-700 dark:text-neutral-400"
                              aria-label={`Remove ${meta?.name || item.id} from practice bookmarks`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {meta?.visualizerUrl && (
                              <Link
                                href={meta.visualizerUrl}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary focus-ring dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-200"
                              >
                                <BookOpen className="h-3.5 w-3.5" />
                                Visualizer
                              </Link>
                            )}
                            {meta?.practiceUrl && (
                              <a
                                href={meta.practiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary focus-ring dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-200"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Practice
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base md:text-lg font-black">
                Quick resume links
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-neutral-400">
                Use these to jump back into the flow without hunting around.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/practice"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-white transition hover:brightness-110 focus-ring"
              >
                Practice
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/visualizer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-900 transition hover:border-primary hover:text-primary focus-ring dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              >
                Visualizer
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
