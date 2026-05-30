"use client";
import { useState, useEffect } from "react";

const MAX_RECENT = 6;
const STORAGE_KEY = "algobuddy_recently_viewed";

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch {}
  }, []);

  const addRecentlyViewed = (item) => {
    // item = { name, path, category }
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