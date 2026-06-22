// security-tests/csrf-token.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrf-token.test.cjs
//
// Tests the CSRF token generation and HMAC-SHA256 validation logic.
// Source functions are inlined verbatim from src/lib/csrfToken.js.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET_ENV = 'CSRF_SECRET';

let devSecret = null;

function getSecret() {
  const secret = process.env[CSRF_SECRET_ENV];
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'CSRF_SECRET must be set in production for CSRF token signing.',
    );
  }
  if (!devSecret) {
    devSecret = crypto.randomBytes(32).toString('hex');
  }
  return devSecret;
}

function generateCsrfToken() {
  const secret = getSecret();
  const randomValue = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(randomValue);
  const signature = hmac.digest('hex');
  return `${randomValue}.${signature}`;
}

function validateCsrfToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [randomValue, signature] = parts;
  const secret = getSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(randomValue);
  const expected = hmac.digest('hex');
  if (signature.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

describe('generateCsrfToken', () => {
  test('returns a string', () => {
    const token = generateCsrfToken();
    assert.strictEqual(typeof token, 'string');
  });

  test('output contains exactly one dot separator', () => {
    const token = generateCsrfToken();
    const parts = token.split('.');
    assert.strictEqual(parts.length, 2);
  });

  test('randomValue part is 64 hex characters (CSRF_TOKEN_LENGTH * 2)', () => {
    const token = generateCsrfToken();
    const [randomValue] = token.split('.');
    assert.strictEqual(randomValue.length, CSRF_TOKEN_LENGTH * 2);
    assert.ok(/^[0-9a-f]+$/i.test(randomValue));
  });

  test('signature part is 64 hex characters (sha256 output)', () => {
    const token = generateCsrfToken();
    const [, signature] = token.split('.');
    assert.strictEqual(signature.length, 64);
    assert.ok(/^[0-9a-f]+$/i.test(signature));
  });

  test('each call returns a unique randomValue', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    const [r1] = token1.split('.');
    const [r2] = token2.split('.');
    assert.notStrictEqual(r1, r2);
  });
});

describe('validateCsrfToken — valid tokens', () => {
  test('returns true for a token generated in the same process', () => {
    const token = generateCsrfToken();
    assert.strictEqual(validateCsrfToken(token), true);
  });

  test('returns true for multiple tokens generated in sequence', () => {
    for (let i = 0; i < 5; i++) {
      const token = generateCsrfToken();
      assert.strictEqual(validateCsrfToken(token), true, `Token ${i} should be valid`);
    }
  });
});

describe('validateCsrfToken — invalid inputs', () => {
  test('returns false for null', () => {
    assert.strictEqual(validateCsrfToken(null), false);
  });

  test('returns false for undefined', () => {
    assert.strictEqual(validateCsrfToken(undefined), false);
  });

  test('returns false for empty string', () => {
    assert.strictEqual(validateCsrfToken(''), false);
  });

  test('returns false for a non-string value (number)', () => {
    assert.strictEqual(validateCsrfToken(12345), false);
  });

  test('returns false for a non-string value (object)', () => {
    assert.strictEqual(validateCsrfToken({ foo: 'bar' }), false);
  });
});

describe('validateCsrfToken — malformed tokens', () => {
  test('returns false for token with no dot', () => {
    const token = generateCsrfToken().replace('.', '');
    assert.strictEqual(validateCsrfToken(token), false);
  });

  test('returns false for token with extra dots', () => {
    const token = generateCsrfToken() + '.extra';
    assert.strictEqual(validateCsrfToken(token), false);
  });

  test('returns false for token with empty randomValue', () => {
    const [, sig] = generateCsrfToken().split('.');
    assert.strictEqual(validateCsrfToken(`.${sig}`), false);
  });

  test('returns false for token with empty signature', () => {
    const [rand] = generateCsrfToken().split('.');
    assert.strictEqual(validateCsrfToken(`${rand}.`), false);
  });
});

describe('validateCsrfToken — tampered tokens', () => {
  test('returns false for a token with a tampered signature', () => {
    const [rand, sig] = generateCsrfToken().split('.');
    // Flip the last character of the signature
    const tampered = tamperedHex(sig);
    assert.strictEqual(validateCsrfToken(`${rand}.${tampered}`), false);
  });

  test('returns false for a token with a tampered randomValue', () => {
    const [rand, sig] = generateCsrfToken().split('.');
    const tampered = tamperedHex(rand);
    assert.strictEqual(validateCsrfToken(`${tampered}.${sig}`), false);
  });

  test('returns false for a token with a short (invalid length) signature', () => {
    const [rand] = generateCsrfToken().split('.');
    assert.strictEqual(validateCsrfToken(`${rand}.abc123`), false);
  });

  test('returns false for a token with a long (invalid length) signature', () => {
    const [rand] = generateCsrfToken().split('.');
    const longSig = 'a'.repeat(100);
    assert.strictEqual(validateCsrfToken(`${rand}.${longSig}`), false);
  });
});

// Helper: flip one hex character to a different valid hex character
function tamperedHex(hex) {
  const flip = { '0': '1', '1': '0', '2': '3', '3': '2', '4': '5', '5': '4',
    '6': '7', '7': '6', '8': '9', '9': '8', 'a': 'b', 'b': 'a',
    'c': 'd', 'd': 'c', 'e': 'f', 'f': 'e' };
  if (hex.length === 0) return hex;
  const chars = hex.split('');
  const pos = Math.floor(chars.length / 2);
  chars[pos] = flip[chars[pos]] || '1';
  return chars.join('');
}
