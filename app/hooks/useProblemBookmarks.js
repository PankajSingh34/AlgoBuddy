"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/app/contexts/UserContext";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "algobuddy_problem_bookmarks";

export function useProblemBookmarks() {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
      setLoading(true);
      
      // 1. First, always load from localStorage to populate immediately or as guest fallback
      let localBookmarks = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          localBookmarks = JSON.parse(stored);
          setBookmarks(localBookmarks);
        }
      } catch (e) {
        console.error("Failed to parse local bookmarks:", e);
      }

      // 2. If user is logged in, fetch from Supabase and sync
      if (user) {
        try {
          const { data, error } = await supabase
            .from("problem_bookmarks")
            .select("*")
            .eq("user_id", user.id);

          if (error) {
            console.error("Error fetching bookmarks from Supabase:", error);
          } else if (data) {
            // Map db records to match bookmark format
            const dbBookmarks = data.map((row) => ({
              id: row.problem_id,
              topicSlug: row.topic_slug,
              createdAt: row.created_at,
            }));
            
            setBookmarks(dbBookmarks);
            // Sync local storage with db
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dbBookmarks));
          }
        } catch (e) {
          console.error("Supabase bookmark fetch failed:", e);
        }
      }
      setLoading(false);
    };

    loadBookmarks();
  }, [user]);

  const toggleBookmark = async (problemId, topicSlug) => {
    if (!problemId || !topicSlug) return;

    const isBookmarkedCurrently = bookmarks.some((b) => b.id === problemId);

    if (isBookmarkedCurrently) {
      // Remove bookmark
      const updated = bookmarks.filter((b) => b.id !== problemId);
      setBookmarks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      if (user) {
        try {
          const { error } = await supabase
            .from("problem_bookmarks")
            .delete()
            .eq("user_id", user.id)
            .eq("problem_id", problemId);

          if (error) {
            console.error("Failed to delete bookmark from Supabase:", error);
          } else {
            toast.success("Bookmark removed.");
          }
        } catch (e) {
          console.error("Supabase bookmark delete error:", e);
        }
      } else {
        toast.success("Bookmark removed (local).");
      }
    } else {
      // Add bookmark
      const newBookmark = {
        id: problemId,
        topicSlug,
        createdAt: new Date().toISOString(),
      };
      const updated = [...bookmarks, newBookmark];
      setBookmarks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      if (user) {
        try {
          const { error } = await supabase
            .from("problem_bookmarks")
            .upsert(
              {
                user_id: user.id,
                problem_id: problemId,
                topic_slug: topicSlug,
                created_at: newBookmark.createdAt,
              },
              { onConflict: ["user_id", "problem_id"] }
            );

          if (error) {
            console.error("Failed to save bookmark to Supabase:", error);
            toast.error("Failed to sync bookmark to server.");
          } else {
            toast.success("Problem bookmarked successfully!");
          }
        } catch (e) {
          console.error("Supabase bookmark save error:", e);
          toast.error("Error syncing bookmark.");
        }
      } else {
        // For guest bookmarking, notify them that logging in will persist it on the cloud
        toast.custom((t) => (
          <div className="max-w-sm w-full bg-neutral-100 dark:bg-zinc-800 border border-[#a435f0] rounded-lg shadow-xl p-4 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                Problem bookmarked! 🔖
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                You are in guest mode. Login/Signup to sync your bookmarks across all your devices.
              </span>
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <button
                onClick={() => {
                  window.location.href = "/login";
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#a435f0] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition duration-300 shadow-md"
              >
                Login/Signup
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-200 hover:bg-neutral-350 dark:hover:bg-neutral-700 dark:bg-neutral-800 text-black dark:text-white transition duration-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        ));
      }
    }
  };

  const isBookmarked = (problemId) => {
    return bookmarks.some((b) => b.id === problemId);
  };

  return { bookmarks, loading, toggleBookmark, isBookmarked };
}
