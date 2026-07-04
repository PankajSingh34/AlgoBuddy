import { describe, expect, test, jest, beforeEach, afterAll } from "@jest/globals";

const ORIGINAL_SECRET = process.env.CSRF_SECRET;

beforeEach(() => {
  process.env.CSRF_SECRET = "test-secret-thirtytwocharslong!!";
  jest.resetModules();
});

afterAll(() => {
  if (ORIGINAL_SECRET) process.env.CSRF_SECRET = ORIGINAL_SECRET;
  else delete process.env.CSRF_SECRET;
});

function makeMockRequest(cookieToken, headerToken) {
  return {
    cookies: { get: () => (cookieToken != null ? { value: cookieToken } : undefined) },
    headers: { get: () => headerToken ?? null },
  };
}

describe("CSRF helpers (csrf.js)", () => {
  describe("generateCsrfToken", () => {
    test("returns a token with three colon-separated parts", async () => {
      const { generateCsrfToken } = await import("../src/lib/csrf.js");
      const token = generateCsrfToken();
      const parts = token.split(":");
      expect(parts).toHaveLength(3);
      expect(parts[0]).toMatch(/^[0-9a-f]{32}$/);
      expect(parts[1]).toMatch(/^[0-9a-z]+$/);
      expect(parts[2]).toMatch(/^[0-9a-f]{64}$/);
    });

    test("produces different tokens on successive calls", async () => {
      const { generateCsrfToken } = await import("../src/lib/csrf.js");
      const tokens = new Set();
      for (let i = 0; i < 50; i++) tokens.add(generateCsrfToken());
      expect(tokens.size).toBe(50);
    });
  });

  describe("validateCsrf", () => {
    test("returns true for a valid token", async () => {
      const { generateCsrfToken, validateCsrf } = await import("../src/lib/csrf.js");
      const token = generateCsrfToken();
      expect(validateCsrf(makeMockRequest(token, token))).toBe(true);
    });

    test("returns false when cookie token is missing", async () => {
      const { generateCsrfToken, validateCsrf } = await import("../src/lib/csrf.js");
      const token = generateCsrfToken();
      expect(validateCsrf(makeMockRequest(null, token))).toBe(false);
    });

    test("returns false when header token is missing", async () => {
      const { generateCsrfToken, validateCsrf } = await import("../src/lib/csrf.js");
      const token = generateCsrfToken();
      expect(validateCsrf(makeMockRequest(token, null))).toBe(false);
    });

    test("returns false when cookie and header do not match", async () => {
      const { generateCsrfToken, validateCsrf } = await import("../src/lib/csrf.js");
      const tokenA = generateCsrfToken();
      const { generateCsrfToken: gen2 } = await import("../src/lib/csrf.js");
      const tokenB = gen2();
      expect(validateCsrf(makeMockRequest(tokenA, tokenB))).toBe(false);
    });

    test("returns false for tampered token", async () => {
      const { generateCsrfToken, validateCsrf } = await import("../src/lib/csrf.js");
      const token = generateCsrfToken();
      const parts = token.split(":");
      const tampered = `${parts[0]}:${parts[1]}:0000000000000000000000000000000000000000000000000000000000000000`;
      expect(validateCsrf(makeMockRequest(tampered, tampered))).toBe(false);
    });
  });

  describe("setCsrfCookie", () => {
    test("sets a secure httpOnly cookie on the response", async () => {
      const { setCsrfCookie } = await import("../src/lib/csrf.js");
      const cookies = { set: jest.fn() };
      const token = setCsrfCookie({ cookies });
      expect(typeof token).toBe("string");
      expect(token.split(":")).toHaveLength(3);
      expect(cookies.set).toHaveBeenCalledWith(
        "csrf-token",
        token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 24 * 60 * 60,
        }),
      );
    });
  });
});

describe("CSRF constants (csrfConstants.js)", () => {
  describe("validateCsrfOrigin", () => {
    test("accepts localhost origin", async () => {
      const { validateCsrfOrigin } = await import("../src/lib/csrfConstants.js");
      expect(
        validateCsrfOrigin({ headers: { get: () => "http://localhost:3000" } }),
      ).toBe(true);
    });

    test("accepts algobuddy.me origin", async () => {
      const { validateCsrfOrigin } = await import("../src/lib/csrfConstants.js");
      expect(
        validateCsrfOrigin({ headers: { get: () => "https://algobuddy.me" } }),
      ).toBe(true);
    });

    test("rejects unknown origin", async () => {
      const { validateCsrfOrigin } = await import("../src/lib/csrfConstants.js");
      expect(
        validateCsrfOrigin({ headers: { get: () => "https://evil.com" } }),
      ).toBe(false);
    });

    test("rejects request without origin or referer", async () => {
      const { validateCsrfOrigin } = await import("../src/lib/csrfConstants.js");
      expect(
        validateCsrfOrigin({ headers: { get: () => null } }),
      ).toBe(false);
    });
  });

  describe("isStateChangingMethod", () => {
    test("returns true for POST, PUT, PATCH, DELETE", async () => {
      const { isStateChangingMethod } = await import("../src/lib/csrfConstants.js");
      expect(isStateChangingMethod("POST")).toBe(true);
      expect(isStateChangingMethod("PUT")).toBe(true);
      expect(isStateChangingMethod("PATCH")).toBe(true);
      expect(isStateChangingMethod("DELETE")).toBe(true);
    });

    test("returns false for GET, HEAD, OPTIONS", async () => {
      const { isStateChangingMethod } = await import("../src/lib/csrfConstants.js");
      expect(isStateChangingMethod("GET")).toBe(false);
      expect(isStateChangingMethod("HEAD")).toBe(false);
      expect(isStateChangingMethod("OPTIONS")).toBe(false);
    });
  });

  describe("isApiRoute", () => {
    test("returns true for /api/... paths", async () => {
      const { isApiRoute } = await import("../src/lib/csrfConstants.js");
      expect(isApiRoute("/api/auth")).toBe(true);
      expect(isApiRoute("/api/csrf-token")).toBe(true);
    });

    test("returns false for non-API paths", async () => {
      const { isApiRoute } = await import("../src/lib/csrfConstants.js");
      expect(isApiRoute("/")).toBe(false);
      expect(isApiRoute("/about")).toBe(false);
    });
  });
});
