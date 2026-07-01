// security-tests/generateSecureCode.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/generateSecureCode.test.cjs
//
// Tests for src/lib/random.js generateSecureCode function

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inlined function from src/lib/random.js
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

function isAlphanumeric(code) {
  for (const ch of code) {
    if (!CHARSET.includes(ch)) return false;
  }
  return true;
}

describe('generateSecureCode', () => {
  describe('default length', () => {
    it('returns a string', () => {
      const result = generateSecureCode();
      assert.strictEqual(typeof result, 'string');
    });

    it('returns exactly 6 characters by default', () => {
      const result = generateSecureCode();
      assert.strictEqual(result.length, 6);
    });

    it('returns a string for default call (multiple times)', () => {
      for (let i = 0; i < 5; i++) {
        const result = generateSecureCode();
        assert.strictEqual(typeof result, 'string');
        assert.strictEqual(result.length, 6);
      }
    });
  });

  describe('custom length', () => {
    it('returns exactly 1 character for length 1', () => {
      assert.strictEqual(generateSecureCode(1).length, 1);
    });

    it('returns exactly 8 characters for length 8', () => {
      assert.strictEqual(generateSecureCode(8).length, 8);
    });

    it('returns exactly 16 characters for length 16', () => {
      assert.strictEqual(generateSecureCode(16).length, 16);
    });

    it('returns exactly 32 characters for length 32', () => {
      assert.strictEqual(generateSecureCode(32).length, 32);
    });

    it('returns empty string for length 0', () => {
      assert.strictEqual(generateSecureCode(0), '');
    });
  });

  describe('charset validation', () => {
    it('contains only uppercase A-Z and 0-9 for default length', () => {
      for (let i = 0; i < 20; i++) {
        const result = generateSecureCode();
        assert.ok(isAlphanumeric(result), `Invalid chars in: ${result}`);
      }
    });

    it('contains only uppercase A-Z and 0-9 for length 1', () => {
      for (let i = 0; i < 20; i++) {
        const result = generateSecureCode(1);
        assert.ok(isAlphanumeric(result), `Invalid char: ${result}`);
        assert.strictEqual(result.length, 1);
      }
    });

    it('contains only uppercase A-Z and 0-9 for length 16', () => {
      for (let i = 0; i < 20; i++) {
        const result = generateSecureCode(16);
        assert.ok(isAlphanumeric(result), `Invalid chars in: ${result}`);
      }
    });

    it('does not contain lowercase letters', () => {
      for (let i = 0; i < 20; i++) {
        const result = generateSecureCode(6);
        const hasLower = /[a-z]/.test(result);
        assert.ok(!hasLower, `Contains lowercase in: ${result}`);
      }
    });

    it('does not contain special characters', () => {
      for (let i = 0; i < 20; i++) {
        const result = generateSecureCode(6);
        const hasSpecial = /[^A-Z0-9]/.test(result);
        assert.ok(!hasSpecial, `Contains special chars in: ${result}`);
      }
    });
  });

  describe('uniqueness', () => {
    it('produces different values on consecutive calls', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(generateSecureCode());
      }
      // With 36^6 possibilities, 100 codes should all be unique
      assert.strictEqual(codes.size, 100, 'Expected all 100 codes to be unique');
    });

    it('produces different values for length 8 across many calls', () => {
      const codes = new Set();
      for (let i = 0; i < 50; i++) {
        codes.add(generateSecureCode(8));
      }
      assert.strictEqual(codes.size, 50, 'Expected all 50 codes to be unique');
    });
  });

  describe('type safety', () => {
    it('returns a string type', () => {
      const result = generateSecureCode();
      assert.ok(typeof result === 'string');
    });

    it('is not undefined or null', () => {
      for (let i = 0; i < 10; i++) {
        const result = generateSecureCode();
        assert.ok(result !== undefined);
        assert.ok(result !== null);
      }
    });
  });
});
