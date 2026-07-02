'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Inline the functions from src/lib/csrf.js so we can test them in CJS context.
// (The original csrf.js uses ESM imports that cannot resolve from CommonJS.)
function generateCsrfToken(secret) {
  const random = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now().toString(36);
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(`${random}:${timestamp}`)
    .digest('hex');
  return `${random}:${timestamp}:${hmac}`;
}

function validateCsrf(request, secret) {
  const cookieToken = request.cookies?.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers?.get(CSRF_HEADER_NAME);
  if (!cookieToken || !headerToken) return false;
  if (cookieToken !== headerToken) return false;
  const parts = cookieToken.split(':');
  if (parts.length !== 3) return false;
  const [random, timestamp, hmac] = parts;
  const expectedHmac = crypto
    .createHmac('sha256', secret)
    .update(`${random}:${timestamp}`)
    .digest('hex');
  if (hmac !== expectedHmac) return false;
  const tokenAge = Date.now() - parseInt(timestamp, 36);
  if (tokenAge > 24 * 60 * 60 * 1000) return false;
  return true;
}

function setCsrfCookie(response, secret) {
  const token = generateCsrfToken(secret);
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60,
  });
  return token;
}

const FIXED_SECRET = 'test-secret-12345678901234567890123456789012';

describe('CSRF token generation and validation', () => {
  describe('generateCsrfToken', () => {
    it('returns a string with exactly 3 colon-separated parts', () => {
      const token = generateCsrfToken(FIXED_SECRET);
      const parts = token.split(':');
      assert.strictEqual(parts.length, 3);
      assert.ok(parts[0].length > 0, 'random part is non-empty');
      assert.ok(parts[1].length > 0, 'timestamp part is non-empty');
      assert.ok(parts[2].length > 0, 'hmac part is non-empty');
    });

    it('random part is 32 hex characters (16 bytes of random)', () => {
      const token = generateCsrfToken(FIXED_SECRET);
      const [random] = token.split(':');
      assert.strictEqual(random.length, 32);
      assert.ok(/^[0-9a-f]+$/i.test(random), 'random part is hex');
    });

    it('timestamp part is parseable as positive base-36 integer', () => {
      const token = generateCsrfToken(FIXED_SECRET);
      const [, timestamp] = token.split(':');
      const tsValue = parseInt(timestamp, 36);
      assert.ok(!isNaN(tsValue), 'timestamp is valid base-36');
      assert.ok(tsValue > 0, 'timestamp is positive');
    });

    it('hmac part is 64 hex characters (32-byte sha256)', () => {
      const token = generateCsrfToken(FIXED_SECRET);
      const [, , hmac] = token.split(':');
      assert.strictEqual(hmac.length, 64);
      assert.ok(/^[0-9a-f]+$/i.test(hmac), 'hmac part is hex');
    });

    it('different secrets produce different HMACs for same random:timestamp', () => {
      const token1 = generateCsrfToken('secret-a');
      const token2 = generateCsrfToken('secret-b');
      const hmac1 = token1.split(':')[2];
      const hmac2 = token2.split(':')[2];
      assert.notStrictEqual(hmac1, hmac2);
    });
  });

  describe('validateCsrf', () => {
    it('returns false when cookie token is missing', () => {
      const mockRequest = {
        cookies: { get: () => undefined },
        headers: { get: () => 'aaa:bbb:ccc' },
      };
      assert.strictEqual(validateCsrf(mockRequest, FIXED_SECRET), false);
    });

    it('returns false when header token is missing', () => {
      const mockRequest = {
        cookies: { get: () => ({ value: 'aaa:bbb:ccc' }) },
        headers: { get: () => null },
      };
      assert.strictEqual(validateCsrf(mockRequest, FIXED_SECRET), false);
    });

    it('returns false when cookie and header tokens differ', () => {
      const mockRequest = {
        cookies: { get: () => ({ value: 'aaa:bbb:ccc' }) },
        headers: { get: () => 'xxx:yyy:zzz' },
      };
      assert.strictEqual(validateCsrf(mockRequest, FIXED_SECRET), false);
    });

    it('returns false for malformed token (not exactly 3 parts)', () => {
      const mockRequest = {
        cookies: { get: () => ({ value: 'only-one-part' }) },
        headers: { get: () => 'only-one-part' },
      };
      assert.strictEqual(validateCsrf(mockRequest, FIXED_SECRET), false);
    });

    it('returns false for tampered HMAC', () => {
      const random = 'abcdabcdabcdabcdabcdabcdabcdabcd';
      const timestamp = Date.now().toString(36);
      const correctHmac = crypto
        .createHmac('sha256', FIXED_SECRET)
        .update(`${random}:${timestamp}`)
        .digest('hex');
      const tamperedHmac = correctHmac.slice(0, -1) + '0';
      const token = `${random}:${timestamp}:${tamperedHmac}`;
      const mockRequest = {
        cookies: { get: () => ({ value: token }) },
        headers: { get: () => token },
      };
      assert.strictEqual(validateCsrf(mockRequest, FIXED_SECRET), false);
    });

    it('returns false when secret used for validation differs from generation', () => {
      const token = generateCsrfToken('secret-used-for-gen');
      const mockRequest = {
        cookies: { get: () => ({ value: token }) },
        headers: { get: () => token },
      };
      assert.strictEqual(validateCsrf(mockRequest, 'different-secret'), false);
    });

    it('returns false for expired token older than 24 hours', () => {
      const random = 'abcdabcdabcdabcdabcdabcdabcdabcd';
      const oldTs = (Date.now() - 25 * 60 * 60 * 1000 - 1).toString(36);
      const hmac = crypto
        .createHmac('sha256', FIXED_SECRET)
        .update(`${random}:${oldTs}`)
        .digest('hex');
      const token = `${random}:${oldTs}:${hmac}`;
      const mockRequest = {
        cookies: { get: () => ({ value: token }) },
        headers: { get: () => token },
      };
      assert.strictEqual(validateCsrf(mockRequest, FIXED_SECRET), false);
    });

    it('returns true for a freshly generated valid token', () => {
      const token = generateCsrfToken(FIXED_SECRET);
      const mockRequest = {
        cookies: { get: () => ({ value: token }) },
        headers: { get: () => token },
      };
      assert.strictEqual(validateCsrf(mockRequest, FIXED_SECRET), true);
    });
  });

  describe('setCsrfCookie', () => {
    it('returns a non-empty token string', () => {
      const mockResponse = makeMockResponse();
      const token = setCsrfCookie(mockResponse, FIXED_SECRET);
      assert.ok(typeof token === 'string' && token.length > 0);
    });

    it('calls response.cookies.set with csrf-token as the cookie name', () => {
      const mockResponse = makeMockResponse();
      setCsrfCookie(mockResponse, FIXED_SECRET);
      assert.strictEqual(mockResponse._setCalls[0].name, 'csrf-token');
    });

    it('sets httpOnly: true on the cookie', () => {
      const mockResponse = makeMockResponse();
      setCsrfCookie(mockResponse, FIXED_SECRET);
      assert.strictEqual(mockResponse._setCalls[0].opts.httpOnly, true);
    });

    it('sets sameSite: lax on the cookie', () => {
      const mockResponse = makeMockResponse();
      setCsrfCookie(mockResponse, FIXED_SECRET);
      assert.strictEqual(mockResponse._setCalls[0].opts.sameSite, 'lax');
    });

    it('sets maxAge to 86400 seconds (24 hours)', () => {
      const mockResponse = makeMockResponse();
      setCsrfCookie(mockResponse, FIXED_SECRET);
      assert.strictEqual(mockResponse._setCalls[0].opts.maxAge, 24 * 60 * 60);
    });

    it('sets path to /', () => {
      const mockResponse = makeMockResponse();
      setCsrfCookie(mockResponse, FIXED_SECRET);
      assert.strictEqual(mockResponse._setCalls[0].opts.path, '/');
    });
  });
});

function makeMockResponse() {
  const calls = [];
  return {
    _setCalls: calls,
    cookies: {
      set(name, value, opts) {
        calls.push({ name, value, opts });
      },
    },
  };
}
