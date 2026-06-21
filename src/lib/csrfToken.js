import crypto from "crypto";

const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET_ENV = "CSRF_SECRET";

function getSecret() {
  const secret = process.env[CSRF_SECRET_ENV];
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "CSRF_SECRET must be set in production for CSRF token signing.",
    );
  }
  return "dev-csrf-secret-do-not-use-in-production";
}

export function generateCsrfToken() {
  const secret = getSecret();
  const randomValue = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(randomValue);
  const signature = hmac.digest("hex");
  return `${randomValue}.${signature}`;
}

export function validateCsrfToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [randomValue, signature] = parts;
  const secret = getSecret();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(randomValue);
  const expected = hmac.digest("hex");
  if (signature.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
