// __tests__/sandboxErrorCodes.test.mjs
//
// Run with:  NODE_OPTIONS="--experimental-vm-modules" npx jest __tests__/sandboxErrorCodes.test.mjs --colors=false
//
// Tests EXECUTION_STATUS and EXECUTION_MESSAGES in src/lib/sandbox/errorCodes.js.

import { describe, expect, test } from "@jest/globals";
import { EXECUTION_STATUS, EXECUTION_MESSAGES } from "../src/lib/sandbox/errorCodes.js";

describe("EXECUTION_STATUS", () => {
  test("has all five required status keys", () => {
    expect(EXECUTION_STATUS.SUCCESS).toBeDefined();
    expect(EXECUTION_STATUS.TLE).toBeDefined();
    expect(EXECUTION_STATUS.MLE).toBeDefined();
    expect(EXECUTION_STATUS.RUNTIME_ERROR).toBeDefined();
    expect(EXECUTION_STATUS.INTERNAL_ERROR).toBeDefined();
  });

  test("all status values are non-empty strings", () => {
    Object.entries(EXECUTION_STATUS).forEach(([key, value]) => {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    });
  });

  test("all status values are unique", () => {
    const values = Object.values(EXECUTION_STATUS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});

describe("EXECUTION_MESSAGES", () => {
  test("has a message for every EXECUTION_STATUS value", () => {
    Object.values(EXECUTION_STATUS).forEach((status) => {
      expect(EXECUTION_MESSAGES[status]).toBeDefined();
    });
  });

  test("all messages are non-empty strings", () => {
    Object.values(EXECUTION_MESSAGES).forEach((msg) => {
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(0);
    });
  });
});

describe("EXECUTION_STATUS and EXECUTION_MESSAGES contract", () => {
  test("EXECUTION_MESSAGES keys exactly match EXECUTION_STATUS values", () => {
    const statusValues = new Set(Object.values(EXECUTION_STATUS));
    const messageKeys = new Set(Object.keys(EXECUTION_MESSAGES));
    const inStatusNotMessage = [...statusValues].filter((v) => !messageKeys.has(v));
    const inMessageNotStatus = [...messageKeys].filter((k) => !statusValues.has(k));
    expect(inStatusNotMessage).toEqual([]);
    expect(inMessageNotStatus).toEqual([]);
  });

  test("SUCCESS message does not reference error states", () => {
    expect(EXECUTION_MESSAGES[EXECUTION_STATUS.SUCCESS]).not.toMatch(/error/i);
    expect(EXECUTION_MESSAGES[EXECUTION_STATUS.SUCCESS]).not.toMatch(/limit/i);
  });

  test("TLE message mentions time or limit", () => {
    const msg = EXECUTION_MESSAGES[EXECUTION_STATUS.TLE];
    expect(msg.toLowerCase()).toMatch(/time|limit|exceeded/i);
  });

  test("MLE message mentions memory or limit", () => {
    const msg = EXECUTION_MESSAGES[EXECUTION_STATUS.MLE];
    expect(msg.toLowerCase()).toMatch(/memory|limit|exceeded/i);
  });
});
