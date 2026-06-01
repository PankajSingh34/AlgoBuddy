"use client";
import { useEffect } from "react";
import { useRecentlyViewed } from "@/app/hooks/useRecentlyViewed";
import { getProblemByTitle } from "@/lib/practiceData";

export default function RecentlyViewedTracker({ title }) {
  const { trackProblem } = useRecentlyViewed();

  useEffect(() => {
    if (title) {
      const problem = getProblemByTitle(title);
      if (problem) {
        trackProblem(problem.id, problem.topicSlug);
      }
    }
  }, [title, trackProblem]);

  return null;
}
