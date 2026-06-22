// security-tests/supabase.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/supabase.test.cjs
//
// Tests for src/lib/supabase.js isValidHttpUrl function.
// Inlined to avoid @/ alias resolution issues in test runner.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// ─── Inline isValidHttpUrl from src/lib/supabase.js ───────────────────────────

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ─── isValidHttpUrl tests ─────────────────────────────────────────────────────

describe('isValidHttpUrl', () => {
  test('returns true for https://example.com', () => {
    assert.strictEqual(isValidHttpUrl("https://example.com"), true);
  });

  test('returns true for http://example.com', () => {
    assert.strictEqual(isValidHttpUrl("http://example.com"), true);
  });

  test('returns true for https with port number', () => {
    assert.strictEqual(isValidHttpUrl("https://example.com:8080"), true);
  });

  test('returns true for http with port number', () => {
    assert.strictEqual(isValidHttpUrl("http://localhost:3000"), true);
  });

  test('returns true for http://127.0.0.1 with port', () => {
    assert.strictEqual(isValidHttpUrl("http://127.0.0.1:8080"), true);
  });

  test('returns true for https://localhost:3000', () => {
    assert.strictEqual(isValidHttpUrl("https://localhost:3000"), true);
  });

  test('returns true for https with subdomain', () => {
    assert.strictEqual(isValidHttpUrl("https://sub.example.com"), true);
  });

  test('returns true for https with path', () => {
    assert.strictEqual(isValidHttpUrl("https://example.com/path/to/page"), true);
  });

  test('returns true for https with query string', () => {
    assert.strictEqual(isValidHttpUrl("https://example.com?foo=bar"), true);
  });

  test('returns true for https with fragment', () => {
    assert.strictEqual(isValidHttpUrl("https://example.com#section"), true);
  });

  test('returns false for ftp:// protocol', () => {
    assert.strictEqual(isValidHttpUrl("ftp://example.com"), false);
  });

  test('returns false for file:// protocol', () => {
    assert.strictEqual(isValidHttpUrl("file:///etc/passwd"), false);
  });

  test('returns false for javascript: protocol', () => {
    assert.strictEqual(isValidHttpUrl("javascript:alert(1)"), false);
  });

  test('returns false for data: protocol', () => {
    assert.strictEqual(isValidHttpUrl("data:text/html,<h1>hello</h1>"), false);
  });

  test('returns false for mailto: protocol', () => {
    assert.strictEqual(isValidHttpUrl("mailto:user@example.com"), false);
  });

  test('returns false for empty string', () => {
    assert.strictEqual(isValidHttpUrl(""), false);
  });

  test('returns false for string with only https://', () => {
    assert.strictEqual(isValidHttpUrl("https://"), false);
  });

  test('returns false for string with only http://', () => {
    assert.strictEqual(isValidHttpUrl("http://"), false);
  });

  test('returns false for non-URL string without protocol', () => {
    assert.strictEqual(isValidHttpUrl("not a url"), false);
  });

  test('returns false for null', () => {
    assert.strictEqual(isValidHttpUrl(null), false);
  });

  test('returns false for undefined', () => {
    assert.strictEqual(isValidHttpUrl(undefined), false);
  });

  test('returns false for integer input', () => {
    assert.strictEqual(isValidHttpUrl(8080), false);
  });

  test('returns false for object input', () => {
    assert.strictEqual(isValidHttpUrl({ url: "https://example.com" }), false);
  });

  test('returns false for http with no host', () => {
    assert.strictEqual(isValidHttpUrl("http://"), false);
  });

  test('returns false for ws:// WebSocket protocol', () => {
    assert.strictEqual(isValidHttpUrl("ws://example.com"), false);
  });

  test('returns false for wss:// Secure WebSocket protocol', () => {
    assert.strictEqual(isValidHttpUrl("wss://example.com"), false);
  });
});
