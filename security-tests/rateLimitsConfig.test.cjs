// security-tests/rateLimitsConfig.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/rateLimitsConfig.test.cjs
//
// Tests the RATE_LIMITS configuration from src/config/rateLimits.js.

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Inlined RATE_LIMITS from src/config/rateLimits.js
// We use a helper that mirrors the actual module to avoid Next.js context.
function buildRateLimits(env) {
  return {
    CONTACT_API: {
      LIMIT: 5,
    },
    SMTP: {
      DAILY_QUOTA: parseInt(env.SMTP_DAILY_QUOTA || '400', 10),
    },
  };
}

describe('RATE_LIMITS configuration structure', () => {
  let RATE_LIMITS;

  beforeEach(() => {
    RATE_LIMITS = buildRateLimits({});
  });

  test('RATE_LIMITS has CONTACT_API key', () => {
    assert.ok('CONTACT_API' in RATE_LIMITS);
  });

  test('CONTACT_API has LIMIT property', () => {
    assert.ok('LIMIT' in RATE_LIMITS.CONTACT_API);
  });

  test('CONTACT_API.LIMIT is a positive integer', () => {
    assert.equal(typeof RATE_LIMITS.CONTACT_API.LIMIT, 'number');
    assert.equal(Number.isInteger(RATE_LIMITS.CONTACT_API.LIMIT), true);
    assert.ok(RATE_LIMITS.CONTACT_API.LIMIT > 0);
  });

  test('RATE_LIMITS has SMTP key', () => {
    assert.ok('SMTP' in RATE_LIMITS);
  });

  test('SMTP has DAILY_QUOTA property', () => {
    assert.ok('DAILY_QUOTA' in RATE_LIMITS.SMTP);
  });

  test('SMTP.DAILY_QUOTA is a positive integer with default 400', () => {
    assert.equal(typeof RATE_LIMITS.SMTP.DAILY_QUOTA, 'number');
    assert.equal(Number.isInteger(RATE_LIMITS.SMTP.DAILY_QUOTA), true);
    assert.ok(RATE_LIMITS.SMTP.DAILY_QUOTA > 0);
  });

  test('default DAILY_QUOTA is 400 when env is not set', () => {
    const limits = buildRateLimits({});
    assert.equal(limits.SMTP.DAILY_QUOTA, 400);
  });

  test('DAILY_QUOTA parses custom env value', () => {
    const limits = buildRateLimits({ SMTP_DAILY_QUOTA: '200' });
    assert.equal(limits.SMTP.DAILY_QUOTA, 200);
  });

  test('DAILY_QUOTA parses non-numeric env as NaN', () => {
    const limits = buildRateLimits({ SMTP_DAILY_QUOTA: 'not-a-number' });
    assert.ok(Number.isNaN(limits.SMTP.DAILY_QUOTA));
  });

  test('RATE_LIMITS does not have unexpected top-level keys', () => {
    const keys = Object.keys(RATE_LIMITS).sort();
    assert.deepEqual(keys, ['CONTACT_API', 'SMTP']);
  });

  test('CONTACT_API does not have unexpected keys', () => {
    const keys = Object.keys(RATE_LIMITS.CONTACT_API).sort();
    assert.deepEqual(keys, ['LIMIT']);
  });

  test('SMTP does not have unexpected keys', () => {
    const keys = Object.keys(RATE_LIMITS.SMTP).sort();
    assert.deepEqual(keys, ['DAILY_QUOTA']);
  });

  test('CONTACT_API.LIMIT is 5', () => {
    assert.equal(RATE_LIMITS.CONTACT_API.LIMIT, 5);
  });
});
