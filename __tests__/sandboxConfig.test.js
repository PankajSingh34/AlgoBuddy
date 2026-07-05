const SANDBOX_CONFIG = require("../src/lib/sandbox/sandbox.config");

describe("SANDBOX_CONFIG", () => {
  test("exports all required config keys", () => {
    expect(SANDBOX_CONFIG).toHaveProperty("MAX_TIMEOUT_MS");
    expect(SANDBOX_CONFIG).toHaveProperty("MAX_MEMORY_MB");
    expect(SANDBOX_CONFIG).toHaveProperty("MAX_OUTPUT_LENGTH");
    expect(SANDBOX_CONFIG).toHaveProperty("RATE_LIMIT_MAX_REQUESTS");
    expect(SANDBOX_CONFIG).toHaveProperty("RATE_LIMIT_WINDOW_SEC");
  });

  test("has exactly 5 configuration properties", () => {
    expect(Object.keys(SANDBOX_CONFIG).length).toBe(5);
  });

  test("MAX_TIMEOUT_MS is a positive integer", () => {
    expect(typeof SANDBOX_CONFIG.MAX_TIMEOUT_MS).toBe("number");
    expect(Number.isInteger(SANDBOX_CONFIG.MAX_TIMEOUT_MS)).toBe(true);
    expect(SANDBOX_CONFIG.MAX_TIMEOUT_MS).toBeGreaterThan(0);
  });

  test("MAX_TIMEOUT_MS is at least 500ms", () => {
    expect(SANDBOX_CONFIG.MAX_TIMEOUT_MS).toBeGreaterThanOrEqual(500);
  });

  test("MAX_MEMORY_MB is a positive integer", () => {
    expect(typeof SANDBOX_CONFIG.MAX_MEMORY_MB).toBe("number");
    expect(Number.isInteger(SANDBOX_CONFIG.MAX_MEMORY_MB)).toBe(true);
    expect(SANDBOX_CONFIG.MAX_MEMORY_MB).toBeGreaterThan(0);
  });

  test("MAX_MEMORY_MB is reasonable (at least 16MB)", () => {
    expect(SANDBOX_CONFIG.MAX_MEMORY_MB).toBeGreaterThanOrEqual(16);
  });

  test("MAX_OUTPUT_LENGTH is a positive integer", () => {
    expect(typeof SANDBOX_CONFIG.MAX_OUTPUT_LENGTH).toBe("number");
    expect(Number.isInteger(SANDBOX_CONFIG.MAX_OUTPUT_LENGTH)).toBe(true);
    expect(SANDBOX_CONFIG.MAX_OUTPUT_LENGTH).toBeGreaterThan(0);
  });

  test("MAX_OUTPUT_LENGTH is at least 1000 chars", () => {
    expect(SANDBOX_CONFIG.MAX_OUTPUT_LENGTH).toBeGreaterThanOrEqual(1000);
  });

  test("RATE_LIMIT_MAX_REQUESTS is a positive integer", () => {
    expect(typeof SANDBOX_CONFIG.RATE_LIMIT_MAX_REQUESTS).toBe("number");
    expect(Number.isInteger(SANDBOX_CONFIG.RATE_LIMIT_MAX_REQUESTS)).toBe(true);
    expect(SANDBOX_CONFIG.RATE_LIMIT_MAX_REQUESTS).toBeGreaterThan(0);
  });

  test("RATE_LIMIT_WINDOW_SEC is a positive integer", () => {
    expect(typeof SANDBOX_CONFIG.RATE_LIMIT_WINDOW_SEC).toBe("number");
    expect(Number.isInteger(SANDBOX_CONFIG.RATE_LIMIT_WINDOW_SEC)).toBe(true);
    expect(SANDBOX_CONFIG.RATE_LIMIT_WINDOW_SEC).toBeGreaterThan(0);
  });

  test("RATE_LIMIT_WINDOW_SEC is at least 10 seconds", () => {
    expect(SANDBOX_CONFIG.RATE_LIMIT_WINDOW_SEC).toBeGreaterThanOrEqual(10);
  });

  test("all config values have expected types", () => {
    Object.values(SANDBOX_CONFIG).forEach((v) => {
      expect(typeof v).toBe("number");
    });
  });
});
