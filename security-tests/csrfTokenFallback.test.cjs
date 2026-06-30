// security-tests/csrfTokenFallback.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/csrfTokenFallback.test.cjs
//
// Verifies the fallback development secret stays stable across separate module instances.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

test('development fallback CSRF secret is stable across module instances', async () => {
  const modulePath = path.resolve(__dirname, '..', 'src', 'lib', 'csrfToken.js');
  const first = await import(`${pathToFileURL(modulePath).href}?instance=one`);
  const second = await import(`${pathToFileURL(modulePath).href}?instance=two`);

  const originalEnv = process.env.CSRF_SECRET;
  const originalNodeEnv = process.env.NODE_ENV;
  delete process.env.CSRF_SECRET;
  process.env.NODE_ENV = 'development';

  try {
    const token = await first.generateCsrfToken();
    assert.equal(await second.validateCsrfTokenEdge(token), true);
  } finally {
    if (originalEnv === undefined) {
      delete process.env.CSRF_SECRET;
    } else {
      process.env.CSRF_SECRET = originalEnv;
    }
    process.env.NODE_ENV = originalNodeEnv;
  }
});
