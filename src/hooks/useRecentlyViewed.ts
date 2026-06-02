"use client";
import { useState, useEffect } from "react";

export interface RecentlyViewedItem {
  name: string;
  path: string;
  category: string;
}

const MAX_RECENT = 6;
const STORAGE_KEY = "algobuddy_recently_viewed";

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored) as RecentlyViewedItem[]);
      }
    } catch {}
  }, []);

  const addRecentlyViewed = (item: RecentlyViewedItem) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => i.path !== item.path);
      const updated = [item, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewed([]);
  };

  return { recentlyViewed, addRecentlyViewed, clearRecentlyViewed };
}
