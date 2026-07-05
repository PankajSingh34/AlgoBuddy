const { EXECUTION_STATUS, EXECUTION_MESSAGES } = require("../src/lib/sandbox/errorCodes");

describe("EXECUTION_STATUS constants", () => {
  test("contains all required status codes", () => {
    expect(EXECUTION_STATUS.SUCCESS).toBe("SUCCESS");
    expect(EXECUTION_STATUS.TLE).toBe("TLE");
    expect(EXECUTION_STATUS.MLE).toBe("MLE");
    expect(EXECUTION_STATUS.RUNTIME_ERROR).toBe("RUNTIME_ERROR");
    expect(EXECUTION_STATUS.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
  });

  test("has exactly 5 status constants", () => {
    expect(Object.keys(EXECUTION_STATUS).length).toBe(5);
  });

  test("all status values are non-empty strings", () => {
    Object.values(EXECUTION_STATUS).forEach((v) => {
      expect(typeof v).toBe("string");
      expect(v.length).toBeGreaterThan(0);
    });
  });

  test("no duplicate values", () => {
    const values = Object.values(EXECUTION_STATUS);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("EXECUTION_MESSAGES", () => {
  test("contains a message for every status", () => {
    Object.keys(EXECUTION_STATUS).forEach((key) => {
      expect(EXECUTION_MESSAGES[EXECUTION_STATUS[key]]).toBeDefined();
    });
  });

  test("SUCCESS message is positive", () => {
    expect(EXECUTION_MESSAGES[EXECUTION_STATUS.SUCCESS]).toMatch(/success/i);
  });

  test("TLE message mentions time", () => {
    expect(EXECUTION_MESSAGES[EXECUTION_STATUS.TLE]).toMatch(/time|ms/i);
  });

  test("MLE message mentions memory", () => {
    expect(EXECUTION_MESSAGES[EXECUTION_STATUS.MLE]).toMatch(/memory|mb/i);
  });

  test("RUNTIME_ERROR message mentions runtime", () => {
    expect(EXECUTION_MESSAGES[EXECUTION_STATUS.RUNTIME_ERROR]).toMatch(/runtime/i);
  });

  test("INTERNAL_ERROR message suggests retry", () => {
    expect(EXECUTION_MESSAGES[EXECUTION_STATUS.INTERNAL_ERROR]).toMatch(/try again/i);
  });

  test("all messages are non-empty strings", () => {
    Object.values(EXECUTION_MESSAGES).forEach((m) => {
      expect(typeof m).toBe("string");
      expect(m.length).toBeGreaterThan(0);
    });
  });

  test("messages are human-readable (no raw codes)", () => {
    Object.values(EXECUTION_MESSAGES).forEach((m) => {
      expect(m).not.toMatch(/^(SUCCESS|TLE|MLE|RUNTIME_ERROR|INTERNAL_ERROR)$/);
    });
  });
});
