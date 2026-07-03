// __tests__/student-jobs-pagination.test.js
//
// Run with: npx jest __tests__/student-jobs-pagination.test.js --colors=false
//
// Tests the parsePagination helper from src/app/api/student-jobs/route.js

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePagination(searchParams) {
  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);

  if (!Number.isInteger(page) || page < 1) {
    return { error: "page must be a positive integer" };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return { error: `limit must be an integer between 1 and ${MAX_LIMIT}` };
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

function makeParams(obj) {
  return new URLSearchParams(obj);
}

describe("parsePagination", () => {
  describe("valid inputs", () => {
    test("page=1, limit=20 returns correct pagination", () => {
      const result = parsePagination(makeParams({ page: "1", limit: "20" }));
      expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
    });

    test("page=3, limit=50 returns skip=100", () => {
      const result = parsePagination(makeParams({ page: "3", limit: "50" }));
      expect(result).toEqual({ page: 3, limit: 50, skip: 100 });
    });

    test("page=10, limit=25 returns skip=225", () => {
      const result = parsePagination(makeParams({ page: "10", limit: "25" }));
      expect(result).toEqual({ page: 10, limit: 25, skip: 225 });
    });

    test("default values when no params provided", () => {
      const result = parsePagination(makeParams({}));
      expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
    });

    test("string coercion: page='5' limit='10' returns valid pagination", () => {
      const result = parsePagination(makeParams({ page: "5", limit: "10" }));
      expect(result.page).toBe(5);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(40);
    });

    test("MAX_LIMIT boundary: limit=100 is accepted", () => {
      const result = parsePagination(makeParams({ limit: "100" }));
      expect(result.error).toBeUndefined();
      expect(result.limit).toBe(100);
    });

    test("page=999 returns large skip correctly", () => {
      const result = parsePagination(makeParams({ page: "999", limit: "20" }));
      expect(result.skip).toBe(19960);
    });
  });

  describe("invalid page values", () => {
    test("page=0 returns error", () => {
      const result = parsePagination(makeParams({ page: "0" }));
      expect(result.error).toBe("page must be a positive integer");
    });

    test("page=-1 returns error", () => {
      const result = parsePagination(makeParams({ page: "-1" }));
      expect(result.error).toBe("page must be a positive integer");
    });

    test("page=-100 returns error", () => {
      const result = parsePagination(makeParams({ page: "-100" }));
      expect(result.error).toBe("page must be a positive integer");
    });

    test("page='abc' returns error (NaN from Number())", () => {
      const result = parsePagination(makeParams({ page: "abc" }));
      expect(result.error).toBe("page must be a positive integer");
    });

    test("page='  1  ' (whitespace) is coerced to 1", () => {
      // "  1  " as string → Number("  1  ") = 1 (whitespace is trimmed by URLSearchParams)
      const result = parsePagination(makeParams({ page: "  1  " }));
      expect(result.error).toBeUndefined();
      expect(result.page).toBe(1);
    });

    test("page=0.5 returns error (not integer)", () => {
      const result = parsePagination(makeParams({ page: "0.5" }));
      expect(result.error).toBe("page must be a positive integer");
    });

    test("page=1.9 returns error (not integer)", () => {
      const result = parsePagination(makeParams({ page: "1.9" }));
      expect(result.error).toBe("page must be a positive integer");
    });
  });

  describe("invalid limit values", () => {
    test("limit=0 returns error", () => {
      const result = parsePagination(makeParams({ limit: "0" }));
      expect(result.error).toBe(`limit must be an integer between 1 and ${MAX_LIMIT}`);
    });

    test("limit=-1 returns error", () => {
      const result = parsePagination(makeParams({ limit: "-1" }));
      expect(result.error).toBe(`limit must be an integer between 1 and ${MAX_LIMIT}`);
    });

    test("limit=101 returns error (exceeds MAX_LIMIT)", () => {
      const result = parsePagination(makeParams({ limit: "101" }));
      expect(result.error).toBe(`limit must be an integer between 1 and ${MAX_LIMIT}`);
    });

    test("limit=200 returns error (exceeds MAX_LIMIT)", () => {
      const result = parsePagination(makeParams({ limit: "200" }));
      expect(result.error).toBe(`limit must be an integer between 1 and ${MAX_LIMIT}`);
    });

    test("limit='abc' returns error (NaN from Number())", () => {
      const result = parsePagination(makeParams({ limit: "abc" }));
      expect(result.error).toBe(`limit must be an integer between 1 and ${MAX_LIMIT}`);
    });

    test("limit=0.5 returns error (not integer)", () => {
      const result = parsePagination(makeParams({ limit: "0.5" }));
      expect(result.error).toBe(`limit must be an integer between 1 and ${MAX_LIMIT}`);
    });
  });
});
