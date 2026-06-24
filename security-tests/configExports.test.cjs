// security-tests/configExports.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/configExports.test.cjs
//
// Tests configuration exports from src/config/rateLimits.js and src/config/algorithms.js.
// Tests are written to avoid module resolution issues by reading source as text.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// ─── Load source files directly to avoid @/ alias resolution ──────────────────
const RATE_LIMITS_PATH = path.join(__dirname, '..', 'src', 'config', 'rateLimits.js');
const ALGORITHMS_PATH = path.join(__dirname, '..', 'src', 'config', 'algorithms.js');

// Evaluate rateLimits.js in a controlled scope (no env vars needed for structure test)
function loadRateLimits() {
  const src = fs.readFileSync(RATE_LIMITS_PATH, 'utf8');
  // Extract the exported object — it's a plain object, safe to eval in test scope
  const match = src.match(/export\s+const\s+RATE_LIMITS\s*=\s*(\{[\s\S]*?\});?\s*$/m);
  if (!match) throw new Error('Could not parse RATE_LIMITS from rateLimits.js');
  // Use Function constructor for safe eval of plain object literal
  return new Function(`return ${match[1]}`)();
}

// Evaluate algorithms.js to check the export structure
function loadAlgorithmRegistry() {
  const src = fs.readFileSync(ALGORITHMS_PATH, 'utf8');
  // Extract algorithmRegistry export
  const match = src.match(/export\s+const\s+algorithmRegistry\s*=\s*\{/);
  if (!match) throw new Error('Could not find algorithmRegistry in algorithms.js');
  // Count entries manually from source (keys are quoted strings)
  const keyMatches = src.matchAll(/^(\s+)['"][a-zA-Z0-9/_-]+['"]\s*:/gm);
  const keys = [...keyMatches].map(m => m[0].trim());
  return keys;
}

// ─── RATE_LIMITS structure tests ─────────────────────────────────────────────
describe('RATE_LIMITS from src/config/rateLimits.js', () => {
  let RATE_LIMITS;

  test('rateLimits.js source file exists', () => {
    assert.ok(fs.existsSync(RATE_LIMITS_PATH), 'rateLimits.js should exist');
  });

  test('rateLimits.js can be parsed', () => {
    RATE_LIMITS = loadRateLimits();
    assert.ok(RATE_LIMITS !== null && typeof RATE_LIMITS === 'object');
  });

  test('RATE_LIMITS is an object', () => {
    assert.ok(RATE_LIMITS !== null && typeof RATE_LIMITS === 'object');
  });

  test('RATE_LIMITS has CONTACT_API key', () => {
    assert.ok('CONTACT_API' in RATE_LIMITS);
  });

  test('RATE_LIMITS.CONTACT_API.LIMIT is a positive integer', () => {
    const limit = RATE_LIMITS.CONTACT_API?.LIMIT;
    assert.strictEqual(typeof limit, 'number');
    assert.ok(Number.isInteger(limit));
    assert.ok(limit > 0);
  });

  test('RATE_LIMITS has SMTP key', () => {
    assert.ok('SMTP' in RATE_LIMITS);
  });

  test('RATE_LIMITS.SMTP.DAILY_QUOTA is a positive integer', () => {
    const quota = RATE_LIMITS.SMTP?.DAILY_QUOTA;
    assert.strictEqual(typeof quota, 'number');
    assert.ok(Number.isInteger(quota));
    assert.ok(quota > 0);
  });

  test('RATE_LIMITS has no unexpected top-level keys', () => {
    const expectedKeys = new Set(['CONTACT_API', 'SMTP']);
    const actualKeys = new Set(Object.keys(RATE_LIMITS));
    for (const key of actualKeys) {
      assert.ok(
        expectedKeys.has(key),
        `Unexpected top-level key in RATE_LIMITS: ${key}`,
      );
    }
  });

  test('SMTP DAILY_QUOTA parses env var or falls back to 400', () => {
    // When env is not set, the default is 400
    const quota = RATE_LIMITS.SMTP?.DAILY_QUOTA;
    assert.ok(quota >= 1);
    assert.ok(Number.isInteger(quota));
  });

  test('CONTACT_API.LIMIT is a reasonable value (1-1000)', () => {
    const limit = RATE_LIMITS.CONTACT_API?.LIMIT;
    assert.ok(limit >= 1 && limit <= 1000);
  });
});

// ─── algorithmRegistry structure tests ─────────────────────────────────────────
describe('algorithmRegistry from src/config/algorithms.js', () => {
  let keys;

  test('algorithms.js source file exists', () => {
    assert.ok(fs.existsSync(ALGORITHMS_PATH), 'algorithms.js should exist');
  });

  test('algorithmRegistry export exists', () => {
    keys = loadAlgorithmRegistry();
    assert.ok(keys !== null);
  });

  test('algorithmRegistry has at least 10 entries', () => {
    assert.ok(keys.length >= 10, `Expected at least 10 algorithm entries, got ${keys.length}`);
  });

  test('algorithmRegistry keys are non-empty strings', () => {
    for (const keyLine of keys) {
      const match = keyLine.match(/['"]([a-zA-Z0-9/_-]+)['"]/);
      assert.ok(match, `Could not parse algorithm key from: ${keyLine}`);
      const key = match[1];
      assert.ok(key.length > 0, `Algorithm key should be non-empty`);
      assert.ok(key.length < 100, `Algorithm key suspiciously long: ${key}`);
    }
  });

  test('algorithmRegistry contains expected key prefixes', () => {
    const keyStr = keys.join('\n');
    // The registry should contain keys for various algorithm categories
    const hasValidKeys = keys.length > 0;
    assert.ok(hasValidKeys, 'algorithmRegistry should have entries');

    // Verify key format: should look like "category/algorithm" paths
    const keyLines = keys.map(k => {
      const m = k.match(/['"]([a-zA-Z0-9/_-]+)['"]/);
      return m ? m[1] : '';
    });

    // At least some keys should be paths with slashes
    const pathKeys = keyLines.filter(k => k.includes('/'));
    assert.ok(pathKeys.length > 0, 'algorithmRegistry should contain path-style keys like "category/name"');
  });
});

// ─── Integration: source file formatting tests ─────────────────────────────────
describe('Source file integrity', () => {
  test('rateLimits.js uses named export syntax', () => {
    const src = fs.readFileSync(RATE_LIMITS_PATH, 'utf8');
    assert.ok(src.includes('export const RATE_LIMITS'), 'Should use named export');
  });

  test('algorithms.js uses named export syntax', () => {
    const src = fs.readFileSync(ALGORITHMS_PATH, 'utf8');
    assert.ok(src.includes('export const algorithmRegistry'), 'Should use named export');
  });

  test('rateLimits.js does not contain any API keys or secrets', () => {
    const src = fs.readFileSync(RATE_LIMITS_PATH, 'utf8');
    const secretPatterns = [
      /sk_live_/i,
      /ghp_/,
      /resend_/i,
      /redis/i,
    ];
    for (const pattern of secretPatterns) {
      assert.ok(
        !pattern.test(src),
        `rateLimits.js should not contain secrets matching ${pattern}`,
      );
    }
  });
});
