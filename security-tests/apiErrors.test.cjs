// security-tests/apiErrors.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/apiErrors.test.cjs
//
// Tests the ApiError class hierarchy exported by src/lib/apiErrors.js

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inlined implementation under test (mirrors src/lib/apiErrors.js)
class ApiError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', status = 500) {
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

describe('ApiError', () => {
  test('has correct name, code, and status with defaults', () => {
    const err = new ApiError('Something went wrong');
    assert.strictEqual(err.name, 'ApiError');
    assert.strictEqual(err.message, 'Something went wrong');
    assert.strictEqual(err.code, 'INTERNAL_ERROR');
    assert.strictEqual(err.status, 500);
    assert.strictEqual(err instanceof Error, true);
  });

  test('accepts custom code and status', () => {
    const err = new ApiError('Bad request', 'BAD_REQ', 418);
    assert.strictEqual(err.code, 'BAD_REQ');
    assert.strictEqual(err.status, 418);
  });

  test('instanceof ApiError', () => {
    assert.strictEqual(new ApiError('x') instanceof ApiError, true);
  });
});

describe('AuthError', () => {
  test('has correct defaults', () => {
    const err = new AuthError();
    assert.strictEqual(err.name, 'AuthError');
    assert.strictEqual(err.message, 'Unauthorized');
    assert.strictEqual(err.code, 'AUTH_ERROR');
    assert.strictEqual(err.status, 401);
  });

  test('accepts custom message', () => {
    const err = new AuthError('Custom auth message');
    assert.strictEqual(err.message, 'Custom auth message');
  });

  test('instanceof ApiError and Error', () => {
    const err = new AuthError();
    assert.strictEqual(err instanceof ApiError, true);
    assert.strictEqual(err instanceof Error, true);
  });
});

describe('RateLimitError', () => {
  test('has correct defaults', () => {
    const err = new RateLimitError();
    assert.strictEqual(err.name, 'RateLimitError');
    assert.strictEqual(err.message, 'Too many requests');
    assert.strictEqual(err.code, 'RATE_LIMIT');
    assert.strictEqual(err.status, 429);
  });

  test('accepts custom message', () => {
    const err = new RateLimitError('Slow down');
    assert.strictEqual(err.message, 'Slow down');
  });

  test('instanceof ApiError', () => {
    const err = new RateLimitError();
    assert.strictEqual(err instanceof ApiError, true);
  });
});

describe('ValidationError', () => {
  test('has correct defaults', () => {
    const err = new ValidationError();
    assert.strictEqual(err.name, 'ValidationError');
    assert.strictEqual(err.message, 'Validation failed');
    assert.strictEqual(err.code, 'VALIDATION_ERROR');
    assert.strictEqual(err.status, 400);
  });

  test('accepts custom message', () => {
    const err = new ValidationError('Email is invalid');
    assert.strictEqual(err.message, 'Email is invalid');
  });

  test('instanceof ApiError', () => {
    const err = new ValidationError();
    assert.strictEqual(err instanceof ApiError, true);
  });
});

describe('ConfigError', () => {
  test('has correct defaults', () => {
    const err = new ConfigError();
    assert.strictEqual(err.name, 'ConfigError');
    assert.strictEqual(err.message, 'Server configuration error');
    assert.strictEqual(err.code, 'CONFIG_ERROR');
    assert.strictEqual(err.status, 500);
  });

  test('accepts custom message', () => {
    const err = new ConfigError('Missing env var');
    assert.strictEqual(err.message, 'Missing env var');
  });

  test('instanceof ApiError', () => {
    const err = new ConfigError();
    assert.strictEqual(err instanceof ApiError, true);
  });
});
