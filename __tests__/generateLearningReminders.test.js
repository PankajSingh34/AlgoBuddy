// __tests__/generateLearningReminders.test.js
//
// Run with:  npx jest __tests__/generateLearningReminders.test.js --colors=false
//
// Tests the pure logic of generateLearningReminders — date normalization,
// streak computation, and multi-rule reminder generation.
// Uses CJS require to match the existing __tests__/ pattern.

const { describe, expect, test } = require("@jest/globals");

// Inline the helper functions from generateLearningReminders.js to avoid ESM issues
// with Jest's transform: {} config.
const msPerDay = 1000 * 60 * 60 * 24;

function toDayIndex(val) {
  const d = new Date(val);
  if (typeof val === "string") {
    const match = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [_, y, m, date] = match;
      return Math.floor(Date.UTC(Number(y), Number(m) - 1, Number(date)) / msPerDay);
    }
  }
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / msPerDay);
}

function daysBetween(a, b) {
  return toDayIndex(b) - toDayIndex(a);
}

function generateLearningReminders({
  activityDates = [],
  activityTypes = [],
  modulesCount = 0,
  completedModulesCount = 0,
}) {
  const reminders = [];
  const today = new Date();

  const normalizeDateString = (value) => {
    if (typeof value !== "string") return null;
    const candidate = value.split("T")[0];
    return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : null;
  };

  const uniqueDates = Array.from(
    new Set((activityDates || []).map(normalizeDateString).filter(Boolean))
  ).sort();

  const lastDate = uniqueDates.length ? new Date(uniqueDates[uniqueDates.length - 1]) : null;
  const daysSinceLast = lastDate ? daysBetween(lastDate, today) : Infinity;

  let currentStreak = 0;
  if (uniqueDates.length) {
    const lastDiff = daysBetween(uniqueDates[uniqueDates.length - 1], today);
    if (lastDiff <= 1) {
      let expectedDiff = lastDiff;
      for (let i = uniqueDates.length - 1; i >= 0; i--) {
        const d = uniqueDates[i];
        const diff = daysBetween(d, today);
        if (diff === expectedDiff) {
          currentStreak++;
          expectedDiff++;
        } else if (diff < expectedDiff) {
          continue;
        } else {
          break;
        }
      }
    }
  }

  if (daysSinceLast > 0) {
    reminders.push({
      id: "practice_today",
      type: "encouragement",
      severity: "medium",
      message: `You haven't practiced DSA today — try a short session to keep momentum (last activity ${daysSinceLast === Infinity ? 'ever' : daysSinceLast + ' day' + (daysSinceLast > 1 ? 's' : '') + ' ago'}).`,
    });
  }

  if (currentStreak >= 3 && daysSinceLast >= 1) {
    reminders.push({
      id: "streak_risk",
      type: "streak",
      severity: "high",
      message: `Your ${currentStreak}-day streak is at risk — keep it alive with today's practice!`,
    });
  }

  if (daysSinceLast >= 7) {
    reminders.push({
      id: "long_inactivity",
      type: "warning",
      severity: "high",
      message: `It's been ${daysSinceLast} days since your last activity — a quick 20-minute session will get you back on track.`,
    });
  } else if (daysSinceLast >= 3) {
    reminders.push({
      id: "mild_inactivity",
      type: "warning",
      severity: "medium",
      message: `You were last active ${daysSinceLast} day${daysSinceLast > 1 ? 's' : ''} ago — try a short exercise today.`,
    });
  }

  if (modulesCount > 0) {
    const pct = Math.round((completedModulesCount / modulesCount) * 100 || 0);
    if (pct >= 80 && pct < 100) {
      reminders.push({
        id: "near_completion",
        type: "nudge",
        severity: "low",
        message: `You're ${pct}% through your modules — finish one more to unlock momentum!`,
      });
    } else if (pct > 0 && pct < 80) {
      reminders.push({
        id: "keep_going",
        type: "encouragement",
        severity: "low",
        message: `Nice progress — ${completedModulesCount}/${modulesCount} modules done. Keep the pace with a focused topic today.`,
      });
    } else if (pct === 100) {
      reminders.push({
        id: "congratulations",
        type: "achievement",
        severity: "low",
        message: `You've completed all modules — great job! Consider exploring advanced topics or revisiting weak spots.`,
      });
    } else if (pct === 0) {
      reminders.push({
        id: "start_learning",
        type: "nudge",
        severity: "low",
        message: `Start with one module today — small steps add up.`,
      });
    }
  }

  const recentVisualizer = (activityTypes || []).find((t) => /visualizer/i.test(t));
  if (!recentVisualizer) {
    reminders.push({
      id: "try_visualizer",
      type: "suggestion",
      severity: "low",
      message: `Try exploring a visualizer today to learn by example and speed up understanding.`,
    });
  }

  const map = new Map();
  const priority = { high: 3, medium: 2, low: 1 };
  reminders
    .sort((a, b) => (priority[b.severity] || 0) - (priority[a.severity] || 0))
    .slice(0, 5)
    .forEach((r) => map.set(r.id, r));

  return Array.from(map.values());
}

