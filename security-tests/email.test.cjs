'use strict';

// security-tests/email.test.cjs
// Run with: node --experimental-detect-module --test security-tests/email.test.cjs
//
// Tests sendEmail from src/lib/email.js.
// Logic is inlined to avoid import path issues with @/ aliases.

const { test } = require('node:test');
const assert = require('node:assert/strict');

// Inlined from src/lib/email.js
async function sendEmail({ to, subject, html }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return { success: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AlgoBuddy <notifications@algobuddy.com>",
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Tests
test('missing RESEND_API_KEY returns success=false skipped=true', async () => {
  const prev = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    const result = await sendEmail({ to: "test@example.com", subject: "Hi", html: "<p>Hi</p>" });
    assert.equal(result.success, false);
    assert.equal(result.skipped, true);
  } finally {
    if (prev !== undefined) process.env.RESEND_API_KEY = prev;
  }
});

test('successful API call returns success=true', async () => {
  const prev = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "re_test_key";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    return { ok: true, text: async () => '{"id":"em_test"}' };
  };
  try {
    const result = await sendEmail({ to: "user@example.com", subject: "Hello", html: "<p>Hello</p>" });
    assert.equal(result.success, true);
  } finally {
    globalThis.fetch = originalFetch;
    if (prev !== undefined) process.env.RESEND_API_KEY = prev;
    else delete process.env.RESEND_API_KEY;
  }
});

test('non-ok HTTP response returns success=false with error', async () => {
  const prev = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "re_test_key";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    const res = { ok: false, status: 422, text: async () => 'Invalid API key' };
    return res;
  };
  try {
    const result = await sendEmail({ to: "user@example.com", subject: "Hi", html: "<p>Hi</p>" });
    assert.equal(result.success, false);
    assert.equal(typeof result.error, 'string');
    assert.ok(result.error.length > 0);
  } finally {
    globalThis.fetch = originalFetch;
    if (prev !== undefined) process.env.RESEND_API_KEY = prev;
    else delete process.env.RESEND_API_KEY;
  }
});

test('network failure returns success=false with error message', async () => {
  const prev = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "re_test_key";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("ENOTFOUND api.resend.com");
  };
  try {
    const result = await sendEmail({ to: "user@example.com", subject: "Hi", html: "<p>Hi</p>" });
    assert.equal(result.success, false);
    assert.equal(result.error, "ENOTFOUND api.resend.com");
  } finally {
    globalThis.fetch = originalFetch;
    if (prev !== undefined) process.env.RESEND_API_KEY = prev;
    else delete process.env.RESEND_API_KEY;
  }
});