// __tests__/apiErrors.test.js
//
// Run with:  npx jest __tests__/apiErrors.test.js --colors=false
//
// Tests the ApiError class hierarchy in src/lib/apiErrors.js.

import {
  ApiError,
  AuthError,
  RateLimitError,
  ValidationError,
  ConfigError,
} from "../src/lib/apiErrors.js";

describe("ApiError", () => {
  test("is an instance of Error", () => {
    const err = new ApiError("test message", "TEST_CODE", 418);
    expect(err instanceof Error).toBe(true);
    expect(err instanceof ApiError).toBe(true);
  });

  test("has correct name, message, code, and status", () => {
    const err = new ApiError("something broke", "BREAK_CODE", 503);
    expect(err.name).toBe("ApiError");
    expect(err.message).toBe("something broke");
    expect(err.code).toBe("BREAK_CODE");
    expect(err.status).toBe(503);
  });

  test("uses defaults when optional args not provided", () => {
    const err = new ApiError("oops");
    expect(err.code).toBe("INTERNAL_ERROR");
    expect(err.status).toBe(500);
  });

  test("uses all defaults when no args provided", () => {
    const err = new ApiError();
    expect(err.message).toBe(undefined);
    expect(err.code).toBe("INTERNAL_ERROR");
    expect(err.status).toBe(500);
  });
});

describe("AuthError", () => {
  test("extends ApiError and Error", () => {
    const err = new AuthError("forbidden");
    expect(err instanceof AuthError).toBe(true);
    expect(err instanceof ApiError).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test("has correct code and status", () => {
    const err = new AuthError("token expired");
    expect(err.code).toBe("AUTH_ERROR");
    expect(err.status).toBe(401);
    expect(err.message).toBe("token expired");
  });

  test("uses default message when not provided", () => {
    const err = new AuthError();
    expect(err.message).toBe("Unauthorized");
    expect(err.code).toBe("AUTH_ERROR");
    expect(err.status).toBe(401);
  });
});

describe("RateLimitError", () => {
  test("extends ApiError and Error", () => {
    const err = new RateLimitError("slow down");
    expect(err instanceof RateLimitError).toBe(true);
    expect(err instanceof ApiError).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test("has correct code and status", () => {
    const err = new RateLimitError("too many requests");
    expect(err.code).toBe("RATE_LIMIT");
    expect(err.status).toBe(429);
    expect(err.message).toBe("too many requests");
  });

  test("uses default message when not provided", () => {
    const err = new RateLimitError();
    expect(err.message).toBe("Too many requests");
    expect(err.code).toBe("RATE_LIMIT");
    expect(err.status).toBe(429);
  });
});

describe("ValidationError", () => {
  test("extends ApiError and Error", () => {
    const err = new ValidationError("bad input");
    expect(err instanceof ValidationError).toBe(true);
    expect(err instanceof ApiError).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test("has correct code and status", () => {
    const err = new ValidationError("missing field");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.status).toBe(400);
    expect(err.message).toBe("missing field");
  });

  test("uses default message when not provided", () => {
    const err = new ValidationError();
    expect(err.message).toBe("Validation failed");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.status).toBe(400);
  });
});

describe("ConfigError", () => {
  test("extends ApiError and Error", () => {
    const err = new ConfigError("misconfigured");
    expect(err instanceof ConfigError).toBe(true);
    expect(err instanceof ApiError).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test("has correct code and status", () => {
    const err = new ConfigError("db url missing");
    expect(err.code).toBe("CONFIG_ERROR");
    expect(err.status).toBe(500);
    expect(err.message).toBe("db url missing");
  });

  test("uses default message when not provided", () => {
    const err = new ConfigError();
    expect(err.message).toBe("Server configuration error");
    expect(err.code).toBe("CONFIG_ERROR");
    expect(err.status).toBe(500);
  });
});

describe("class hierarchy", () => {
  test("all subclasses are catchable as ApiError", () => {
    const errors = [
      new ApiError(),
      new AuthError(),
      new RateLimitError(),
      new ValidationError(),
      new ConfigError(),
    ];
    errors.forEach((err) => {
      expect(err instanceof ApiError).toBe(true);
    });
  });

  test("custom message overrides default correctly", () => {
    const customMsg = "my custom auth message";
    const err = new AuthError(customMsg);
    expect(err.message).toBe(customMsg);
    expect(err.code).toBe("AUTH_ERROR");
    expect(err.status).toBe(401);
  });
});
