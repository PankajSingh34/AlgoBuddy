"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/app/contexts/UserContext";

const STORAGE_KEY = "algobuddy_recently_viewed";
const HISTORY_LIMIT = 15;

export function useRecentlyViewed() {
  const { user } = useUser();
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial recently viewed problems on mount/user change
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      setLoading(true);

      // 1. Load from localStorage first (for speed / guest fallback)
      let localItems = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          localItems = JSON.parse(stored);
          setRecentlyViewed(localItems);
        }
      } catch (e) {
        console.error("Failed to parse local recently viewed problems:", e);
      }

      // 2. If user is logged in, sync with Supabase
      if (user) {
        try {
          const { data, error } = await supabase
            .from("recently_viewed")
            .select("*")
            .eq("user_id", user.id)
            .order("viewed_at", { ascending: false })
            .limit(HISTORY_LIMIT);

          if (error) {
            console.error("Error fetching recently viewed from Supabase:", error);
          } else if (data) {
            const dbItems = data.map((row) => ({
              id: row.problem_id,
              topicSlug: row.topic_slug,
              viewedAt: row.viewed_at,
            }));

            setRecentlyViewed(dbItems);
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dbItems));
          }
        } catch (e) {
          console.error("Supabase recently viewed fetch failed:", e);
        }
      }
      setLoading(false);
    };

    loadRecentlyViewed();
  }, [user]);

  const trackProblem = useCallback(async (problemId, topicSlug) => {
    if (!problemId || !topicSlug) return;

    const newEntry = {
      id: problemId,
      topicSlug,
      viewedAt: new Date().toISOString(),
    };

    // Update local state immediately (using functional updater to remove hook dependencies)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== problemId);
      const updated = [newEntry, ...filtered].slice(0, HISTORY_LIMIT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // If user is logged in, sync with Supabase and prune old records
    if (user) {
      try {
        const { error } = await supabase
          .from("recently_viewed")
          .upsert(
            {
              user_id: user.id,
              problem_id: problemId,
              topic_slug: topicSlug,
              viewed_at: newEntry.viewedAt,
            },
            { onConflict: ["user_id", "problem_id"] }
          );

        if (error) {
          console.error("Failed to save recently viewed to Supabase:", error);
          return;
        }

        // Cleanup: remove entries beyond the limit from the DB
        const { data, error: fetchErr } = await supabase
          .from("recently_viewed")
          .select("id")
          .eq("user_id", user.id)
          .order("viewed_at", { ascending: false });

        if (!fetchErr && data && data.length > HISTORY_LIMIT) {
          const excessIds = data.slice(HISTORY_LIMIT).map((row) => row.id);
          await supabase
            .from("recently_viewed")
            .delete()
            .in("id", excessIds);
        }
      } catch (e) {
        console.error("Supabase recently viewed save/prune error:", e);
      }
    }
  }, [user]);

  const clearRecentlyViewed = useCallback(async () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);

    if (user) {
      try {
        await supabase
          .from("recently_viewed")
          .delete()
          .eq("user_id", user.id);
      } catch (e) {
        console.error("Failed to clear recently viewed from Supabase:", e);
      }
    }
  }, [user]);

  return {
    recentlyViewed,
    loading,
    trackProblem,
    clearRecentlyViewed,
  };
}