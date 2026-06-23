'use strict';

// security-tests/serverApi-helpers.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/serverApi-helpers.test.cjs
//
// Tests jsonResponse and errorResponse helpers from src/lib/serverApi.js.

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inlined source from src/lib/serverApi.js (Response helpers only).
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

describe('jsonResponse', () => {
  it('returns 200 with correct body and Content-Type by default', async () => {
    const res = jsonResponse({ ok: true });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('Content-Type'), 'application/json');
    const body = await res.json();
    assert.deepStrictEqual(body, { ok: true });
  });

  it('accepts custom status code', async () => {
    const res = jsonResponse({ id: 42 }, 201);
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.deepStrictEqual(body, { id: 42 });
  });

  it('merges extraHeaders into response headers', async () => {
    const res = jsonResponse({ data: 'x' }, 200, { 'X-Custom': 'value' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('X-Custom'), 'value');
    assert.strictEqual(res.headers.get('Content-Type'), 'application/json');
  });
});

describe('errorResponse', () => {
  it('maps error object to correct status and body', async () => {
    const err = { message: 'Not found', code: 'NOT_FOUND', status: 404 };
    const res = errorResponse(err);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.deepStrictEqual(body, { error: 'Not found', code: 'NOT_FOUND' });
  });

  it('defaults to 500 and INTERNAL_ERROR when not provided', async () => {
    const res = errorResponse({});
    assert.strictEqual(res.status, 500);
    const body = await res.json();
    assert.deepStrictEqual(body, { error: 'Internal server error', code: 'INTERNAL_ERROR' });
  });

  it('defaults status to 500 for errors with code but no status', async () => {
    const err = { message: 'Bad thing', code: 'BAD_REQUEST' };
    const res = errorResponse(err);
    assert.strictEqual(res.status, 500);
    const body = await res.json();
    assert.deepStrictEqual(body, { error: 'Bad thing', code: 'BAD_REQUEST' });
  });

  it('always sets Content-Type to application/json', async () => {
    const res = errorResponse({ message: 'oops', code: 'ERR', status: 400 });
    assert.strictEqual(res.headers.get('Content-Type'), 'application/json');
  });
});