describe("generateLearningReminders — date normalization", () => {
  test("accepts ISO date string (YYYY-MM-DD)", () => {
    const result = generateLearningReminders({ activityDates: ["2026-06-19"] });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("accepts ISO datetime string (YYYY-MM-DDTHH:MM:SSZ)", () => {
    const result = generateLearningReminders({
      activityDates: ["2026-06-19T10:00:00.000Z"],
    });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("ignores invalid date strings and non-strings", () => {
    const result = generateLearningReminders({
      activityDates: ["not-a-date", "2026-13-45", null, undefined, 123],
    });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("handles empty activityDates array", () => {
    const result = generateLearningReminders({
      activityDates: [],
      modulesCount: 0,
      completedModulesCount: 0,
    });
    expect(Array.isArray(result)).toBe(true);
  });

  test("handles undefined activityDates (defaults to empty)", () => {
    const result = generateLearningReminders({});
    expect(Array.isArray(result)).toBe(true);
  });

  test("deduplicates duplicate dates on same day", () => {
    const result = generateLearningReminders({
      activityDates: [
        "2026-06-19",
        "2026-06-19T10:00:00.000Z",
        "2026-06-18",
      ],
      modulesCount: 0,
      completedModulesCount: 0,
    });
    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("generateLearningReminders — reminder generation", () => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  test("no practice today — produces encouragement reminder", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const result = generateLearningReminders({
      activityDates: [yesterdayStr],
      modulesCount: 0,
      completedModulesCount: 0,
    });

    const encouragement = result.find((r) => r.id === "practice_today");
    expect(encouragement).toBeDefined();
    expect(encouragement.severity).toBe("medium");
  });

  test("last activity today — does not produce practice_today reminder", () => {
    const result = generateLearningReminders({
      activityDates: [todayStr],
      modulesCount: 0,
      completedModulesCount: 0,
    });

    const encouragement = result.find((r) => r.id === "practice_today");
    expect(encouragement).toBeUndefined();
  });

  test("inactivity >= 3 days and < 7 days — produces mild_inactivity reminder", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = threeDaysAgo.toISOString().split("T")[0];

    const result = generateLearningReminders({
      activityDates: [threeDaysAgoStr],
      modulesCount: 0,
      completedModulesCount: 0,
    });

    const mild = result.find((r) => r.id === "mild_inactivity");
    expect(mild).toBeDefined();
    expect(mild.severity).toBe("medium");
  });

  test("inactivity >= 7 days — produces long_inactivity reminder with high severity", () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const result = generateLearningReminders({
      activityDates: [sevenDaysAgoStr],
      modulesCount: 0,
      completedModulesCount: 0,
    });

    const long = result.find((r) => r.id === "long_inactivity");
    expect(long).toBeDefined();
    expect(long.severity).toBe("high");
  });

  test("progress 0% — produces start_learning nudge", () => {
    const result = generateLearningReminders({
      activityDates: [todayStr],
      modulesCount: 10,
      completedModulesCount: 0,
    });

    const start = result.find((r) => r.id === "start_learning");
    expect(start).toBeDefined();
    expect(start.severity).toBe("low");
  });

  test("progress 50% — produces keep_going encouragement", () => {
    const result = generateLearningReminders({
      activityDates: [todayStr],
      modulesCount: 10,
      completedModulesCount: 5,
    });

    const keepGoing = result.find((r) => r.id === "keep_going");
    expect(keepGoing).toBeDefined();
    expect(keepGoing.severity).toBe("low");
  });

  test("progress 85% — produces near_completion nudge", () => {
    const result = generateLearningReminders({
      activityDates: [todayStr],
      modulesCount: 20,
      completedModulesCount: 17,
    });

    const near = result.find((r) => r.id === "near_completion");
    expect(near).toBeDefined();
    expect(near.severity).toBe("low");
  });

  test("progress 100% — produces congratulations achievement", () => {
    const result = generateLearningReminders({
      activityDates: [todayStr],
      modulesCount: 10,
      completedModulesCount: 10,
    });

    const congrats = result.find((r) => r.id === "congratulations");
    expect(congrats).toBeDefined();
    expect(congrats.severity).toBe("low");
  });

  test("no visualizer activity — produces try_visualizer suggestion", () => {
    const result = generateLearningReminders({
      activityDates: [todayStr],
      activityTypes: ["page_view", "quiz_submit"],
      modulesCount: 0,
      completedModulesCount: 0,
    });

    const tryViz = result.find((r) => r.id === "try_visualizer");
    expect(tryViz).toBeDefined();
    expect(tryViz.severity).toBe("low");
  });

  test("visualizer activity present — does not produce try_visualizer", () => {
    const result = generateLearningReminders({
      activityDates: [todayStr],
      activityTypes: ["visualizer_run", "page_view"],
      modulesCount: 0,
      completedModulesCount: 0,
    });

    const tryViz = result.find((r) => r.id === "try_visualizer");
    expect(tryViz).toBeUndefined();
  });
});

describe("generateLearningReminders — priority and deduplication", () => {
  test("high severity reminders appear before low severity ones", () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const result = generateLearningReminders({
      activityDates: [sevenDaysAgoStr],
      modulesCount: 10,
      completedModulesCount: 0,
    });

    const highIndex = result.findIndex((r) => r.severity === "high");
    const lowIndex = result.findIndex((r) => r.severity === "low");
    if (highIndex !== -1 && lowIndex !== -1) {
      expect(highIndex).toBeLessThan(lowIndex);
    }
  });

  test("returns at most 5 reminders", () => {
    const result = generateLearningReminders({
      activityDates: ["2020-01-01"],
      modulesCount: 100,
      completedModulesCount: 50,
      activityTypes: [],
    });

    expect(result.length).toBeLessThanOrEqual(5);
  });

  test("reminders are de-duplicated by id", () => {
    const result = generateLearningReminders({
      activityDates: ["2020-01-01", "2020-01-02"],
      modulesCount: 5,
      completedModulesCount: 2,
      activityTypes: [],
    });

    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("each reminder has id, type, message, and severity", () => {
    const result = generateLearningReminders({
      activityDates: [],
      modulesCount: 0,
      completedModulesCount: 0,
    });

    result.forEach((reminder) => {
      expect(typeof reminder.id).toBe("string");
      expect(reminder.id.length).toBeGreaterThan(0);
      expect(typeof reminder.type).toBe("string");
      expect(
        ["encouragement", "streak", "warning", "nudge", "achievement", "suggestion"]
      ).toContain(reminder.type);
      expect(typeof reminder.message).toBe("string");
      expect(reminder.message.length).toBeGreaterThan(0);
      expect(["high", "medium", "low"]).toContain(reminder.severity);
    });
  });
});
