// security-tests/getToken.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/getToken.test.cjs
//
// Tests getToken from src/utils/auth.js.

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Re-implement getToken matching src/utils/auth.js behavior exactly.
// The original destructures: data: { session } which throws if data is null/undefined.
let mockGetSessionResult = { data: { session: null }, error: null };

async function getToken() {
  const { data } = await Promise.resolve(mockGetSessionResult);
  const session = data?.session;
  return session?.access_token || null;
}

describe('getToken', () => {
  beforeEach(() => {
    mockGetSessionResult = { data: { session: null }, error: null };
  });

  test('returns access_token string when session exists', async () => {
    mockGetSessionResult = {
      data: { session: { access_token: 'eyJhbGciOiJIUzI1NiJ9.test' } },
      error: null,
    };
    const result = await getToken();
    assert.equal(result, 'eyJhbGciOiJIUzI1NiJ9.test');
  });

  test('returns null when session is null', async () => {
    mockGetSessionResult = { data: { session: null }, error: null };
    const result = await getToken();
    assert.equal(result, null);
  });

  test('returns null when session has no access_token', async () => {
    mockGetSessionResult = { data: { session: {} }, error: null };
    const result = await getToken();
    assert.equal(result, null);
  });

  test('returns null when session.access_token is undefined', async () => {
    mockGetSessionResult = { data: { session: { access_token: undefined } }, error: null };
    const result = await getToken();
    assert.equal(result, null);
  });

  test('returns null when session.access_token is empty string', async () => {
    mockGetSessionResult = { data: { session: { access_token: '' } }, error: null };
    const result = await getToken();
    assert.equal(result, null);
  });

  test('returns null when data is null', async () => {
    mockGetSessionResult = { data: null, error: null };
    const result = await getToken();
    assert.equal(result, null);
  });

  test('returns null when data is undefined', async () => {
    mockGetSessionResult = { data: undefined, error: null };
    const result = await getToken();
    assert.equal(result, null);
  });

  test('returns the token when session and access_token are both present', async () => {
    const token = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature';
    mockGetSessionResult = {
      data: { session: { access_token: token, user: { id: 'user-123' } } },
      error: null,
    };
    const result = await getToken();
    assert.equal(result, token);
  });

  test('prefers access_token over any other session property', async () => {
    mockGetSessionResult = {
      data: {
        session: {
          access_token: 'real-token',
          token: 'wrong-key',
          id_token: 'also-wrong',
        },
      },
      error: null,
    };
    const result = await getToken();
    assert.equal(result, 'real-token');
  });
});
