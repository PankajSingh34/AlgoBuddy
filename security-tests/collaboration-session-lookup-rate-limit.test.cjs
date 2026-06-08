/**
 * Regression test for collaboration session lookup rate limiting.
 *
 * Ensures GET /api/sessions/[sessionId] applies IP-based rate limiting
 * before resolving session details.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const routePath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "api",
  "sessions",
  "[sessionId]",
  "route.js",
);

function getRouteSource() {
  return fs.readFileSync(routePath, "utf8");
}

function getGetHandlerSource(source) {
  const match = source.match(
    /export\s+async\s+function\s+GET\s*\([^)]*\)\s*\{([\s\S]*?)\}\s*export\s+async\s+function\s+POST/,
  );

  assert.ok(match, "Expected GET handler to exist before POST handler");
  return match[1];
}

test("session lookup GET applies rate limiting before resolving session details", () => {
  const getHandler = getGetHandlerSource(getRouteSource());

  assert.match(
    getHandler,
    /getClientIp\s*\(\s*request\.headers\s*\)/,
    "GET handler must derive the client IP from request headers",
  );

  assert.match(
    getHandler,
    /checkRateLimit\s*\(\s*`collab:lookup:\$\{ip\}`\s*\)/,
    "GET handler must use an IP-based collab:lookup rate-limit key",
  );

  assert.match(
    getHandler,
    /status:\s*429/,
    "GET handler must return 429 when the lookup rate limit is exceeded",
  );

  assert.ok(
    getHandler.indexOf("checkRateLimit") <
      getHandler.indexOf("getPublicCollaborationSession"),
    "GET handler must rate-limit before resolving session details",
  );
});