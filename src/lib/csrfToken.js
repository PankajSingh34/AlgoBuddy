const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET_ENV = "CSRF_SECRET";
const DEV_SECRET_KEY = Symbol.for("algobuddy.csrf.devSecret");

function getSecret() {
  const secret = process.env[CSRF_SECRET_ENV];
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "CSRF_SECRET must be set in production for CSRF token signing.",
    );
  }
  if (!globalThis[DEV_SECRET_KEY]) {
    const array = new Uint8Array(32);
    globalThis.crypto.getRandomValues(array);
    globalThis[DEV_SECRET_KEY] = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    console.warn(
      "CSRF_SECRET not set. Using a stable development secret shared across reloads. " +
      "Tokens will be invalidated on server restart. Set CSRF_SECRET in .env.local for persistence.",
    );
  }
  return globalThis[DEV_SECRET_KEY];
}

export async function generateCsrfToken() {
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

export async function validateCsrfTokenEdge(token) {
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
