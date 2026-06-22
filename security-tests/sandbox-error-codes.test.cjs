// security-tests/sandbox-error-codes.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/sandbox-error-codes.test.cjs
//
// Tests the EXECUTION_STATUS and EXECUTION_MESSAGES constants in
// src/lib/sandbox/errorCodes.js.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { EXECUTION_STATUS, EXECUTION_MESSAGES } = require('../src/lib/sandbox/errorCodes');

describe('EXECUTION_STATUS', () => {
  test('has SUCCESS key', () => {
    assert.ok('SUCCESS' in EXECUTION_STATUS);
  });

  test('has TLE key (Time Limit Exceeded)', () => {
    assert.ok('TLE' in EXECUTION_STATUS);
  });

  test('has MLE key (Memory Limit Exceeded)', () => {
    assert.ok('MLE' in EXECUTION_STATUS);
  });

  test('has RUNTIME_ERROR key', () => {
    assert.ok('RUNTIME_ERROR' in EXECUTION_STATUS);
  });

  test('has INTERNAL_ERROR key', () => {
    assert.ok('INTERNAL_ERROR' in EXECUTION_STATUS);
  });

  test('each status value is a non-empty string', () => {
    for (const [key, value] of Object.entries(EXECUTION_STATUS)) {
      assert.strictEqual(typeof value, 'string', `${key} should be a string`);
      assert.ok(value.length > 0, `${key} should be non-empty`);
    }
  });

  test('all status values are unique', () => {
    const values = Object.values(EXECUTION_STATUS);
    const unique = new Set(values);
    assert.strictEqual(unique.size, values.length, 'all status values should be unique');
  });
});

describe('EXECUTION_MESSAGES', () => {
  test('has a message for SUCCESS', () => {
    assert.ok('SUCCESS' in EXECUTION_MESSAGES);
    assert.ok(EXECUTION_MESSAGES.SUCCESS.length > 0);
  });

  test('has a message for TLE', () => {
    assert.ok('TLE' in EXECUTION_MESSAGES);
    assert.ok(EXECUTION_MESSAGES.TLE.length > 0);
  });

  test('has a message for MLE', () => {
    assert.ok('MLE' in EXECUTION_MESSAGES);
    assert.ok(EXECUTION_MESSAGES.MLE.length > 0);
  });

  test('has a message for RUNTIME_ERROR', () => {
    assert.ok('RUNTIME_ERROR' in EXECUTION_MESSAGES);
    assert.ok(EXECUTION_MESSAGES.RUNTIME_ERROR.length > 0);
  });

  test('has a message for INTERNAL_ERROR', () => {
    assert.ok('INTERNAL_ERROR' in EXECUTION_MESSAGES);
    assert.ok(EXECUTION_MESSAGES.INTERNAL_ERROR.length > 0);
  });

  test('has exactly the same keys as EXECUTION_STATUS', () => {
    const statusKeys = Object.keys(EXECUTION_STATUS).sort();
    const messageKeys = Object.keys(EXECUTION_MESSAGES).sort();
    assert.deepStrictEqual(messageKeys, statusKeys,
      'EXECUTION_MESSAGES should have the same keys as EXECUTION_STATUS');
  });

  test('SUCCESS message contains expected keyword', () => {
    const msg = EXECUTION_MESSAGES.SUCCESS.toLowerCase();
    assert.ok(
      msg.includes('success') || msg.includes('ran') || msg.includes('ok'),
      `"${EXECUTION_MESSAGES.SUCCESS}" should mention success or ran`,
    );
  });

  test('TLE message mentions Time Limit', () => {
    const msg = EXECUTION_MESSAGES.TLE.toLowerCase();
    assert.ok(
      msg.includes('time') || msg.includes('limit') || msg.includes('tle'),
      `"${EXECUTION_MESSAGES.TLE}" should mention time or limit`,
    );
  });

  test('MLE message mentions Memory Limit', () => {
    const msg = EXECUTION_MESSAGES.MLE.toLowerCase();
    assert.ok(
      msg.includes('memory') || msg.includes('limit') || msg.includes('mle'),
      `"${EXECUTION_MESSAGES.MLE}" should mention memory or limit`,
    );
  });

  test('RUNTIME_ERROR message is non-generic', () => {
    const msg = EXECUTION_MESSAGES.RUNTIME_ERROR;
    assert.ok(msg.length > 10, 'RUNTIME_ERROR message should be descriptive');
  });

  test('INTERNAL_ERROR message is non-generic', () => {
    const msg = EXECUTION_MESSAGES.INTERNAL_ERROR;
    assert.ok(msg.length > 10, 'INTERNAL_ERROR message should be descriptive');
  });
});
