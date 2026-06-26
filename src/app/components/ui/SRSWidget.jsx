"use client";
import { useState } from "react";
import { FiRefreshCw, FiCheckCircle } from "react-icons/fi";

export default function SRSWidget({ algorithmId }) {
  const [status, setStatus] = useState("idle"); // idle, loading, complete

  const handleReview = async (quality) => {
    setStatus("loading");
    // Simulate API call to /api/v1/srs/review
    // await fetch('/api/v1/srs/review', { method: 'POST', body: JSON.stringify({ algorithmId, quality }) });
    setTimeout(() => {
      setStatus("complete");
    }, 600);
  };

  if (!algorithmId) return null;

  return (
    <div className="w-full rounded-2xl border border-primary/20 bg-primary/5 p-6 dark:border-primary/30 dark:bg-primary/10 mt-8 mb-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
            <FiRefreshCw className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white">Smart Review System</h3>
            <p className="text-sm text-surface-600 dark:text-surface-300">How well do you understand this algorithm? We'll remind you to review it before you forget!</p>
          </div>
        </div>

        {status === "idle" && (
          <div className="flex gap-2">
            <button 
              onClick={() => handleReview(1)}
              className="px-4 py-2 rounded-lg font-bold text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
            >
              Hard
            </button>
            <button 
              onClick={() => handleReview(3)}
              className="px-4 py-2 rounded-lg font-bold text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
            >
              Good
            </button>
            <button 
              onClick={() => handleReview(5)}
              className="px-4 py-2 rounded-lg font-bold text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
            >
              Easy
            </button>
          </div>
        )}
        
        {status === "loading" && (
          <div className="flex items-center gap-2 text-primary font-bold">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </div>
        )}

        {status === "complete" && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
            <FiCheckCircle className="h-5 w-5" />
            Review Scheduled!
          </div>
        )}
      </div>
    </div>
  );
}
