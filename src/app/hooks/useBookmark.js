"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "algobuddy_bookmarks";

export function useBookmark() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {}
  }, []);

  const addBookmark = (item) => {
    setBookmarks((prev) => {
      if (prev.find((i) => i.path === item.path)) return prev;
      const updated = [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookmark = (path) => {
    setBookmarks((prev) => {
      const updated = prev.filter((i) => i.path !== path);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (path) =>
    bookmarks.some((i) => i.path === path);

  const clearBookmarks = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBookmarks([]);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks };
}