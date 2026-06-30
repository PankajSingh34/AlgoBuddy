const USERNAME_RULES = {
  github: /^[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}$/,
  codeforces: /^[a-zA-Z0-9_\.]{2,24}$/,
  leetcode: /^[a-zA-Z0-9_-]{2,25}$/,
  codechef: /^[a-zA-Z0-9_-]{2,24}$/,
};

export function normalizeProfileUsername(username) {
  return String(username || "").trim();
}

export function isValidProfileUsername(platform, username) {
  const normalized = normalizeProfileUsername(username);
  const rule = USERNAME_RULES[platform];
  if (!rule) return false;
  return rule.test(normalized);
}

export function getProfileRateLimitKey(platform, ip) {
  return `profile:${platform}:${ip}`;
}
