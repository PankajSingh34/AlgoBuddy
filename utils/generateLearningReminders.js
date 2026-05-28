/**
 * Produce motivational reminders from dashboard metrics.
 * The function is intentionally data-driven and returns an array of
 * reminder objects { id, type, message, severity } derived from inputs.
 */
function daysBetween(a, b) {
  const A = new Date(a);
  const B = new Date(b);
  // clear time
  A.setHours(0, 0, 0, 0);
  B.setHours(0, 0, 0, 0);
  const diff = Math.round((B - A) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function generateLearningReminders({
  activityDates = [],
  activityTypes = [],
  modulesCount = 0,
  completedModulesCount = 0,
}) {
  const reminders = [];
  const today = new Date();
  const uniqueDates = Array.from(new Set(activityDates || [])).sort();

  const lastDate = uniqueDates.length ? new Date(uniqueDates[uniqueDates.length - 1]) : null;
  const daysSinceLast = lastDate ? daysBetween(lastDate, today) : Infinity;

  // simple current streak approximation (consecutive days ending today)
  let currentStreak = 0;
  if (uniqueDates.length) {
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const d = new Date(uniqueDates[i]);
      const diff = daysBetween(d, today) - currentStreak;
      // if date equals today - currentStreak
      if (diff === 0) {
        currentStreak++;
      } else if (diff === 1) {
        // consecutive day
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // rule: no activity today
  if (daysSinceLast > 0) {
    reminders.push({
      id: "practice_today",
      type: "encouragement",
      severity: "medium",
      message: `🚀 You haven't practiced DSA today — try a short session to keep momentum (last activity ${daysSinceLast === Infinity ? 'ever' : daysSinceLast + ' day' + (daysSinceLast>1?'s':'') + ' ago'}).`,
    });
  }

  // rule: streak at risk (if streak exists and last activity wasn't today)
  if (currentStreak >= 3 && daysSinceLast >= 1) {
    reminders.push({
      id: "streak_risk",
      type: "streak",
      severity: "high",
      message: `🔥 Your ${currentStreak}-day streak is at risk — keep it alive with today's practice!`,
    });
  }

  // rule: inactivity warning
  if (daysSinceLast >= 7) {
    reminders.push({
      id: "long_inactivity",
      type: "warning",
      severity: "high",
      message: `⏳ It's been ${daysSinceLast} days since your last activity — a quick 20‑minute session will get you back on track.`,
    });
  } else if (daysSinceLast >= 3) {
    reminders.push({
      id: "mild_inactivity",
      type: "warning",
      severity: "medium",
      message: `📌 You were last active ${daysSinceLast} day${daysSinceLast>1?'s':''} ago — try a short exercise today.`,
    });
  }

  // rule: progress nudges
  if (modulesCount > 0) {
    const pct = Math.round((completedModulesCount / modulesCount) * 100 || 0);
    if (pct >= 80 && pct < 100) {
      reminders.push({
        id: "near_completion",
        type: "nudge",
        severity: "low",
        message: `🎯 You're ${pct}% through your modules — finish one more to unlock momentum!`,
      });
    } else if (pct > 0 && pct < 80) {
      reminders.push({
        id: "keep_going",
        type: "encouragement",
        severity: "low",
        message: `🏆 Nice progress — ${completedModulesCount}/${modulesCount} modules done. Keep the pace with a focused topic today.`,
      });
    } else if (pct === 100) {
      reminders.push({
        id: "congratulations",
        type: "achievement",
        severity: "low",
        message: `🎉 You've completed all modules — great job! Consider exploring advanced topics or revisiting weak spots.`,
      });
    } else if (pct === 0) {
      reminders.push({
        id: "start_learning",
        type: "nudge",
        severity: "low",
        message: `⚡ Start with one module today — small steps add up.`,
      });
    }
  }

  // rule: recent visualizer usage — encourage variety
  const recentVisualizer = (activityTypes || []).find((t) => /visualizer/i.test(t));
  if (!recentVisualizer) {
    reminders.push({
      id: "try_visualizer",
      type: "suggestion",
      severity: "low",
      message: `⚡ Try exploring a visualizer today to learn by example and speed up understanding.`,
    });
  }

  // de-duplicate by id and return up to 5 reminders (most urgent first)
  const map = new Map();
  const priority = { high: 3, medium: 2, low: 1 };
  reminders
    .sort((a, b) => (priority[b.severity] || 0) - (priority[a.severity] || 0))
    .slice(0, 5)
    .forEach((r) => map.set(r.id, r));

  return Array.from(map.values());
}
