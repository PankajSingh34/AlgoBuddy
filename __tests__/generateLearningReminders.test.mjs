import { afterEach, describe, expect, jest, test } from "@jest/globals";
import generateLearningReminders from "../src/utils/generateLearningReminders.js";

const fixedNow = new Date("2026-06-19T12:00:00Z");

function ids(reminders) {
  return reminders.map((reminder) => reminder.id);
}

describe("generateLearningReminders", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("handles empty activity and module inputs", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    const reminders = generateLearningReminders({});

    expect(ids(reminders)).toContain("practice_today");
    expect(ids(reminders)).toContain("long_inactivity");
    expect(ids(reminders)).toContain("try_visualizer");
  });

  test("does not create a practice_today reminder when activity happened today", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    const reminders = generateLearningReminders({
      activityDates: ["2026-06-19"],
    });

    expect(ids(reminders)).not.toContain("practice_today");
  });

  test("keeps yesterday activity eligible for a live streak", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    const reminders = generateLearningReminders({
      activityDates: ["2026-06-18", "2026-06-17", "2026-06-16"],
    });

    expect(ids(reminders)).toContain("practice_today");
    expect(ids(reminders)).toContain("streak_risk");
  });

  test("adds inactivity reminders at mild and long thresholds", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(
      ids(generateLearningReminders({ activityDates: ["2026-06-16"] })),
    ).toContain("mild_inactivity");

    expect(
      ids(generateLearningReminders({ activityDates: ["2026-06-12"] })),
    ).toContain("long_inactivity");
  });

  test("adds module progress reminders for each progress band", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(
      ids(generateLearningReminders({ modulesCount: 10, completedModulesCount: 9 })),
    ).toContain("near_completion");

    expect(
      ids(generateLearningReminders({ modulesCount: 10, completedModulesCount: 4 })),
    ).toContain("keep_going");

    expect(
      ids(generateLearningReminders({ modulesCount: 10, completedModulesCount: 10 })),
    ).toContain("congratulations");

    expect(
      ids(generateLearningReminders({ modulesCount: 10, completedModulesCount: 0 })),
    ).toContain("start_learning");
  });

  test("deduplicates reminder ids and limits output to five reminders", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    const reminders = generateLearningReminders({
      activityDates: ["2026-06-18", "2026-06-17", "2026-06-16"],
      modulesCount: 10,
      completedModulesCount: 9,
    });

    expect(reminders.length).toBeLessThanOrEqual(5);
    expect(new Set(ids(reminders)).size).toBe(reminders.length);
  });
});
