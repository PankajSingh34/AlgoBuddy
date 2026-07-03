// __tests__/activity-computeStreak.test.js
//
// Run with: npx jest __tests__/activity-computeStreak.test.js --colors=false
//
// Tests the computeStreak helper exported from src/lib/activity.js.

const computeStreak = (activities) => {
  if (!activities || activities.length === 0) return 0;

  const dates = activities
    .filter(Boolean)
    .map((a) => {
      const d = new Date(a.activity_date || a.created_at);
      return d.toISOString().split("T")[0];
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a));

  if (dates.length === 0) return 0;

  const uniqueDates = [...new Set(dates)];
  let streak = 1;
  const today = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();
  const yesterdayStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  // Only count streak if most recent activity is today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterdayStr) return 0;

  for (let i = 1; i < uniqueDates.length; i++) {
    const curr = new Date(uniqueDates[i - 1]);
    const prev = new Date(uniqueDates[i]);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

function isoDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayIso() { return isoDate(0); }
function yesterdayIso() { return isoDate(-1); }

describe("computeStreak", () => {
  describe("empty and null inputs", () => {
    test("null returns 0", () => {
      expect(computeStreak(null)).toBe(0);
    });

    test("undefined returns 0", () => {
      expect(computeStreak(undefined)).toBe(0);
    });

    test("empty array returns 0", () => {
      expect(computeStreak([])).toBe(0);
    });

    test("array of nulls returns 0", () => {
      expect(computeStreak([null, null])).toBe(0);
    });
  });

  describe("single activity", () => {
    test("activity today returns 1", () => {
      const result = computeStreak([{ activity_date: todayIso() }]);
      expect(result).toBe(1);
    });

    test("activity yesterday returns 1", () => {
      const result = computeStreak([{ activity_date: yesterdayIso() }]);
      expect(result).toBe(1);
    });

    test("activity 2 days ago returns 0 (streak broken)", () => {
      const result = computeStreak([{ activity_date: isoDate(-2) }]);
      expect(result).toBe(0);
    });

    test("activity with created_at field (today) returns 1", () => {
      const today = new Date();
      const result = computeStreak([{ created_at: today.toISOString() }]);
      expect(result).toBe(1);
    });
  });

  describe("consecutive streak counting", () => {
    test("today and yesterday returns streak of 2", () => {
      const result = computeStreak([
        { activity_date: todayIso() },
        { activity_date: yesterdayIso() },
      ]);
      expect(result).toBe(2);
    });

    test("3 consecutive days returns streak of 3", () => {
      const result = computeStreak([
        { activity_date: todayIso() },
        { activity_date: yesterdayIso() },
        { activity_date: isoDate(-2) },
      ]);
      expect(result).toBe(3);
    });

    test("5 consecutive days returns streak of 5", () => {
      const activities = [-4, -3, -2, -1, 0].map((offset) => ({
        activity_date: isoDate(offset),
      }));
      const result = computeStreak(activities);
      expect(result).toBe(5);
    });
  });

  describe("streak breaks on gap", () => {
    test("today and 2 days ago (gap of 1 day) breaks streak at 1", () => {
      const result = computeStreak([
        { activity_date: todayIso() },
        { activity_date: isoDate(-2) },
      ]);
      // diff=2, not 1, so loop breaks immediately; streak stays 1
      expect(result).toBe(1);
    });

    test("yesterday and 3 days ago (gap of 1 day) breaks streak at 1", () => {
      const result = computeStreak([
        { activity_date: yesterdayIso() },
        { activity_date: isoDate(-3) },
      ]);
      expect(result).toBe(1);
    });

    test("gap of 3 days resets streak", () => {
      const result = computeStreak([
        { activity_date: todayIso() },
        { activity_date: yesterdayIso() },
        { activity_date: isoDate(-4) }, // gap of 3 days from yesterday
      ]);
      expect(result).toBe(2);
    });
  });

  describe("most recent activity boundary", () => {
    test("most recent is 3 days ago returns 0", () => {
      const result = computeStreak([{ activity_date: isoDate(-3) }]);
      expect(result).toBe(0);
    });

    test("most recent is 7 days ago returns 0", () => {
      const result = computeStreak([{ activity_date: isoDate(-7) }]);
      expect(result).toBe(0);
    });

    test("yesterday is most recent with older activities: streak counts from yesterday", () => {
      const result = computeStreak([
        { activity_date: yesterdayIso() },
        { activity_date: isoDate(-2) },
        { activity_date: isoDate(-3) },
      ]);
      expect(result).toBe(3);
    });
  });

  describe("deduplication", () => {
    test("multiple activities on same day count as one", () => {
      const today = todayIso();
      const activities = [
        { activity_date: today },
        { activity_date: today },
        { activity_date: today },
        { activity_date: yesterdayIso() },
      ];
      const result = computeStreak(activities);
      expect(result).toBe(2);
    });

    test("duplicate dates across different objects are deduplicated", () => {
      const t = todayIso();
      const y = yesterdayIso();
      const result = computeStreak([
        { activity_date: t },
        { activity_date: y },
        { activity_date: t },
        { activity_date: y },
      ]);
      expect(result).toBe(2);
    });
  });

  describe("sorting and order independence", () => {
    test("activities in random order are sorted correctly", () => {
      const result = computeStreak([
        { activity_date: isoDate(-2) },
        { activity_date: todayIso() },
        { activity_date: isoDate(-3) },
        { activity_date: yesterdayIso() },
        { activity_date: isoDate(-4) },
      ]);
      expect(result).toBe(5);
    });

    test("activities already in descending order work correctly", () => {
      const result = computeStreak([
        { activity_date: todayIso() },
        { activity_date: yesterdayIso() },
        { activity_date: isoDate(-2) },
      ]);
      expect(result).toBe(3);
    });

    test("activities in ascending order work correctly", () => {
      const result = computeStreak([
        { activity_date: isoDate(-2) },
        { activity_date: yesterdayIso() },
        { activity_date: todayIso() },
      ]);
      expect(result).toBe(3);
    });
  });
});
