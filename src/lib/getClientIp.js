/**
 * Returns the verified client IP from an incoming request's headers.
 *
 * Only trusts x-real-ip — set by Vercel's edge infrastructure; cannot
 * be spoofed by the client.  X-Forwarded-For is NOT used because it is
 * fully client-controlled and would allow complete rate-limit bypass.
 *
 * @param {Headers} headers  The request headers object.
 * @returns {string}  Verified IP address, or "unknown" if none can be determined.
 */
export function getClientIp(headers) {
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
