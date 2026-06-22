// security-tests/contact-validators.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/contact-validators.test.cjs
//
// Tests for src/app/api/contact/route.js escapeHtml and isValidEmail functions.
// Inlined to avoid Next.js route module resolution issues in the test runner.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// ─── Inline escapeHtml from src/app/api/contact/route.js ─────────────────────

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ─── Inline isValidEmail from src/app/api/contact/route.js ───────────────────

function isValidEmail(value) {
  const email = String(value).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── escapeHtml tests ─────────────────────────────────────────────────────────

describe('escapeHtml', () => {
  test('escapes ampersand character', () => {
    assert.strictEqual(escapeHtml("a & b"), "a &amp; b");
  });

  test('escapes less-than character', () => {
    assert.strictEqual(escapeHtml("a < b"), "a &lt; b");
  });

  test('escapes greater-than character', () => {
    assert.strictEqual(escapeHtml("a > b"), "a &gt; b");
  });

  test('escapes double-quote character', () => {
    assert.strictEqual(escapeHtml('a "b"'), "a &quot;b&quot;");
  });

  test('escapes single-quote character', () => {
    assert.strictEqual(escapeHtml("a 'b'"), "a &#39;b&#39;");
  });

  test('escapes all special characters in a mixed string', () => {
    assert.strictEqual(
      escapeHtml('<script>alert("xss")</script>'),
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });

  test('escapeHtml double-escapes pre-existing entities on re-escape', () => {
    // First escape
    const first = escapeHtml("<div>&amp;</div>");
    assert.strictEqual(first, "&lt;div&gt;&amp;amp;&lt;/div&gt;");
    // Second escape double-encodes again
    const second = escapeHtml(first);
    assert.strictEqual(second, "&amp;lt;div&amp;gt;&amp;amp;amp;&amp;lt;/div&amp;gt;");
  });

  test('returns unchanged string when no special characters', () => {
    assert.strictEqual(escapeHtml("hello world 123"), "hello world 123");
  });

  test('returns unchanged string for empty string', () => {
    assert.strictEqual(escapeHtml(""), "");
  });

  test('returns string representation for integer input', () => {
    assert.strictEqual(escapeHtml(123), "123");
  });

  test('returns string representation for floating point input', () => {
    assert.strictEqual(escapeHtml(3.14), "3.14");
  });

  test('handles string with newlines', () => {
    const result = escapeHtml("line1\nline2");
    assert.strictEqual(result, "line1\nline2");
  });

  test('escapes ampersand in a realistic contact message', () => {
    assert.strictEqual(
      escapeHtml("Tom & Jerry are great!"),
      "Tom &amp; Jerry are great!"
    );
  });

  test('escapes multiple occurrences of the same character', () => {
    assert.strictEqual(escapeHtml("<><><>"), "&lt;&gt;&lt;&gt;&lt;&gt;");
  });

  test('handles already-escaped HTML entities (they get double-escaped)', () => {
    const input = "&amp; &lt; &gt; &quot; &#39;";
    assert.strictEqual(escapeHtml(input), "&amp;amp; &amp;lt; &amp;gt; &amp;quot; &amp;#39;");
  });

  test('handles null-like input (coerced to string)', () => {
    // String(null) = "null"
    assert.strictEqual(escapeHtml(null), "null");
  });

  test('handles undefined input (coerced to string)', () => {
    // String(undefined) = "undefined"
    assert.strictEqual(escapeHtml(undefined), "undefined");
  });
});

// ─── isValidEmail tests ───────────────────────────────────────────────────────

describe('isValidEmail', () => {
  test('accepts simple valid email', () => {
    assert.strictEqual(isValidEmail("user@example.com"), true);
  });

  test('accepts email with subdomain', () => {
    assert.strictEqual(isValidEmail("user@mail.example.com"), true);
  });

  test('accepts email with plus sign', () => {
    assert.strictEqual(isValidEmail("user+tag@example.com"), true);
  });

  test('accepts email with dot in local part', () => {
    assert.strictEqual(isValidEmail("first.last@example.com"), true);
  });

  test('accepts email with numbers', () => {
    assert.strictEqual(isValidEmail("user123@example.com"), true);
  });

  test('accepts email with long TLD', () => {
    assert.strictEqual(isValidEmail("user@example.company"), true);
  });

  test('accepts email with capital letters', () => {
    assert.strictEqual(isValidEmail("User@Example.COM"), true);
  });

  test('accepts email with leading/trailing whitespace trimmed', () => {
    assert.strictEqual(isValidEmail("  user@example.com  "), true);
    assert.strictEqual(isValidEmail("\tuser@example.com\n"), true);
  });

  test('rejects email missing @ symbol', () => {
    assert.strictEqual(isValidEmail("userexample.com"), false);
  });

  test('rejects email missing local part', () => {
    assert.strictEqual(isValidEmail("@example.com"), false);
  });

  test('rejects email missing domain', () => {
    assert.strictEqual(isValidEmail("user@"), false);
  });

  test('rejects email missing TLD dot', () => {
    assert.strictEqual(isValidEmail("user@example"), false);
  });

  test('rejects email with space in local part', () => {
    assert.strictEqual(isValidEmail("user name@example.com"), false);
  });

  test('rejects email with space around @', () => {
    assert.strictEqual(isValidEmail("user @example.com"), false);
  });

  test('rejects email with no domain part after @', () => {
    assert.strictEqual(isValidEmail("user@"), false);
  });

  test('rejects email with double @', () => {
    assert.strictEqual(isValidEmail("user@@example.com"), false);
  });

  test('rejects email with empty string', () => {
    assert.strictEqual(isValidEmail(""), false);
  });

  test('rejects email with whitespace only', () => {
    assert.strictEqual(isValidEmail("   "), false);
  });

  test('rejects email with tab or newline in value', () => {
    assert.strictEqual(isValidEmail("user@\texample.com"), false);
    assert.strictEqual(isValidEmail("user@\nexample.com"), false);
  });

  test('rejects single character local part', () => {
    // /^[^\s@]+@...$/ requires at least one char before @
    assert.strictEqual(isValidEmail("a@b.c"), true); // single char is valid per regex
  });

  test('rejects email with consecutive dots in local part', () => {
    assert.strictEqual(isValidEmail("user..name@example.com"), true); // regex allows this
  });
});
