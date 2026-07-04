import { describe, expect, test } from "@jest/globals";
import {
  ApiError,
  AuthError,
  RateLimitError,
  ValidationError,
  ConfigError,
} from "../src/lib/apiErrors.js";

describe("ApiError class hierarchy", () => {
  describe("ApiError (base)", () => {
    test("creates with default params", () => {
      const err = new ApiError();
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe("ApiError");
      expect(err.code).toBe("INTERNAL_ERROR");
      expect(err.status).toBe(500);
      expect(err.message).toBe("");
    });

    test("creates with custom message, code, and status", () => {
      const err = new ApiError("Something broke", "DB_ERROR", 503);
      expect(err.message).toBe("Something broke");
      expect(err.code).toBe("DB_ERROR");
      expect(err.status).toBe(503);
    });
  });

  describe("AuthError", () => {
    test("defaults to 401 with AUTH_ERROR code", () => {
      const err = new AuthError();
      expect(err).toBeInstanceOf(ApiError);
      expect(err.name).toBe("AuthError");
      expect(err.code).toBe("AUTH_ERROR");
      expect(err.status).toBe(401);
      expect(err.message).toBe("Unauthorized");
    });

    test("accepts custom message", () => {
      const err = new AuthError("Invalid token");
      expect(err.message).toBe("Invalid token");
    });
  });

  describe("RateLimitError", () => {
    test("defaults to 429 with RATE_LIMIT code", () => {
      const err = new RateLimitError();
      expect(err).toBeInstanceOf(ApiError);
      expect(err.name).toBe("RateLimitError");
      expect(err.code).toBe("RATE_LIMIT");
      expect(err.status).toBe(429);
      expect(err.message).toBe("Too many requests");
    });
  });

  describe("ValidationError", () => {
    test("defaults to 400 with VALIDATION_ERROR code", () => {
      const err = new ValidationError();
      expect(err).toBeInstanceOf(ApiError);
      expect(err.name).toBe("ValidationError");
      expect(err.code).toBe("VALIDATION_ERROR");
      expect(err.status).toBe(400);
      expect(err.message).toBe("Validation failed");
    });
  });

  describe("ConfigError", () => {
    test("defaults to 500 with CONFIG_ERROR code", () => {
      const err = new ConfigError();
      expect(err).toBeInstanceOf(ApiError);
      expect(err.name).toBe("ConfigError");
      expect(err.code).toBe("CONFIG_ERROR");
      expect(err.status).toBe(500);
      expect(err.message).toBe("Server configuration error");
    });
  });
});
