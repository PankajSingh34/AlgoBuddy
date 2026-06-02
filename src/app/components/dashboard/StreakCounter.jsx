import React, { useMemo } from "react";
import { Award } from "lucide-react";

function StreakCounter({ activityDates }) {
  const { currentStreak, highestStreak } = useMemo(() => {
    if (!activityDates || activityDates.length === 0) {
      return { currentStreak: 0, highestStreak: 0 };
    }

    const normalizeDateString = (value) => {
      if (typeof value !== "string") return null;
      const candidate = value.split("T")[0];
      return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : null;
    };

    const msPerDay = 1000 * 60 * 60 * 24;
    const toDayIndex = (ymd) => {
      const [year, month, day] = ymd.split("-").map(Number);
      return Math.floor(Date.UTC(year, month - 1, day) / msPerDay);
    };

    const getLocalISODate = () => {
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      return local.toISOString().split("T")[0];
    };

    const uniqueSortedDates = [
      ...new Set(activityDates.map(normalizeDateString).filter(Boolean)),
    ].sort();

    let highest = 1;
    let tempStreak = 1;
    for (let i = 1; i < uniqueSortedDates.length; i++) {
      const diff =
        toDayIndex(uniqueSortedDates[i]) - toDayIndex(uniqueSortedDates[i - 1]);
      if (diff === 1) tempStreak++;
      else tempStreak = 1;
      if (tempStreak > highest) highest = tempStreak;
    }

    let streakCount = 0;
    let expectedDay = toDayIndex(getLocalISODate());
    if (uniqueSortedDates.length > 0) {
      const lastDayIndex = toDayIndex(uniqueSortedDates[uniqueSortedDates.length - 1]);
      if (lastDayIndex === expectedDay - 1) {
        expectedDay = expectedDay - 1;
      }
    }
    for (let i = uniqueSortedDates.length - 1; i >= 0; i--) {
      const dayIndex = toDayIndex(uniqueSortedDates[i]);
      if (dayIndex > expectedDay) {
        continue;
      }
      if (dayIndex === expectedDay) {
        streakCount++;
        expectedDay -= 1;
      } else break;
    }

    return { currentStreak: streakCount, highestStreak: highest };
  }, [activityDates]);

  return (
    <main className="md:p-12 p-4">
      <div className="flex flex-col items-center space-y-2">
        {/* Circle with fire icon and current streak */}
        <div className="w-24 h-24 rounded-full border-4 border-orange-500 flex flex-col items-center justify-center shadow-lg relative">
          <span className="text-3xl">
            <img src="/assets/fire.svg" className="w-10 h-10" alt="fire" />
          </span>
          <span className="text-xl font-bold text-surface-800 dark:text-surface-200">
            {currentStreak}
          </span>
        </div>

        {/* Highest streak label */}
        <div className="text-sm text-surface-600 dark:text-surface-300 flex items-center gap-1">
          <Award size={24} color="#ff9300" />Highest: {highestStreak} day{highestStreak !== 1 ? "s" : ""}
        </div>
      </div>
    </main>
  );
}

export default StreakCounter;
