'use strict';

// security-tests/turnstile-verify.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/turnstile-verify.test.cjs
//
// Tests verifyTurnstile in src/lib/verifyTurnstile.js.

const { describe, it, beforeEach, mock } = require('node:test');
const assert = require('node:assert/strict');

// Inlined source from src/lib/verifyTurnstile.js (no DOM dependencies).
function getCaptchaSecret() {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || secret === 'undefined') {
    throw new Error('CAPTCHA_CONFIG_MISSING');
  }
  return secret;
}

async function verifyTurnstile(captchaToken, opts = {}) {
  const secretKey = getCaptchaSecret();

  const token = String(captchaToken || '').trim();
  if (!token) {
    return { ok: false, error: 'Captcha token missing' };
  }

  const ip = String(opts.ip || '').trim();

  let response;
  try {
    response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        ...(ip && ip !== 'unknown' ? { remoteip: ip } : {}),
      }),
    });
  } catch {
    return { ok: false, error: 'Captcha verification request failed' };
  }

  if (!response.ok) {
    return { ok: false, error: 'Captcha verification request failed' };
  }

  const data = await response.json().catch(() => null);

  if (!data?.success) {
    const errorCodes = data?.['error-codes'] || [];
    if (errorCodes.includes('timeout-or-duplicate')) {
      return { ok: false, error: 'Captcha token expired or was already used. Please refresh the page.' };
    }
    return { ok: false, error: 'Captcha verification failed. Please try again.' };
  }

  return { ok: true };
}

// Mock fetch and process.env for the test suite.
let fetchMock;

beforeEach(() => {
  process.env.TURNSTILE_SECRET_KEY = 'test-secret-key';
  fetchMock = null;
});

describe('verifyTurnstile', () => {
  it('rejects empty token string', async () => {
    const result = await verifyTurnstile('');
    assert.deepStrictEqual(result, { ok: false, error: 'Captcha token missing' });
  });

  it('rejects whitespace-only token', async () => {
    const result = await verifyTurnstile('   ');
    assert.deepStrictEqual(result, { ok: false, error: 'Captcha token missing' });
  });

  it('returns network error when fetch throws', async () => {
    // Intercept fetch to throw.
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error('network down');
    };

    const result = await verifyTurnstile('valid-token');
    assert.deepStrictEqual(result, { ok: false, error: 'Captcha verification request failed' });

    globalThis.fetch = originalFetch;
  });

  it('returns network error when fetch returns non-ok status', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response('', { status: 502 });

    const result = await verifyTurnstile('valid-token');
    assert.deepStrictEqual(result, { ok: false, error: 'Captcha verification request failed' });

    globalThis.fetch = originalFetch;
  });

  it('returns expired-token message for timeout-or-duplicate error code', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: false, 'error-codes': ['timeout-or-duplicate'] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const result = await verifyTurnstile('expired-token');
    assert.deepStrictEqual(result, {
      ok: false,
      error: 'Captcha token expired or was already used. Please refresh the page.',
    });

    globalThis.fetch = originalFetch;
  });

  it('returns generic failure message for other error codes', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const result = await verifyTurnstile('bad-token');
    assert.deepStrictEqual(result, {
      ok: false,
      error: 'Captcha verification failed. Please try again.',
    });

    globalThis.fetch = originalFetch;
  });

  it('returns ok true on successful verification', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const result = await verifyTurnstile('valid-turnstile-token');
    assert.deepStrictEqual(result, { ok: true });

    globalThis.fetch = originalFetch;
  });
});

describe('getCaptchaSecret', () => {
  it('throws CAPTCHA_CONFIG_MISSING when env var is unset', () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    assert.throws(() => getCaptchaSecret(), { message: 'CAPTCHA_CONFIG_MISSING' });
  });

  it('throws CAPTCHA_CONFIG_MISSING when env var is undefined string', () => {
    process.env.TURNSTILE_SECRET_KEY = 'undefined';
    assert.throws(() => getCaptchaSecret(), { message: 'CAPTCHA_CONFIG_MISSING' });
  });

  it('returns secret when env var is set', () => {
    process.env.TURNSTILE_SECRET_KEY = 'my-secret';
    assert.strictEqual(getCaptchaSecret(), 'my-secret');
  });
});
