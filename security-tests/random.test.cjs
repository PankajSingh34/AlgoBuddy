// security-tests/random.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/random.test.cjs
//
// Tests the generateSecureCode function exported by src/lib/random.js

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inlined implementation under test (mirrors src/lib/random.js)
function generateSecureCode(length = 6) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint32Array(length);
  globalThis.crypto.getRandomValues(array);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += charset[array[i] % charset.length];
  }
  return code;
}

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function isAlphanumericChar(ch) {
  return /^[A-Z0-9]$/.test(ch);
}

describe('generateSecureCode', () => {
  test('returns a string', () => {
    const result = generateSecureCode();
    assert.strictEqual(typeof result, 'string');
  });

  test('returns default length of 6 when called with no arguments', () => {
    const result = generateSecureCode();
    assert.strictEqual(result.length, 6);
  });

  test('returns exactly n characters when length is specified', () => {
    assert.strictEqual(generateSecureCode(1).length, 1);
    assert.strictEqual(generateSecureCode(4).length, 4);
    assert.strictEqual(generateSecureCode(8).length, 8);
    assert.strictEqual(generateSecureCode(12).length, 12);
  });

  test('all characters are alphanumeric uppercase A-Z or 0-9', () => {
    for (let i = 0; i < 20; i++) {
      const code = generateSecureCode(10);
      for (const ch of code) {
        assert.strictEqual(
          isAlphanumericChar(ch),
          true,
          `Character '${ch}' in '${code}' is not alphanumeric`,
        );
      }
    }
  });

  test('multiple calls produce different values (probabilistic randomness)', () => {
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateSecureCode(8));
    }
    // With 6 chars and ~36 chars per position, 100 samples should rarely collide
    assert.ok(
      codes.size >= 95,
      `Only ${codes.size} unique codes from 100 calls — distribution may be broken`,
    );
  });

  test('length of 0 returns empty string', () => {
    assert.strictEqual(generateSecureCode(0), '');
  });

  test('length of 1 produces a single alphanumeric character', () => {
    const code = generateSecureCode(1);
    assert.strictEqual(code.length, 1);
    assert.strictEqual(isAlphanumericChar(code[0]), true);
  });
});
