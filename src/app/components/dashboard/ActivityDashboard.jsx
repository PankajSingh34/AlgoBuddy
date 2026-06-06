import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StreakCounter from "@/app/components/dashboard/StreakCounter";
import ActivityHeatmap from "@/app/components/dashboard/ActivityHeatmap";
import MotivationalReminders from "@/app/components/dashboard/MotivationalReminders";
import {ChartNoAxesCombined} from "lucide-react";

function ActivityDashboard({ userId }) {
  const [activityDates, setActivityDates] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modulesCount, setModulesCount] = useState(0);
  const [completedModulesCount, setCompletedModulesCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    async function fetchActivity() {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_activity")
        .select("activity_date, type")
        .eq("user_id", userId);

      if (!error && data) {
        const dates = data.map((item) => item.activity_date);
        const types = data.map((item) => item.type).filter(Boolean);
        setActivityDates(dates);
        setActivityTypes(types);
      }
      setLoading(false);
    }

    async function fetchProgressAndModules() {
      try {
        const { data: modulesData } = await supabase.from("modules").select("id");
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("module_id, is_done")
          .eq("user_id", userId);

        const total = Array.isArray(modulesData) ? modulesData.length : 0;
        const completed = Array.isArray(progressData) ? progressData.filter((p) => p.is_done).length : 0;
        setModulesCount(total);
        setCompletedModulesCount(completed);
      } catch (err) {
        console.error(err);
      }
    }

    fetchActivity();
    fetchProgressAndModules();
  }, [userId]);

  if (loading) {
    return (
      <div className="card-surface p-4 text-surface-500 dark:text-surface-400">
        Loading activity...
      </div>
    );
  }

  return (
    <main className="card-surface p-4">
      <div className="flex items-center gap-2">
        <ChartNoAxesCombined className="text-surface-700 dark:text-surface-300"/>
        <h1 className="font-poppins text-lg text-surface-800 dark:text-surface-200">Your Stats</h1>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:gap-6">
        <StreakCounter activityDates={activityDates} />
        <ActivityHeatmap activityDates={activityDates} />
        <MotivationalReminders
          activityDates={activityDates}
          activityTypes={activityTypes}
          modulesCount={modulesCount}
          completedModulesCount={completedModulesCount}
        />
      </div>
    </main>
  );
}

export default ActivityDashboard;
