"use client";
import React from "react";
import generateLearningReminders from "@/utils/generateLearningReminders";

export default function MotivationalReminders({ activityDates = [], activityTypes = [], modulesCount = 0, completedModulesCount = 0 }) {
  const reminders = generateLearningReminders({ activityDates, activityTypes, modulesCount, completedModulesCount });

  if (!reminders || reminders.length === 0) {
    return null;
  }

  return (
    <div className="card-surface p-4 w-full md:w-80">
      <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-3">Learning Reminders</h3>
      <div className="flex flex-col gap-3">
        {reminders.map((r) => (
          <div key={r.id} className={`p-3 rounded-md border ${r.severity === 'high' ? 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : r.severity === 'medium' ? 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10' : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900'}`}>
            <p className="text-sm text-surface-700 dark:text-surface-200">{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
