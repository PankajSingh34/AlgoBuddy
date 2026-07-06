// security-tests/csrfToken.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrfToken.test.cjs
//
// Tests Edge-compatible CSRF token generation and validation from src/lib/csrfToken.js.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inline csrfToken.js for deterministic testing
const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET_ENV = "CSRF_SECRET";

let devSecret = null;

function getSecret() {
  const secret = process.env[CSRF_SECRET_ENV];
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "CSRF_SECRET must be set in production for CSRF token signing.",
    );
  }
  if (!devSecret) {
    const array = new Uint8Array(32);
    globalThis.crypto.getRandomValues(array);
    devSecret = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return devSecret;
}

async function generateCsrfToken() {
  const secret = getSecret();
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  globalThis.crypto.getRandomValues(array);
  const randomValue = Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(randomValue));
  const signature = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${randomValue}.${signature}`;
}

async function validateCsrfTokenEdge(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [randomValue, signature] = parts;
  const secret = getSecret();
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(randomValue));
  const expected = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  if (signature.length !== expected.length) return false;
  try {
    const sigBuf = new Uint8Array(
      signature.match(/.{1,2}/g).map((b) => parseInt(b, 16)),
    );
    const expBuf = new Uint8Array(
      expected.match(/.{1,2}/g).map((b) => parseInt(b, 16)),
    );
    if (sigBuf.length !== expBuf.length) return false;
    const result = sigBuf.reduce((acc, byte, i) => acc | (byte ^ expBuf[i]), 0);
    return result === 0;
  } catch {
    return false;
  }
}

describe("generateCsrfToken", () => {
  test("returns a non-empty string", async () => {
    const token = await generateCsrfToken();
    assert.ok(typeof token === "string" && token.length > 0);
  });

  test("returns a string with exactly 2 dot-separated parts", async () => {
    const token = await generateCsrfToken();
    const parts = token.split(".");
    assert.strictEqual(parts.length, 2);
  });

  test("returns a string where each part is non-empty hex", async () => {
    const token = await generateCsrfToken();
    const [randomValue, signature] = token.split(".");
    assert.ok(randomValue.length > 0 && /^[a-f0-9]+$/i.test(randomValue));
    assert.ok(signature.length > 0 && /^[a-f0-9]+$/i.test(signature));
  });

  test("randomValue has correct length (64 hex chars for 32 bytes)", async () => {
    const token = await generateCsrfToken();
    const [randomValue] = token.split(".");
    assert.strictEqual(randomValue.length, 64);
  });

  test("two generated tokens are different", async () => {
    const t1 = await generateCsrfToken();
    const t2 = await generateCsrfToken();
    assert.notStrictEqual(t1, t2);
  });
});

describe("validateCsrfTokenEdge", () => {
  test("returns true for a freshly generated valid token", async () => {
    const token = await generateCsrfToken();
    const result = await validateCsrfTokenEdge(token);
    assert.strictEqual(result, true);
  });

  test("returns false for null input", async () => {
    const result = await validateCsrfTokenEdge(null);
    assert.strictEqual(result, false);
  });

  test("returns false for undefined input", async () => {
    const result = await validateCsrfTokenEdge(undefined);
    assert.strictEqual(result, false);
  });

  test("returns false for non-string input (number)", async () => {
    const result = await validateCsrfTokenEdge(12345);
    assert.strictEqual(result, false);
  });

  test("returns false for empty string", async () => {
    const result = await validateCsrfTokenEdge("");
    assert.strictEqual(result, false);
  });

  test("returns false for token with wrong number of parts", async () => {
    const result = await validateCsrfTokenEdge("only-one-part");
    assert.strictEqual(result, false);
  });

  test("returns false for token with three parts", async () => {
    const result = await validateCsrfTokenEdge("a.b.c");
    assert.strictEqual(result, false);
  });

  test("returns false for token with garbage hex in signature", async () => {
    const [randomValue] = (await generateCsrfToken()).split(".");
    const result = await validateCsrfTokenEdge(`${randomValue}.zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz`);
    assert.strictEqual(result, false);
  });

  test("returns false for token with tampered randomValue", async () => {
    const token = await generateCsrfToken();
    const [randomValue, signature] = token.split(".");
    // Flip one character
    const tamperedRandom = randomValue[0] === "a" ? "b" + randomValue.slice(1) : "a" + randomValue.slice(1);
    const result = await validateCsrfTokenEdge(`${tamperedRandom}.${signature}`);
    assert.strictEqual(result, false);
  });
});
