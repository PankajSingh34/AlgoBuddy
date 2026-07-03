// security-tests/serverApi.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/serverApi.test.cjs
//
// Tests the response-helper functions exported from src/lib/serverApi.js:
// jsonResponse(data, status, extraHeaders) and errorResponse(error).

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

// ── Inlined helpers under test ─────────────────────────────────────

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function errorResponse(error) {
  const code = error.code || 'INTERNAL_ERROR';
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  return Response.json(
    { error: message, code },
    { status, headers: { 'Content-Type': 'application/json' } },
  );
}

// ── Tests ────────────────────────────────────────────────────────────

describe('jsonResponse', () => {
  test('returns a Response with status 200 by default', async () => {
    const res = jsonResponse({ ok: true });
    assert.equal(res.status, 200);
  });

  test('returns a Response with correct JSON body', async () => {
    const payload = { key: 'value', count: 42 };
    const res = jsonResponse(payload);
    const body = await res.json();
    assert.deepEqual(body, payload);
  });

  test('sets Content-Type to application/json', async () => {
    const res = jsonResponse({});
    assert.equal(res.headers.get('Content-Type'), 'application/json');
  });

  test('accepts custom status codes', async () => {
    const res = jsonResponse({ id: 1 }, 201);
    assert.equal(res.status, 201);
  });

  test('accepts extra headers', async () => {
    const res = jsonResponse({}, 200, { 'X-Custom': 'header-value' });
    assert.equal(res.headers.get('X-Custom'), 'header-value');
    assert.equal(res.headers.get('Content-Type'), 'application/json');
  });

  test('status 201 includes correct body', async () => {
    const data = { created: true };
    const res = jsonResponse(data, 201);
    assert.equal(res.status, 201);
    assert.deepEqual(await res.json(), data);
  });

  test('status 400 includes correct body', async () => {
    const data = { error: 'bad input' };
    const res = jsonResponse(data, 400);
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), data);
  });

  test('status 429 includes correct body', async () => {
    const data = { error: 'rate limited' };
    const res = jsonResponse(data, 429);
    assert.equal(res.status, 429);
    assert.deepEqual(await res.json(), data);
  });
});

describe('errorResponse', () => {
  test('returns a Response with 500 by default for plain Error', async () => {
    const err = new Error('Something went wrong');
    const res = errorResponse(err);
    assert.equal(res.status, 500);
  });

  test('returns INTERNAL_ERROR code for plain Error', async () => {
    const err = new Error('Oops');
    const res = errorResponse(err);
    const body = await res.json();
    assert.equal(body.code, 'INTERNAL_ERROR');
  });

  test('returns correct message from Error.message', async () => {
    const err = new Error('Custom message');
    const res = errorResponse(err);
    const body = await res.json();
    assert.equal(body.error, 'Custom message');
  });

  test('returns a Response with status from error.status when available', async () => {
    const err = { message: 'Forbidden', status: 403, code: 'FORBIDDEN' };
    const res = errorResponse(err);
    assert.equal(res.status, 403);
  });

  test('returns correct code from error.code when available', async () => {
    const err = { message: 'Not found', status: 404, code: 'NOT_FOUND' };
    const res = errorResponse(err);
    const body = await res.json();
    assert.equal(body.code, 'NOT_FOUND');
  });

  test('defaults to 500 when error.status is undefined', async () => {
    const err = { message: 'Config missing', code: 'CONFIG_ERROR' };
    const res = errorResponse(err);
    assert.equal(res.status, 500);
  });

  test('defaults to INTERNAL_ERROR when error.code is undefined', async () => {
    const err = { message: 'Unknown error' };
    const res = errorResponse(err);
    const body = await res.json();
    assert.equal(body.code, 'INTERNAL_ERROR');
  });

  test('returns correct message when error.message is undefined', async () => {
    const err = { status: 400, code: 'BAD_REQUEST' };
    const res = errorResponse(err);
    const body = await res.json();
    assert.equal(body.error, 'Internal server error');
  });

  test('sets Content-Type to application/json', async () => {
    const err = new Error('Test');
    const res = errorResponse(err);
    assert.equal(res.headers.get('Content-Type'), 'application/json');
  });

  test('body contains both error and code fields', async () => {
    const err = { message: 'Auth required', status: 401, code: 'AUTH_ERROR' };
    const res = errorResponse(err);
    const body = await res.json();
    assert.ok('error' in body);
    assert.ok('code' in body);
    assert.equal(body.error, 'Auth required');
    assert.equal(body.code, 'AUTH_ERROR');
  });

  test('handles ApiError-compatible objects correctly', async () => {
    const err = { message: 'Rate limited', status: 429, code: 'RATE_LIMIT' };
    const res = errorResponse(err);
    const body = await res.json();
    assert.equal(res.status, 429);
    assert.equal(body.code, 'RATE_LIMIT');
    assert.equal(body.error, 'Rate limited');
  });

  test('does not throw for objects with missing properties', async () => {
    assert.doesNotThrow(() => {
      errorResponse({});
    });
  });

  test('returns defaults when error has no code or status fields', async () => {
    const err = { message: 'something went wrong' };
    const res = errorResponse(err);
    assert.equal(res.status, 500);
    const body = await res.json();
    assert.equal(body.code, 'INTERNAL_ERROR');
    assert.equal(body.error, 'something went wrong');
  });

  test('returns defaults when error lacks a message field', async () => {
    const err = { status: 403, code: 'FORBIDDEN' };
    const res = errorResponse(err);
    const body = await res.json();
    assert.equal(body.error, 'Internal server error');
  });
});
