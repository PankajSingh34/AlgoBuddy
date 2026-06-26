// security-tests/authProxy-url.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/authProxy-url.test.cjs

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined source from src/authProxy.js
function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ── Tests ────────────────────────────────────────────────────────────

describe("isValidHttpUrl — valid URLs", () => {
  test("accepts http://localhost", () => {
    assert.equal(isValidHttpUrl("http://localhost"), true);
  });

  test("accepts http://localhost:3000", () => {
    assert.equal(isValidHttpUrl("http://localhost:3000"), true);
  });

  test("accepts http://127.0.0.1:3000", () => {
    assert.equal(isValidHttpUrl("http://127.0.0.1:3000"), true);
  });

  test("accepts https://algobuddy.me", () => {
    assert.equal(isValidHttpUrl("https://algobuddy.me"), true);
  });

  test("accepts https://www.algobuddy.me", () => {
    assert.equal(isValidHttpUrl("https://www.algobuddy.me"), true);
  });

  test("accepts https://algobuddy.me/some/path", () => {
    assert.equal(isValidHttpUrl("https://algobuddy.me/some/path"), true);
  });

  test("accepts https://algobuddy.me:443", () => {
    assert.equal(isValidHttpUrl("https://algobuddy.me:443"), true);
  });
});

describe("isValidHttpUrl — invalid URLs", () => {
  test("rejects file:// protocol", () => {
    assert.equal(isValidHttpUrl("file:///etc/passwd"), false);
  });

  test("rejects ftp:// protocol", () => {
    assert.equal(isValidHttpUrl("ftp://ftp.example.com"), false);
  });

  test("rejects javascript: protocol", () => {
    assert.equal(isValidHttpUrl("javascript:alert(1)"), false);
  });

  test("rejects data: URI", () => {
    assert.equal(isValidHttpUrl("data:text/html,<h1>"), false);
  });

  test("rejects string with no protocol", () => {
    assert.equal(isValidHttpUrl("algobuddy.me"), false);
  });

  test("rejects empty string", () => {
    assert.equal(isValidHttpUrl(""), false);
  });

  test("rejects plain text", () => {
    assert.equal(isValidHttpUrl("not a url at all"), false);
  });

  test("rejects null", () => {
    assert.equal(isValidHttpUrl(null), false);
  });

  test("rejects undefined", () => {
    assert.equal(isValidHttpUrl(undefined), false);
  });
});
