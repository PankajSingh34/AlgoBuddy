"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/features/user/UserContext";
import Link from "next/link";
import ActivityDashboard from "@/app/components/dashboard/ActivityDashboard";
import PracticeStats from "@/app/components/dashboard/PracticeStats";
import Footer from "@/app/components/footer";
import { trackActivity } from "@/lib/activity";
import { useProblemBookmarks } from "@/app/hooks/useProblemBookmarks";
import { practiceData } from "@/lib/practiceData";
import { FiBookmark } from "react-icons/fi";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({});
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const { bookmarks, loading: loadingBookmarks, toggleBookmark, isBookmarked } = useProblemBookmarks();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProblemDetails = (problemId) => {
    for (const topic of practiceData) {
      for (const sub of topic.subsections) {
        const found = sub.items.find((item) => item.id === problemId);
        if (found) {
          return {
            ...found,
            topicTitle: topic.title,
            topicSlug: topic.slug,
          };
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    fetchModules();
    trackActivity(user.id, "site_visit");
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  async function fetchModules() {
    const { data: modulesData, error: modulesError } = await supabase
      .from("modules")
      .select("*");

    if (modulesError) {
      console.error("Modules fetch error:", modulesError.message || modulesError);
      return;
    }

    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id);

    if (progressError) {
      console.error("Progress fetch error:", progressError.message || progressError);
      return;
    }

    const progressMap = {};
    progressData.forEach((item) => {
      progressMap[item.module_id] = {
        is_done: item.is_done,
        updated_at: item.updated_at
      };
    });

    setModules(modulesData);
    setProgress(progressMap);
  }

  return (
    <section className="bg-white dark:bg-neutral-900 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Dashboard</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Track your learning progress and activity.</p>
        </div>

        {user && (
          <div className="flex justify-start mb-4">
            <div className="bg-gradient-to-br from-primary to-primary-dark shadow-md rounded-full px-6 py-2">
              <span className="text-lg text-white">
              Welcome, {user.user_metadata?.name || user.email.split("@")[0]}
            </span>
            </div>
          </div>
        )}

        {user && (
          <div className="mb-8 space-y-8">
            <ActivityDashboard userId={user.id} />
            <PracticeStats />
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl text-surface-800 dark:text-surface-200 mb-4">Modules Completed</h2>
          {(() => {
            const completedModules = modules.filter((mod) => progress[mod.id]?.is_done);
            if (completedModules.length > 0) {
              const modulesToShow = showAllCompleted ? completedModules : completedModules.slice(0, 3);
              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {modulesToShow.map((mod) => (
                      <div
                        key={mod.id}
                        className="card-surface p-4 flex flex-col justify-between"
                      >
                        <div>
                          <Image
                            src={`/modules/${mod.image}`}
                            alt={mod.title}
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover rounded-md mb-2"
                          />
                          <h3 className="text-md font-semibold text-surface-800 dark:text-surface-200 py-2">{mod.title}</h3>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{mod.description}</p>
                        </div>
                        <div className="mt-2 text-right text-xs flex justify-end">
                          <div className="bg-primary/10 px-2 rounded-full py-1">
                            <p className="text-primary text-xs">Conquered: {new Date(progress[mod.id].updated_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {completedModules.length > 3 && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => setShowAllCompleted(!showAllCompleted)}
                        className="px-4 py-2 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white shadow-lg transition duration-300"
                      >
                        {showAllCompleted ? "Show Less" : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              );
            } else {
              return (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-surface-500 dark:text-surface-400 mb-4">
                    You haven't completed any modules yet.
                  </p>
                  <Link
                    href="/visualizer"
                    className="group inline-flex items-center gap-2 h-[52px] min-h-[44px] px-8 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[15px] font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-200"
                  >
                    Start Learning
                  </Link>
                </div>
              );
            }
          })()}
        </section>

        {/* Bookmarked Problems Section */}
        <section className="mb-8 border-t border-dashed border-surface-200 dark:border-neutral-800 pt-8">
          <h2 className="text-xl text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2 font-bold">
            <span>🔖 Bookmarked Problems</span>
            {mounted && bookmarks.length > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {bookmarks.length}
              </span>
            )}
          </h2>

          {loadingBookmarks ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !mounted ? null : bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-surface-200 dark:border-neutral-800 rounded-2xl p-6">
              <p className="text-surface-500 dark:text-surface-400 mb-4">
                You haven't bookmarked any problems yet.
              </p>
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-sm font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-200"
              >
                Explore Practice Sheet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bookmarks.map((bookmark) => {
                const problem = getProblemDetails(bookmark.id);
                if (!problem) return null;

                return (
                  <div
                    key={bookmark.id}
                    className="card-surface p-5 flex flex-col justify-between border border-surface-200 dark:border-neutral-800 rounded-2xl hover:shadow-md transition-shadow duration-300 relative group bg-white dark:bg-neutral-800"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          problem.difficulty === "Easy"
                            ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                            : problem.difficulty === "Medium"
                              ? "bg-yellow-50 text-yellow-750 dark:bg-yellow-950/30 dark:text-yellow-450"
                              : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}>
                          {problem.difficulty}
                        </span>
                        
                        <Link
                          href={`/practice/${problem.topicSlug}`}
                          className="text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded hover:bg-purple-200 dark:hover:bg-purple-900 transition"
                          title={`Go to ${problem.topicTitle} practice`}
                        >
                          {problem.topicTitle}
                        </Link>
                      </div>

                      <h3 className="text-md font-bold text-surface-800 dark:text-surface-200 mb-2 leading-snug">
                        {problem.name}
                      </h3>
                      
                      <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">
                        {problem.theory?.summary || "Practice topic problem sheet."}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-surface-100 dark:border-neutral-800 flex justify-between items-center gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        <span className="text-[10px] text-surface-400 dark:text-neutral-500">
                          Bookmarked: {new Date(bookmark.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => toggleBookmark(bookmark.id, problem.topicSlug)}
                          className={`p-2 rounded-lg border transition hover:scale-105 active:scale-95 duration-200 ${mounted && isBookmarked(bookmark.id)
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500 dark:bg-amber-950/20"
                            : "bg-surface-50/20 border-surface-200/50 text-surface-400 hover:text-surface-600 dark:border-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300"
                          }`}
                          type="button"
                          title={mounted && isBookmarked(bookmark.id) ? "Unbookmark problem" : "Bookmark problem"}
                        >
                          <FiBookmark
                            size={16}
                            className={mounted && isBookmarked(bookmark.id) ? "fill-amber-500 text-amber-500" : ""}
                          />
                        </button>
                      </div>
                      <Link
                        href={`/practice/${problem.topicSlug}`}
                        className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Solve →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <div>
       <Footer />
      </div>
    </section>
  );
}

