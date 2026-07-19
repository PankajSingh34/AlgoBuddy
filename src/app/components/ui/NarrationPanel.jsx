"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNarration } from "./NarrationContext";

export default function NarrationPanel() {
  const { ttsEnabled, toggleTts, log, clearLog } = useNarration();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const checkScroll = () => setIsScrolled(window.scrollY > 300);
    checkScroll();
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  // Auto-scroll to the bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Optionally open the panel automatically if a log comes in and it was closed
    // but only if the user hasn't explicitly closed it. Let's keep it simple for now.
  }, [log]);

  if (log.length === 0) {
    return null; // Don't render anything if there are no logs yet
  }

  return (
    <div 
      className={`fixed bottom-[147px] sm:bottom-24 z-50 flex flex-col items-end transition-all duration-300 ${
        isScrolled ? "right-20 sm:right-24" : "right-3 sm:right-6"
      }`}
    >
      {/* Panel */}
      {isOpen && (
        <div className="w-80 h-96 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg mb-4 flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Algorithm Logs
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearLog}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                title="Clear Logs"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                title="Close Panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Logs List */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-sm text-gray-700 dark:text-gray-300"
          >
            {log.map((item, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour12: false })}
                </span>
                <span className="leading-relaxed border-l-2 border-indigo-400 pl-2">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="flex gap-2">
        <button
          onClick={toggleTts}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${
            ttsEnabled
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
          }`}
          title={ttsEnabled ? "Disable Narration (TTS)" : "Enable Narration (TTS)"}
        >
          {ttsEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9m-8.586-1.586A2 2 0 017 15V9a2 2 0 011.364-1.896l4-1.714v13.22l-4-1.714z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 active:scale-95"
          title="Toggle Logs Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
