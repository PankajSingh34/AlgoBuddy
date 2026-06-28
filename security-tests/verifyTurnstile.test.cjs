'use strict';

// security-tests/verifyTurnstile.test.cjs
// Run with: node --experimental-detect-module --test security-tests/verifyTurnstile.test.cjs
//
// Tests verifyTurnstile from src/lib/verifyTurnstile.js.
// Logic is inlined to avoid import path issues with @/ aliases.

const { test } = require('node:test');
const assert = require('node:assert/strict');

// Inlined from src/lib/verifyTurnstile.js
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

// Tests for getCaptchaSecret
test('getCaptchaSecret: throws CAPTCHA_CONFIG_MISSING when env var is unset', () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;
  try {
    assert.throws(
      () => getCaptchaSecret(),
      { message: 'CAPTCHA_CONFIG_MISSING' }
    );
  } finally {
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
  }
});

test('getCaptchaSecret: throws CAPTCHA_CONFIG_MISSING when env var is empty string', () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = '';
  try {
    assert.throws(
      () => getCaptchaSecret(),
      { message: 'CAPTCHA_CONFIG_MISSING' }
    );
  } finally {
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
    else delete process.env.TURNSTILE_SECRET_KEY;
  }
});

test('getCaptchaSecret: returns the value when env var is set', () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
  try {
    assert.equal(getCaptchaSecret(), '1x0000000000000000000000000000000AA');
  } finally {
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
    else delete process.env.TURNSTILE_SECRET_KEY;
  }
});

// Tests for verifyTurnstile
test('verifyTurnstile: missing token returns Captcha token missing', async () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
  try {
    const result = await verifyTurnstile('');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'Captcha token missing');
    const result2 = await verifyTurnstile(null);
    assert.equal(result2.ok, false);
    assert.equal(result2.error, 'Captcha token missing');
  } finally {
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
    else delete process.env.TURNSTILE_SECRET_KEY;
  }
});

test('verifyTurnstile: valid token, ok response returns ok=true', async () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true }) });
  try {
    const result = await verifyTurnstile('valid_token');
    assert.equal(result.ok, true);
  } finally {
    globalThis.fetch = originalFetch;
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
    else delete process.env.TURNSTILE_SECRET_KEY;
  }
});

test('verifyTurnstile: expired token (timeout-or-duplicate) returns specific error', async () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
  });
  try {
    const result = await verifyTurnstile('expired_token');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'Captcha token expired or was already used. Please refresh the page.');
  } finally {
    globalThis.fetch = originalFetch;
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
    else delete process.env.TURNSTILE_SECRET_KEY;
  }
});

test('verifyTurnstile: generic failure returns generic error message', async () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
  });
  try {
    const result = await verifyTurnstile('bad_token');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'Captcha verification failed. Please try again.');
  } finally {
    globalThis.fetch = originalFetch;
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
    else delete process.env.TURNSTILE_SECRET_KEY;
  }
});

test('verifyTurnstile: network failure returns request failed error', async () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('ETIMEDOUT'); };
  try {
    const result = await verifyTurnstile('some_token');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'Captcha verification request failed');
  } finally {
    globalThis.fetch = originalFetch;
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
    else delete process.env.TURNSTILE_SECRET_KEY;
  }
});

test('verifyTurnstile: non-ok HTTP status returns request failed error', async () => {
  const prev = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 500 });
  try {
    const result = await verifyTurnstile('some_token');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'Captcha verification request failed');
  } finally {
    globalThis.fetch = originalFetch;
    if (prev !== undefined) process.env.TURNSTILE_SECRET_KEY = prev;
    else delete process.env.TURNSTILE_SECRET_KEY;
  }
});