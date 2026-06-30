// security-tests/csrfOrigin.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/csrfOrigin.test.cjs
//
// Tests validateCsrfOrigin to make sure Referer fallback compares the origin only.

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

function requestWithHeaders(headers) {
  return {
    headers: {
      get(name) {
        return headers[name.toLowerCase()] ?? null;
      },
    },
  };
}

describe('validateCsrfOrigin', () => {
  test('accepts a trusted same-origin Referer with a path and query string', async () => {
    const { validateCsrfOrigin } = await import('../src/lib/csrf.js');

    const req = requestWithHeaders({
      origin: null,
      referer: 'https://algobuddy.me/practice?tab=grid',
    });

    assert.equal(validateCsrfOrigin(req), true);
  });

  test('rejects a Referer from an untrusted origin even when the path looks valid', async () => {
    const { validateCsrfOrigin } = await import('../src/lib/csrf.js');

    const req = requestWithHeaders({
      origin: null,
      referer: 'https://evil.example/practice',
    });

    assert.equal(validateCsrfOrigin(req), false);
  });

  test('prefers the Origin header when both headers are present', async () => {
    const { validateCsrfOrigin } = await import('../src/lib/csrf.js');

    const req = requestWithHeaders({
      origin: 'https://algobuddy.me',
      referer: 'https://evil.example/practice',
    });

    assert.equal(validateCsrfOrigin(req), true);
  });

  test('rejects malformed Referer values instead of treating them as trusted', async () => {
    const { validateCsrfOrigin } = await import('../src/lib/csrf.js');

    const req = requestWithHeaders({
      origin: null,
      referer: 'not-a-url',
    });

    assert.equal(validateCsrfOrigin(req), false);
  });
});
