export const CSRF_COOKIE_NAME = "csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

const TRUSTED_ORIGINS = (() => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const origins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://algobuddy.me",
    "https://www.algobuddy.me",
    "https://algobuddy.vercel.app",
  ]);

  if (appUrl) origins.add(appUrl.replace(/\/+$/, ""));

  return origins;
})();

const VERCEL_PREVIEW_REGEX = /^https:\/\/[a-zA-Z0-9-]+\.algobuddy\.vercel\.app$/;

export function validateCsrfOrigin(request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  let normalized = "";
  if (origin) {
    normalized = origin.replace(/\/+$/, "");
  } else if (referer) {
    try {
      normalized = new URL(referer).origin;
    } catch {}
  }

  if (TRUSTED_ORIGINS.has(normalized)) return true;
  if (VERCEL_PREVIEW_REGEX.test(normalized)) return true;
  return false;
}

const STATE_CHANGING_METHODS = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

export function isStateChangingMethod(method) {
  return STATE_CHANGING_METHODS.has(method);
}

export function isApiRoute(pathname) {
  return pathname.startsWith("/api/");
}