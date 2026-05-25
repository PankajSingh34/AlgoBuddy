"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FiX, FiCheckCircle, FiBarChart2 } from "react-icons/fi";

const ExecutionSummaryCard = ({ title, metrics, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950/50">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {title || "Execution Complete"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800"
            aria-label="Close summary"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Metrics */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <FiBarChart2 className="w-4 h-4" />
            <span>Execution Stats</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-100 dark:border-neutral-800 flex flex-col justify-center items-center text-center"
              >
                <div className="text-2xl font-black text-primary dark:text-purple-400 mb-1">
                  {metric.value}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Continue Exploring
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExecutionSummaryCard;
