// __tests__/components/apiErrors.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/apiErrors.test.js --colors=false
//
// Tests the error class hierarchy exported by src/lib/apiErrors.js.

import {
  ApiError,
  AuthError,
  RateLimitError,
  ValidationError,
  ConfigError,
} from '@/lib/apiErrors.js';

describe('ApiError', () => {
  test('defaults to INTERNAL_ERROR code and 500 status', () => {
    const err = new ApiError('Something went wrong');
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('Something went wrong');
    expect(err.code).toBe('INTERNAL_ERROR');
    expect(err.status).toBe(500);
    expect(err instanceof Error).toBe(true);
  });

  test('accepts custom code and status', () => {
    const err = new ApiError('Custom', 'CUSTOM_CODE', 418);
    expect(err.code).toBe('CUSTOM_CODE');
    expect(err.status).toBe(418);
  });
});

describe('AuthError', () => {
  test('defaults to Unauthorized message', () => {
    const err = new AuthError();
    expect(err.name).toBe('AuthError');
    expect(err.message).toBe('Unauthorized');
    expect(err.code).toBe('AUTH_ERROR');
    expect(err.status).toBe(401);
  });

  test('accepts custom message', () => {
    const err = new AuthError('Session expired');
    expect(err.message).toBe('Session expired');
  });

  test('inherits from ApiError', () => {
    const err = new AuthError();
    expect(err instanceof ApiError).toBe(true);
    expect(err instanceof AuthError).toBe(true);
  });
});

describe('RateLimitError', () => {
  test('defaults to Too many requests message', () => {
    const err = new RateLimitError();
    expect(err.name).toBe('RateLimitError');
    expect(err.message).toBe('Too many requests');
    expect(err.code).toBe('RATE_LIMIT');
    expect(err.status).toBe(429);
  });

  test('accepts custom message', () => {
    const err = new RateLimitError('Slow down!');
    expect(err.message).toBe('Slow down!');
  });

  test('inherits from ApiError', () => {
    const err = new RateLimitError();
    expect(err instanceof ApiError).toBe(true);
  });
});

describe('ValidationError', () => {
  test('defaults to Validation failed message', () => {
    const err = new ValidationError();
    expect(err.name).toBe('ValidationError');
    expect(err.message).toBe('Validation failed');
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.status).toBe(400);
  });

  test('accepts custom message', () => {
    const err = new ValidationError('Email is invalid');
    expect(err.message).toBe('Email is invalid');
  });

  test('inherits from ApiError', () => {
    const err = new ValidationError();
    expect(err instanceof ApiError).toBe(true);
  });
});

describe('ConfigError', () => {
  test('defaults to Server configuration error message', () => {
    const err = new ConfigError();
    expect(err.name).toBe('ConfigError');
    expect(err.message).toBe('Server configuration error');
    expect(err.code).toBe('CONFIG_ERROR');
    expect(err.status).toBe(500);
  });

  test('accepts custom message', () => {
    const err = new ConfigError('Missing SUPABASE_URL');
    expect(err.message).toBe('Missing SUPABASE_URL');
  });

  test('inherits from ApiError', () => {
    const err = new ConfigError();
    expect(err instanceof ApiError).toBe(true);
  });
});
