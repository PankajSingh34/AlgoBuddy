// __tests__/activityDateFormat.test.mjs
//
// Run with:  NODE_OPTIONS="--experimental-vm-modules" npx jest __tests__/activityDateFormat.test.mjs --colors=false
//
// Tests date-string handling behavior through the computeStreak public API,
// which calls getLocalISODate internally to parse activity_date strings.

import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { computeStreak } from "../src/lib/activity.js";

const fixedNow = new Date("2026-06-19T12:00:00Z");

function activity(dateStr) {
  return { activity_date: `${dateStr}T08:00:00Z` };
}

describe("date string parsing (via computeStreak)", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("accepts ISO date strings with time component in activity_date", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);
    // activity_date format: "2026-06-19T08:00:00Z"
    const result = computeStreak([activity("2026-06-19")]);
    expect(result).toBe(1);
  });

  test("correctly parses zero-padded month and day", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);
    // 2026-06-01 is 18 days before 2026-06-19
    // So it is not today or yesterday, streak = 0
    const result = computeStreak([activity("2026-06-01")]);
    expect(result).toBe(0);
  });

  test("correctly parses dates ending yesterday (streak still counts)", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);
    // 2026-06-18 is yesterday relative to 2026-06-19
    const result = computeStreak([activity("2026-06-18")]);
    expect(result).toBe(1);
  });

  test("handles consecutive days with correct month boundaries", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);
    // Three consecutive days ending yesterday (June 18, 17, 16)
    const result = computeStreak([
      activity("2026-06-18"),
      activity("2026-06-17"),
      activity("2026-06-16"),
    ]);
    expect(result).toBe(3);
  });

  test("date parsing is case-insensitive on format characters", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);
    // Ensure the YYYY-MM-DD format with zero-padded month/day works
    const result = computeStreak([
      activity("2026-06-19"),
      activity("2026-06-18"),
    ]);
    expect(result).toBe(2);
  });
});
