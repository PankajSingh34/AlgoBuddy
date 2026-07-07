import crypto from "crypto";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "./csrfConstants";

const CSRF_SECRET =
  process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex");

export function generateCsrfToken() {
  const random = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now().toString(36);

  const hmac = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(`${random}:${timestamp}`)
    .digest("hex");

  return `${random}:${timestamp}:${hmac}`;
}

export function validateCsrf(request) {
  const cookieToken = request.cookies?.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers?.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  if (cookieToken !== headerToken) {
    return false;
  }

  const parts = cookieToken.split(":");

  if (parts.length !== 3) {
    return false;
  }

  const [random, timestamp, hmac] = parts;

  const expectedHmac = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(`${random}:${timestamp}`)
    .digest("hex");

  if (hmac !== expectedHmac) {
    return false;
  }

  const tokenAge = Date.now() - parseInt(timestamp, 36);

  if (tokenAge > 24 * 60 * 60 * 1000) {
    return false;
  }

  return true;
}

export function setCsrfCookie(response) {
  const token = generateCsrfToken();

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  return token;
}