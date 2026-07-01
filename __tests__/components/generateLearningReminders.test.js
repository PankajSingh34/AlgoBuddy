import { describe, expect, test } from "@jest/globals";

// Inline helpers from src/utils/generateLearningReminders.js
// to test them independently without modifying the source.
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

describe("toDayIndex", () => {
  test("returns a number for a valid ISO date string", () => {
    expect(typeof toDayIndex("2026-07-01")).toBe("number");
  });

  test("parses YYYY-MM-DD format correctly", () => {
    // 2026-01-01 should have a consistent index
    const idx = toDayIndex("2026-01-01");
    expect(toDayIndex("2026-01-02")).toBe(idx + 1);
    expect(toDayIndex("2026-01-31")).toBe(idx + 30);
  });

  test("same date returns same index", () => {
    expect(toDayIndex("2026-06-15")).toBe(toDayIndex("2026-06-15"));
  });

  test("handles Date object input", () => {
    const d = new Date("2026-06-15T12:00:00Z");
    expect(typeof toDayIndex(d)).toBe("number");
  });

  test("negative or invalid input returns a number (does not throw)", () => {
    expect(typeof toDayIndex(null)).toBe("number");
    expect(typeof toDayIndex(undefined)).toBe("number");
    expect(typeof toDayIndex("not-a-date")).toBe("number");
  });
});

describe("daysBetween", () => {
  test("returns 0 for same date", () => {
    expect(daysBetween("2026-06-15", "2026-06-15")).toBe(0);
  });

  test("returns positive for later date", () => {
    expect(daysBetween("2026-06-15", "2026-06-20")).toBe(5);
  });

  test("returns negative for earlier date", () => {
    expect(daysBetween("2026-06-20", "2026-06-15")).toBe(-5);
  });

  test("returns 1 for consecutive days", () => {
    expect(daysBetween("2026-06-15", "2026-06-16")).toBe(1);
  });

  test("handles Date objects", () => {
    const d1 = new Date("2026-06-15T00:00:00Z");
    const d2 = new Date("2026-06-18T00:00:00Z");
    expect(daysBetween(d1, d2)).toBe(3);
  });

  test("handles mixed ISO string and Date object", () => {
    expect(daysBetween("2026-06-15", new Date("2026-06-17"))).toBe(2);
  });
});
