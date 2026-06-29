const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

test("Static Security Audit - active matches endpoint requires auth and returns sanitized metadata", () => {
  const routePath = path.resolve(__dirname, "..", "arena-socket-server", "index.js");
  const content = fs.readFileSync(routePath, "utf8");

  assert.match(
    content,
    /async function getAuthenticatedHttpUserId\(req\)/,
    "active matches should resolve the authenticated user from the bearer token",
  );

  assert.match(
    content,
    /app\.get\("\/api\/matches\/active"[^]+?getAuthenticatedHttpUserId\(req\)[^]+?401[^]+?Authentication required/,
    "active matches should reject unauthenticated requests",
  );

  assert.match(
    content,
    /isActiveMatchesRateLimited\(clientIp\)/,
    "active matches should rate limit repeated scans per client IP",
  );

  assert.match(
    content,
    /activeMatches\.push\(\{\s*matchId: match\.matchId,\s*topic: match\.topic,\s*difficulty: match\.difficulty,\s*status: match\.status,\s*players: Array\.isArray\(match\.players\)/s,
    "active matches should return sanitized metadata instead of raw Redis match payloads",
  );
});

test("Arena page forwards the Supabase access token to the active matches endpoint", () => {
  const pagePath = path.resolve(__dirname, "..", "src", "app", "arena", "page.jsx");
  const content = fs.readFileSync(pagePath, "utf8");

  assert.match(
    content,
    /supabase\.auth\.getSession\(\)[^]+?Authorization:\s*`Bearer \$\{token\}`/s,
    "arena live matches polling should send the Supabase bearer token",
  );
});
