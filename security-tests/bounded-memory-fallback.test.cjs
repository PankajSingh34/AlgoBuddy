const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("rate limiter fallback declares bounded active-entry eviction", () => {
  const rateLimit = fs.readFileSync(
    path.join(__dirname, "..", "src", "lib", "rateLimit", "index.js"),
    "utf8",
  );

  assert.match(rateLimit, /MAX_RATE_LIMIT_ENTRIES/);
  assert.match(rateLimit, /function enforceStoreLimit/);
  assert.match(rateLimit, /while\s*\(\s*store\.size\s*>\s*maxEntries\s*\)/);
  assert.match(rateLimit, /function setStoreBucket/);
  assert.match(rateLimit, /setStoreBucket\(key,\s*\{\s*count:\s*1,\s*resetAt\s*\}\)/);
});

test("auth fallback declares bounded failure and lockout caches", () => {
  const authRoute = fs.readFileSync(
    path.join(__dirname, "..", "src", "app", "api", "auth", "route.js"),
    "utf8",
  );

  assert.match(authRoute, /MAX_MEMORY_FAILURE_ENTRIES/);
  assert.match(authRoute, /MAX_MEMORY_LOCKOUT_ENTRIES/);
  assert.match(authRoute, /function cleanupMemoryAuthState/);
  assert.match(authRoute, /function trimOldestEntries/);
  assert.match(authRoute, /setMemoryEntry\(\s*memoryFailures/);
  assert.match(authRoute, /setMemoryEntry\(\s*memoryLockouts/);
});
