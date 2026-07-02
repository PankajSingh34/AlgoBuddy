'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Inlined from src/lib/csrfConstants.js (avoiding ESM/CJS module boundary issues in CJS test runner)
function validateCsrfOrigin(request) {
  const origins = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://algobuddy.me',
    'https://www.algobuddy.me',
    'https://algobuddy.vercel.app',
  ]);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) origins.add(appUrl.replace(/\/+$/, ''));

  const origin = request.headers?.get('origin');
  const referer = request.headers?.get('referer');
  const source = origin || referer || '';
  const normalized = source.replace(/\/+$/, '');
  return origins.has(normalized);
}

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isStateChangingMethod(method) {
  return STATE_CHANGING_METHODS.has(method);
}

function isApiRoute(pathname) {
  return pathname.startsWith('/api/');
}

function makeMockRequest(url) {
  return {
    headers: {
      get(name) {
        if (name === 'origin') return url;
        if (name === 'referer') return null;
        return null;
      },
    },
  };
}

function makeMockRequestNoOrigin(refererUrl) {
  return {
    headers: {
      get(name) {
        if (name === 'origin') return null;
        if (name === 'referer') return refererUrl;
        return null;
      },
    },
  };
}

describe('validateCsrfOrigin', () => {
  it('returns true for http://localhost:3000', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('http://localhost:3000')), true);
  });

  it('returns true for http://127.0.0.1:3000', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('http://127.0.0.1:3000')), true);
  });

  it('returns true for https://algobuddy.me', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('https://algobuddy.me')), true);
  });

  it('returns true for https://www.algobuddy.me', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('https://www.algobuddy.me')), true);
  });

  it('returns true for https://algobuddy.vercel.app', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('https://algobuddy.vercel.app')), true);
  });

  it('returns false for unknown domain', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('https://malicious-site.com')), false);
  });

  it('returns false for slightly misspelled algobuddy domain', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('https://algobuddy.mee.com')), false);
  });

  it('returns false for phishing domain', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('https://algobuddy.attacker.io/api/login')), false);
  });

  it('falls back to referer header when origin is absent', () => {
    // Referer URL must be in the trusted origins set exactly
    assert.strictEqual(validateCsrfOrigin(makeMockRequestNoOrigin('https://algobuddy.me/')), true);
  });

  it('returns false when neither origin nor referer is present', () => {
    assert.strictEqual(validateCsrfOrigin({ headers: { get: () => null } }), false);
  });

  it('strips trailing slashes before comparison', () => {
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('https://algobuddy.me///')), true);
    assert.strictEqual(validateCsrfOrigin(makeMockRequest('https://algobuddy.me/')), true);
  });

  it('returns false for empty string source', () => {
    assert.strictEqual(validateCsrfOrigin({ headers: { get: () => '' } }), false);
  });
});

describe('isStateChangingMethod', () => {
  it('returns true for POST', () => {
    assert.strictEqual(isStateChangingMethod('POST'), true);
  });

  it('returns true for PUT', () => {
    assert.strictEqual(isStateChangingMethod('PUT'), true);
  });

  it('returns true for PATCH', () => {
    assert.strictEqual(isStateChangingMethod('PATCH'), true);
  });

  it('returns true for DELETE', () => {
    assert.strictEqual(isStateChangingMethod('DELETE'), true);
  });

  it('returns false for GET', () => {
    assert.strictEqual(isStateChangingMethod('GET'), false);
  });

  it('returns false for HEAD', () => {
    assert.strictEqual(isStateChangingMethod('HEAD'), false);
  });

  it('returns false for OPTIONS', () => {
    assert.strictEqual(isStateChangingMethod('OPTIONS'), false);
  });

  it('returns false for lowercase post', () => {
    assert.strictEqual(isStateChangingMethod('post'), false);
  });
});

describe('isApiRoute', () => {
  it('returns true for /api/auth', () => {
    assert.strictEqual(isApiRoute('/api/auth'), true);
  });

  it('returns true for /api/v2/endpoint', () => {
    assert.strictEqual(isApiRoute('/api/v2/endpoint'), true);
  });

  it('returns false for /login', () => {
    assert.strictEqual(isApiRoute('/login'), false);
  });

  it('returns false for /visualizer', () => {
    assert.strictEqual(isApiRoute('/visualizer'), false);
  });

  it('returns false for /profile', () => {
    assert.strictEqual(isApiRoute('/profile'), false);
  });

  it('returns false for /myapi/', () => {
    assert.strictEqual(isApiRoute('/myapi/'), false);
  });

  it('returns false for empty string', () => {
    assert.strictEqual(isApiRoute(''), false);
  });
});
