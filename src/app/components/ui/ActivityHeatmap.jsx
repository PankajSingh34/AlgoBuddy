"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ActivityHeatmap Component
 * 
 * Renders a 365-day contribution heatmap similar to GitHub or LeetCode.
 * Includes interactive Framer Motion tooltips and customizable intensity scaling.
 */
export default function ActivityHeatmap({ data, currentStreak = 0, longestStreak = 0 }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 52 weeks (364 days) of data if none provided
  const activityData = useMemo(() => {
    if (data && data.length > 0) return data;
    
    // Fallback: Generate realistic looking random data for the last 364 days
    const generated = [];
    const today = new Date();
    
    for (let i = 363; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate recent streak if applicable
      let count = 0;
      if (i < currentStreak) {
        count = Math.floor(Math.random() * 8) + 1; // 1-8 problems
      } else {
        // Random chance of activity on other days
        if (Math.random() > 0.6) {
          count = Math.floor(Math.random() * 10) + 1;
        }
      }
      
      generated.push({
        date: date.toISOString().split('T')[0],
        count,
        displayDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
      });
    }
    return generated;
  }, [data, currentStreak]);

  // Transform flat array into 52 columns of 7 days
  const columns = useMemo(() => {
    const cols = [];
    let currentColumn = [];
    
    activityData.forEach((day, index) => {
      currentColumn.push(day);
      if (currentColumn.length === 7 || index === activityData.length - 1) {
        cols.push(currentColumn);
        currentColumn = [];
      }
    });
    
    return cols;
  }, [activityData]);

  const getIntensityClass = (count) => {
    if (count === 0) return "bg-slate-100 dark:bg-neutral-800/80";
    if (count <= 2) return "bg-[#a435f0]/30 shadow-[0_0_8px_rgba(164,53,240,0.15)]";
    if (count <= 5) return "bg-[#a435f0]/60 shadow-[0_0_8px_rgba(164,53,240,0.25)]";
    if (count <= 8) return "bg-[#a435f0]/80 shadow-[0_0_8px_rgba(164,53,240,0.4)]";
    return "bg-[#a435f0] shadow-[0_0_12px_rgba(164,53,240,0.6)]";
  };

  return (
    <div className="w-full relative select-none">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-neutral-200 uppercase tracking-widest mb-1">Total Solved</h4>
          <div className="text-3xl font-black text-slate-800 dark:text-white">
            {activityData.reduce((acc, curr) => acc + curr.count, 0)} <span className="text-sm font-semibold text-slate-500 dark:text-neutral-400">in the last year</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="flex gap-2 relative">
        {/* Day Labels */}
        <div className="flex flex-col gap-[6px] mt-6 text-[10px] font-semibold text-slate-400 pr-2">
          <span className="h-[14px]">Mon</span>
          <span className="h-[14px]"></span>
          <span className="h-[14px]">Wed</span>
          <span className="h-[14px]"></span>
          <span className="h-[14px]">Fri</span>
          <span className="h-[14px]"></span>
        </div>

        {/* The Grid */}
        <div className="flex gap-[6px] overflow-x-auto no-scrollbar pb-4" onMouseLeave={() => setHoveredDay(null)}>
          {columns.map((col, colIndex) => {
            // Only show month label for the first column of a month
            const firstDay = new Date(col[0].date);
            const showMonth = firstDay.getDate() <= 7;
            
            return (
              <div key={`col-${colIndex}`} className="flex flex-col gap-[6px] min-w-max relative">
                <div className="h-5 text-[10px] font-semibold text-slate-400">
                  {showMonth ? firstDay.toLocaleDateString('en-US', { month: 'short' }) : ''}
                </div>
                {col.map((day, dayIndex) => (
                  <div 
                    key={day.date}
                    onMouseEnter={() => setHoveredDay({ ...day, colIndex, dayIndex })}
                    className={`w-[14px] h-[14px] rounded-sm transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-[#a435f0]/50 hover:scale-125 z-10 ${getIntensityClass(day.count)}`}
                  />
                ))}
              </div>
            );
          })}

          {/* Floating Tooltip */}
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute z-50 pointer-events-none"
                style={{ 
                  // Calculate rough absolute position based on colIndex and dayIndex (plus padding/gap)
                  left: `calc(${hoveredDay.colIndex * 20}px + 45px)`, 
                  top: `calc(${hoveredDay.dayIndex * 20}px - 15px)`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div className="bg-slate-900/95 backdrop-blur text-white px-3 py-2 rounded-xl text-xs font-medium shadow-2xl border border-slate-700/50 whitespace-nowrap flex flex-col items-center">
                  <span className="text-[#a435f0] font-black">{hoveredDay.count} {hoveredDay.count === 1 ? 'submission' : 'submissions'}</span>
                  <span className="text-slate-400 text-[10px] mt-0.5">{hoveredDay.displayDate}</span>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[6px] border-transparent border-t-slate-900/95"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 justify-end text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-[14px] h-[14px] rounded-sm bg-slate-100 dark:bg-neutral-800/80"></div>
          <div className="w-[14px] h-[14px] rounded-sm bg-[#a435f0]/30"></div>
          <div className="w-[14px] h-[14px] rounded-sm bg-[#a435f0]/60"></div>
          <div className="w-[14px] h-[14px] rounded-sm bg-[#a435f0]/80"></div>
          <div className="w-[14px] h-[14px] rounded-sm bg-[#a435f0]"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
