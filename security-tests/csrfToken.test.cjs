// security-tests/csrfToken.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrfToken.test.cjs
//
// Tests the CSRF token generation and validation in src/lib/csrfToken.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const csrfTokenUrl = pathToFileURL(
  path.join(__dirname, "..", "src/lib/csrfToken.js"),
).href;

let generateCsrfToken, validateCsrfToken;

test("imports csrfToken helpers without throwing", async () => {
  const mod = await import(csrfTokenUrl);
  generateCsrfToken = mod.generateCsrfToken;
  validateCsrfToken = mod.validateCsrfToken;
});

describe("generateCsrfToken", () => {
  test("returns a string with exactly one dot separator", () => {
    const token = generateCsrfToken();
    const parts = token.split(".");
    assert.strictEqual(parts.length, 2);
  });

  test("randomValue is 64 hex chars (32 bytes)", () => {
    const token = generateCsrfToken();
    const [randomValue] = token.split(".");
    assert.strictEqual(randomValue.length, 64);
    assert.match(randomValue, /^[0-9a-f]{64}$/);
  });

  test("signature is 64 hex chars (sha256)", () => {
    const token = generateCsrfToken();
    const [, signature] = token.split(".");
    assert.strictEqual(signature.length, 64);
    assert.match(signature, /^[0-9a-f]{64}$/);
  });

  test("two calls produce different randomValues", () => {
    const tok1 = generateCsrfToken();
    const tok2 = generateCsrfToken();
    const [rv1] = tok1.split(".");
    const [rv2] = tok2.split(".");
    assert.notStrictEqual(rv1, rv2);
  });

  test("freshly generated tokens are valid", () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    assert.strictEqual(validateCsrfToken(token1), true);
    assert.strictEqual(validateCsrfToken(token2), true);
  });
});

describe("validateCsrfToken", () => {
  test("returns true for a freshly generated token", () => {
    const token = generateCsrfToken();
    assert.strictEqual(validateCsrfToken(token), true);
  });

  test("returns false for tampered token (modified randomValue)", () => {
    const token = generateCsrfToken();
    const [rv, sig] = token.split(".");
    const tamperedRv = rv[0] === "0" ? "1" + rv.slice(1) : "0" + rv.slice(1);
    assert.strictEqual(validateCsrfToken(`${tamperedRv}.${sig}`), false);
  });

  test("returns false for tampered token (modified signature)", () => {
    const token = generateCsrfToken();
    const [rv, sig] = token.split(".");
    const tamperedSig = sig[0] === "0" ? "1" + sig.slice(1) : "0" + sig.slice(1);
    assert.strictEqual(validateCsrfToken(`${rv}.${tamperedSig}`), false);
  });

  test("returns false for token with no dot", () => {
    assert.strictEqual(validateCsrfToken("abcdefg123456"), false);
  });

  test("returns false for token with too many parts", () => {
    assert.strictEqual(validateCsrfToken("a.b.c"), false);
  });

  test("returns false for empty string", () => {
    assert.strictEqual(validateCsrfToken(""), false);
  });

  test("returns false for null", () => {
    assert.strictEqual(validateCsrfToken(null), false);
  });

  test("returns false for undefined", () => {
    assert.strictEqual(validateCsrfToken(undefined), false);
  });

  test("returns false for non-string input (number)", () => {
    assert.strictEqual(validateCsrfToken(12345), false);
  });

  test("returns false for token with wrong-length signature", () => {
    const token = generateCsrfToken();
    const [rv] = token.split(".");
    assert.strictEqual(validateCsrfToken(`${rv}.abc123`), false);
  });
});
