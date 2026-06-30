const GITHUB_USERNAME_RE = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const CODEFORCES_USERNAME_RE = /^[A-Za-z0-9_]{3,24}$/;
const CODECHEF_USERNAME_RE = /^[A-Za-z][A-Za-z0-9_]{2,29}$/;
const LEETCODE_USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

export function normalizeProfileLookupPlatform(platform) {
  return String(platform || "").trim().toLowerCase();
}

export function isValidProfileLookupUsername(platform, username) {
  const value = String(username || "").trim();
  if (!value) return false;

  switch (normalizeProfileLookupPlatform(platform)) {
    case "github":
      return GITHUB_USERNAME_RE.test(value);
    case "codeforces":
      return CODEFORCES_USERNAME_RE.test(value);
    case "codechef":
      return CODECHEF_USERNAME_RE.test(value);
    case "leetcode":
      return LEETCODE_USERNAME_RE.test(value);
    default:
      return false;
  }
}

export function getProfileLookupRateLimitKey(platform, ip) {
  return `profile-lookup:${normalizeProfileLookupPlatform(platform)}:${ip || "unknown"}`;
}
