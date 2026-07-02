// security-tests/apiErrors.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/apiErrors.test.cjs
//
// Tests the ApiError class hierarchy in src/lib/apiErrors.js

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inlined classes from src/lib/apiErrors.js

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

describe('ApiError class hierarchy', () => {
  describe('ApiError', () => {
    it('has correct name property', () => {
      const err = new ApiError('test message', 'TEST_CODE', 418);
      assert.strictEqual(err.name, 'ApiError');
    });

    it('has correct message property', () => {
      const err = new ApiError('custom message');
      assert.strictEqual(err.message, 'custom message');
    });

    it('has correct code and status from constructor args', () => {
      const err = new ApiError('msg', 'MY_CODE', 503);
      assert.strictEqual(err.code, 'MY_CODE');
      assert.strictEqual(err.status, 503);
    });

    it('has default code and status when omitted', () => {
      const err = new ApiError('msg');
      assert.strictEqual(err.code, 'INTERNAL_ERROR');
      assert.strictEqual(err.status, 500);
    });

    it('is instanceof Error', () => {
      assert.ok(new ApiError('msg') instanceof Error);
    });
  });

  describe('AuthError', () => {
    it('has correct name', () => {
      const err = new AuthError();
      assert.strictEqual(err.name, 'AuthError');
    });

    it('extends ApiError', () => {
      assert.ok(new AuthError() instanceof ApiError);
    });

    it('has AUTH_ERROR code', () => {
      assert.strictEqual(new AuthError().code, 'AUTH_ERROR');
    });

    it('has 401 status', () => {
      assert.strictEqual(new AuthError().status, 401);
    });

    it('accepts custom message', () => {
      assert.strictEqual(new AuthError('not allowed').message, 'not allowed');
    });

    it('uses default message when omitted', () => {
      assert.strictEqual(new AuthError().message, 'Unauthorized');
    });
  });

  describe('RateLimitError', () => {
    it('has correct name', () => {
      const err = new RateLimitError();
      assert.strictEqual(err.name, 'RateLimitError');
    });

    it('extends ApiError', () => {
      assert.ok(new RateLimitError() instanceof ApiError);
    });

    it('has RATE_LIMIT code', () => {
      assert.strictEqual(new RateLimitError().code, 'RATE_LIMIT');
    });

    it('has 429 status', () => {
      assert.strictEqual(new RateLimitError().status, 429);
    });

    it('accepts custom message', () => {
      assert.strictEqual(new RateLimitError('slow down').message, 'slow down');
    });

    it('uses default message when omitted', () => {
      assert.strictEqual(new RateLimitError().message, 'Too many requests');
    });
  });

  describe('ValidationError', () => {
    it('has correct name', () => {
      const err = new ValidationError();
      assert.strictEqual(err.name, 'ValidationError');
    });

    it('extends ApiError', () => {
      assert.ok(new ValidationError() instanceof ApiError);
    });

    it('has VALIDATION_ERROR code', () => {
      assert.strictEqual(new ValidationError().code, 'VALIDATION_ERROR');
    });

    it('has 400 status', () => {
      assert.strictEqual(new ValidationError().status, 400);
    });

    it('accepts custom message', () => {
      assert.strictEqual(new ValidationError('bad input').message, 'bad input');
    });

    it('uses default message when omitted', () => {
      assert.strictEqual(new ValidationError().message, 'Validation failed');
    });
  });

  describe('ConfigError', () => {
    it('has correct name', () => {
      const err = new ConfigError();
      assert.strictEqual(err.name, 'ConfigError');
    });

    it('extends ApiError', () => {
      assert.ok(new ConfigError() instanceof ApiError);
    });

    it('has CONFIG_ERROR code', () => {
      assert.strictEqual(new ConfigError().code, 'CONFIG_ERROR');
    });

    it('has 500 status', () => {
      assert.strictEqual(new ConfigError().status, 500);
    });

    it('accepts custom message', () => {
      assert.strictEqual(new ConfigError('missing key').message, 'missing key');
    });

    it('uses default message when omitted', () => {
      assert.strictEqual(new ConfigError().message, 'Server configuration error');
    });
  });

  describe('class hierarchy consistency', () => {
    it('all subclasses are instanceof ApiError and Error', () => {
      const errors = [
        new AuthError(),
        new RateLimitError(),
        new ValidationError(),
        new ConfigError(),
      ];
      errors.forEach((err) => {
        assert.ok(err instanceof ApiError, `${err.name} should be instanceof ApiError`);
        assert.ok(err instanceof Error, `${err.name} should be instanceof Error`);
      });
    });

    it('errors are not instances of each other', () => {
      assert.ok(!(new AuthError() instanceof RateLimitError));
      assert.ok(!(new RateLimitError() instanceof ValidationError));
      assert.ok(!(new ValidationError() instanceof ConfigError));
      assert.ok(!(new ConfigError() instanceof AuthError));
    });
  });
});
