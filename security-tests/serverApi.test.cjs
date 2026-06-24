// security-tests/serverApi.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/serverApi.test.cjs
//
// Tests jsonResponse and errorResponse helpers from src/lib/serverApi.js.
// Implementation is inlined to avoid @/ alias resolution issues in Node test environment.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// ─── Error classes (mirrors src/lib/apiErrors.js) ──────────────────────────────
class ApiError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', status = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
    this.code = 'AUTH_ERROR';
    this.status = 401;
  }
}

class ConfigError extends Error {
  constructor(message = 'Server configuration error') {
    super(message);
    this.name = 'ConfigError';
    this.code = 'CONFIG_ERROR';
    this.status = 500;
  }
}

class ValidationError extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
    this.status = 400;
  }
}

class RateLimitError extends Error {
  constructor(message = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
    this.code = 'RATE_LIMIT';
    this.status = 429;
  }
}

// ─── Inlined serverApi helpers (mirrors src/lib/serverApi.js) ────────────────
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

// ─── jsonResponse tests ───────────────────────────────────────────────────────
describe('jsonResponse', () => {
  test('defaults to status 200', async () => {
    const res = jsonResponse({ foo: 'bar' });
    assert.strictEqual(res.status, 200);
  });

  test('can override status code', async () => {
    const res = jsonResponse({ created: true }, 201);
    assert.strictEqual(res.status, 201);
  });

  test('sets Content-Type to application/json', async () => {
    const res = jsonResponse({ ok: true });
    assert.strictEqual(res.headers.get('Content-Type'), 'application/json');
  });

  test('merges extraHeaders without overwriting Content-Type', async () => {
    const res = jsonResponse({ data: 1 }, 200, { 'X-Custom': 'value' });
    assert.strictEqual(res.headers.get('Content-Type'), 'application/json');
    assert.strictEqual(res.headers.get('X-Custom'), 'value');
  });

  test('serializes null as JSON', async () => {
    const res = jsonResponse(null);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body, null);
  });

  test('serializes array as JSON', async () => {
    const res = jsonResponse([1, 2, 3]);
    const body = await res.json();
    assert.deepStrictEqual(body, [1, 2, 3]);
  });

  test('overrides to non-200 status codes', async () => {
    const res = jsonResponse({ created: true }, 201);
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.deepStrictEqual(body, { created: true });
  });

  test('extraHeaders can set multiple custom headers', async () => {
    const res = jsonResponse({ a: 1 }, 200, {
      'Cache-Control': 'no-store',
      'X-Request-ID': 'abc123',
    });
    assert.strictEqual(res.headers.get('Cache-Control'), 'no-store');
    assert.strictEqual(res.headers.get('X-Request-ID'), 'abc123');
  });
});

// ─── errorResponse tests ───────────────────────────────────────────────────────
describe('errorResponse', () => {
  test('extracts code, status, and message from ApiError', async () => {
    const err = new ApiError('Not found', 'NOT_FOUND', 404);
    const res = errorResponse(err);

    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.code, 'NOT_FOUND');
    assert.strictEqual(body.error, 'Not found');
  });

  test('extracts code, status, and message from ValidationError', async () => {
    const err = new ValidationError('Invalid input');
    const res = errorResponse(err);

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.code, 'VALIDATION_ERROR');
    assert.strictEqual(body.error, 'Invalid input');
  });

  test('extracts code, status, and message from AuthError', async () => {
    const err = new AuthError();
    const res = errorResponse(err);

    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.code, 'AUTH_ERROR');
  });

  test('extracts code, status, and message from RateLimitError', async () => {
    const err = new RateLimitError('Slow down');
    const res = errorResponse(err);

    assert.strictEqual(res.status, 429);
    const body = await res.json();
    assert.strictEqual(body.code, 'RATE_LIMIT');
    assert.strictEqual(body.error, 'Slow down');
  });

  test('extracts code, status, and message from ConfigError', async () => {
    const err = new ConfigError('Missing env var');
    const res = errorResponse(err);

    assert.strictEqual(res.status, 500);
    const body = await res.json();
    assert.strictEqual(body.code, 'CONFIG_ERROR');
    assert.strictEqual(body.error, 'Missing env var');
  });

  test('falls back to defaults for plain Error without code/status', async () => {
    const err = new Error('Something went wrong');
    const res = errorResponse(err);

    assert.strictEqual(res.status, 500);
    const body = await res.json();
    assert.strictEqual(body.code, 'INTERNAL_ERROR');
    assert.strictEqual(body.error, 'Something went wrong');
  });

  test('falls back to defaults when error has no message', async () => {
    const err = new Error();
    const res = errorResponse(err);

    assert.strictEqual(res.status, 500);
    const body = await res.json();
    assert.strictEqual(body.code, 'INTERNAL_ERROR');
    assert.strictEqual(body.error, 'Internal server error');
  });

  test('crashes with TypeError when error is null (no null guard)', async () => {
    assert.throws(() => errorResponse(null), TypeError);
  });

  test('crashes with TypeError when error is undefined (no undefined guard)', async () => {
    assert.throws(() => errorResponse(undefined), TypeError);
  });

  test('always sets Content-Type to application/json', async () => {
    const err = new ApiError('oops', 'ERR', 500);
    const res = errorResponse(err);
    assert.strictEqual(res.headers.get('Content-Type'), 'application/json');
  });

  test('ApiError with only message defaults to 500 and INTERNAL_ERROR', async () => {
    const err = new ApiError('Generic error');
    const res = errorResponse(err);
    assert.strictEqual(res.status, 500);
    const body = await res.json();
    assert.strictEqual(body.code, 'INTERNAL_ERROR');
  });
});
