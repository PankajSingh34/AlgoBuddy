import { describe, expect, test } from "@jest/globals";
import { generateSecureCode } from "../src/lib/random.js";

describe("generateSecureCode", () => {
  test("returns a string of default length 6", () => {
    const code = generateSecureCode();
    expect(typeof code).toBe("string");
    expect(code).toHaveLength(6);
  });

  test("returns a string of specified length", () => {
    const lengths = [1, 4, 8, 12, 20, 32];
    for (const len of lengths) {
      const code = generateSecureCode(len);
      expect(code).toHaveLength(len);
    }
  });

  test("contains only uppercase letters and digits", () => {
    for (let i = 0; i < 100; i++) {
      const code = generateSecureCode(20);
      expect(code).toMatch(/^[A-Z0-9]+$/);
    }
  });

  test("produces different values on successive calls", () => {
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateSecureCode(10));
    }
    // Extremely unlikely to have collisions in 100 draws of length 10
    expect(codes.size).toBeGreaterThan(50);
  });

  test("length 0 returns empty string", () => {
    expect(generateSecureCode(0)).toBe("");
  });
});
