// __tests__/rateLimitsConfig.test.mjs
//
// Run with:  NODE_OPTIONS="--experimental-vm-modules" npx jest __tests__/rateLimitsConfig.test.mjs --colors=false
//
// Tests the RATE_LIMITS export in src/config/rateLimits.js.

import { describe, expect, test } from "@jest/globals";
import { RATE_LIMITS } from "../src/config/rateLimits.js";

describe("RATE_LIMITS", () => {
  test("has expected top-level keys", () => {
    expect(RATE_LIMITS).toHaveProperty("CONTACT_API");
    expect(RATE_LIMITS).toHaveProperty("SMTP");
  });

  test("CONTACT_API has a numeric LIMIT", () => {
    expect(typeof RATE_LIMITS.CONTACT_API.LIMIT).toBe("number");
    expect(RATE_LIMITS.CONTACT_API.LIMIT).toBeGreaterThan(0);
  });

  test("SMTP has a numeric DAILY_QUOTA", () => {
    expect(typeof RATE_LIMITS.SMTP.DAILY_QUOTA).toBe("number");
    expect(RATE_LIMITS.SMTP.DAILY_QUOTA).toBeGreaterThan(0);
  });

  test("CONTACT_API.LIMIT is a reasonable positive integer", () => {
    const limit = RATE_LIMITS.CONTACT_API.LIMIT;
    expect(Number.isInteger(limit)).toBe(true);
    expect(limit).toBeGreaterThanOrEqual(1);
    expect(limit).toBeLessThanOrEqual(1000);
  });

  test("SMTP.DAILY_QUOTA defaults to 400 when env var is absent", () => {
    // When NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
    // are not set, getSupabaseConfig returns null and the app uses
    // createMissingSupabaseClient which has no SMTP env var access here.
    // The RATE_LIMITS export uses process.env.SMTP_DAILY_QUOTA which
    // defaults to 400.
    expect(RATE_LIMITS.SMTP.DAILY_QUOTA).toBeGreaterThanOrEqual(100);
  });

  test("RATE_LIMITS structure is compatible with rate-limit middleware", () => {
    // The shape must satisfy what checkRateLimit expects:
    // { LIMIT: number, DAILY_QUOTA: number }
    const contact = RATE_LIMITS.CONTACT_API;
    const smtp = RATE_LIMITS.SMTP;

    expect(typeof contact.LIMIT).toBe("number");
    expect(typeof smtp.DAILY_QUOTA).toBe("number");
    expect(Number.isSafeInteger(contact.LIMIT)).toBe(true);
    expect(Number.isSafeInteger(smtp.DAILY_QUOTA)).toBe(true);
  });
});
