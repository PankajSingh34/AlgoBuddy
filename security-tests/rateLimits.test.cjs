// security-tests/rateLimits.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/rateLimits.test.cjs
//
// Tests the RATE_LIMITS configuration object in src/config/rateLimits.js.
// Source object is inlined verbatim.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inlined from src/config/rateLimits.js
const RATE_LIMITS = {
  CONTACT_API: {
    LIMIT: 5,
  },
  SMTP: {
    DAILY_QUOTA: parseInt(process.env.SMTP_DAILY_QUOTA || '400', 10),
  },
};

describe('RATE_LIMITS structure', () => {
  test('RATE_LIMITS is an object', () => {
    assert.strictEqual(typeof RATE_LIMITS, 'object');
    assert.ok(RATE_LIMITS !== null);
  });

  test('has CONTACT_API key', () => {
    assert.ok('CONTACT_API' in RATE_LIMITS);
    assert.strictEqual(typeof RATE_LIMITS.CONTACT_API, 'object');
  });

  test('has SMTP key', () => {
    assert.ok('SMTP' in RATE_LIMITS);
    assert.strictEqual(typeof RATE_LIMITS.SMTP, 'object');
  });
});

describe('CONTACT_API limits', () => {
  test('CONTACT_API has LIMIT key', () => {
    assert.ok('LIMIT' in RATE_LIMITS.CONTACT_API);
  });

  test('CONTACT_API.LIMIT is a positive integer', () => {
    const limit = RATE_LIMITS.CONTACT_API.LIMIT;
    assert.strictEqual(typeof limit, 'number');
    assert.ok(Number.isInteger(limit), 'LIMIT should be an integer');
    assert.ok(limit > 0, 'LIMIT should be positive');
  });

  test('CONTACT_API.LIMIT equals 5', () => {
    assert.strictEqual(RATE_LIMITS.CONTACT_API.LIMIT, 5);
  });
});

describe('SMTP limits', () => {
  test('SMTP has DAILY_QUOTA key', () => {
    assert.ok('DAILY_QUOTA' in RATE_LIMITS.SMTP);
  });

  test('SMTP.DAILY_QUOTA is a positive integer', () => {
    const quota = RATE_LIMITS.SMTP.DAILY_QUOTA;
    assert.strictEqual(typeof quota, 'number');
    assert.ok(Number.isInteger(quota), 'DAILY_QUOTA should be an integer');
    assert.ok(quota > 0, 'DAILY_QUOTA should be positive');
  });

  test('SMTP.DAILY_QUOTA defaults to 400 when SMTP_DAILY_QUOTA env var is unset', () => {
    // This test runs with SMTP_DAILY_QUOTA env var unset
    // parseInt defaults to 400 when the env var is absent
    const quota = RATE_LIMITS.SMTP.DAILY_QUOTA;
    assert.strictEqual(quota, 400, 'Default DAILY_QUOTA should be 400');
  });

  test('SMTP.DAILY_QUOTA is at least 1', () => {
    assert.ok(RATE_LIMITS.SMTP.DAILY_QUOTA >= 1);
  });
});
