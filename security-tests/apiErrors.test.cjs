// security-tests/apiErrors.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/apiErrors.test.cjs
//
// Tests the ApiError class hierarchy in src/lib/apiErrors.js.
// Inlined here because the source uses @/ path aliases that node:test cannot resolve.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// ── Inlined source from src/lib/apiErrors.js ────────────────────────────

class ApiError extends Error {
  constructor(message = 'Internal server error', code = 'INTERNAL_ERROR', status = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

class AuthError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

class RateLimitError extends ApiError {
  constructor(message = 'Too many requests') {
    super(message, 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
  }
}

class ValidationError extends ApiError {
  constructor(message = 'Validation failed') {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

class ConfigError extends ApiError {
  constructor(message = 'Server configuration error') {
    super(message, 'CONFIG_ERROR', 500);
    this.name = 'ConfigError';
  }
}

// ── Tests ───────────────────────────────────────────────────────────────

describe('ApiError', () => {
  test('has correct name property', () => {
    const err = new ApiError('test message');
    assert.strictEqual(err.name, 'ApiError');
  });

  test('is an instance of Error', () => {
    assert.ok(new ApiError('test') instanceof Error);
  });

  test('is an instance of ApiError', () => {
    assert.ok(new ApiError('test') instanceof ApiError);
  });

  test('accepts custom message, code, and status', () => {
    const err = new ApiError('custom msg', 'CUSTOM_CODE', 422);
    assert.strictEqual(err.message, 'custom msg');
    assert.strictEqual(err.code, 'CUSTOM_CODE');
    assert.strictEqual(err.status, 422);
  });

  test('defaults to INTERNAL_ERROR and status 500', () => {
    const err = new ApiError();
    assert.strictEqual(err.message, 'Internal server error');
    assert.strictEqual(err.code, 'INTERNAL_ERROR');
    assert.strictEqual(err.status, 500);
  });
});

describe('AuthError', () => {
  test('has correct name property', () => {
    assert.strictEqual(new AuthError().name, 'AuthError');
  });

  test('is an instance of ApiError', () => {
    assert.ok(new AuthError() instanceof ApiError);
  });

  test('is an instance of Error', () => {
    assert.ok(new AuthError() instanceof Error);
  });

  test('defaults to UNAUTHORIZED message, AUTH_ERROR code, and status 401', () => {
    const err = new AuthError();
    assert.strictEqual(err.message, 'Unauthorized');
    assert.strictEqual(err.code, 'AUTH_ERROR');
    assert.strictEqual(err.status, 401);
  });

  test('accepts a custom message', () => {
    const err = new AuthError('Token expired');
    assert.strictEqual(err.message, 'Token expired');
    assert.strictEqual(err.code, 'AUTH_ERROR');
    assert.strictEqual(err.status, 401);
  });
});

describe('RateLimitError', () => {
  test('has correct name property', () => {
    assert.strictEqual(new RateLimitError().name, 'RateLimitError');
  });

  test('is an instance of ApiError', () => {
    assert.ok(new RateLimitError() instanceof ApiError);
  });

  test('defaults to RATE_LIMIT message, code, and status 429', () => {
    const err = new RateLimitError();
    assert.strictEqual(err.message, 'Too many requests');
    assert.strictEqual(err.code, 'RATE_LIMIT');
    assert.strictEqual(err.status, 429);
  });

  test('accepts a custom message', () => {
    const err = new RateLimitError('Daily limit exceeded');
    assert.strictEqual(err.message, 'Daily limit exceeded');
    assert.strictEqual(err.code, 'RATE_LIMIT');
    assert.strictEqual(err.status, 429);
  });
});

describe('ValidationError', () => {
  test('has correct name property', () => {
    assert.strictEqual(new ValidationError().name, 'ValidationError');
  });

  test('is an instance of ApiError', () => {
    assert.ok(new ValidationError() instanceof ApiError);
  });

  test('defaults to VALIDATION_ERROR message, code, and status 400', () => {
    const err = new ValidationError();
    assert.strictEqual(err.message, 'Validation failed');
    assert.strictEqual(err.code, 'VALIDATION_ERROR');
    assert.strictEqual(err.status, 400);
  });

  test('accepts a custom message', () => {
    const err = new ValidationError('Invalid email format');
    assert.strictEqual(err.message, 'Invalid email format');
    assert.strictEqual(err.code, 'VALIDATION_ERROR');
    assert.strictEqual(err.status, 400);
  });
});

describe('ConfigError', () => {
  test('has correct name property', () => {
    assert.strictEqual(new ConfigError().name, 'ConfigError');
  });

  test('is an instance of ApiError', () => {
    assert.ok(new ConfigError() instanceof ApiError);
  });

  test('defaults to CONFIG_ERROR message, code, and status 500', () => {
    const err = new ConfigError();
    assert.strictEqual(err.message, 'Server configuration error');
    assert.strictEqual(err.code, 'CONFIG_ERROR');
    assert.strictEqual(err.status, 500);
  });

  test('accepts a custom message', () => {
    const err = new ConfigError('Missing DATABASE_URL');
    assert.strictEqual(err.message, 'Missing DATABASE_URL');
    assert.strictEqual(err.code, 'CONFIG_ERROR');
    assert.strictEqual(err.status, 500);
  });
});
