const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

test("Static Security Audit - socket CORS LAN wildcards are development-only", () => {
  const routePath = path.resolve(__dirname, "..", "arena-socket-server", "index.js");
  const content = fs.readFileSync(routePath, "utf8");

  assert.match(
    content,
    /const isDev = process\.env\.NODE_ENV !== "production";/,
    "socket CORS should derive a development-only flag from NODE_ENV",
  );

  assert.match(
    content,
    /SOCKET_EXTRA_ORIGINS/,
    "socket CORS should support explicit extra origins from environment configuration",
  );

  assert.match(
    content,
    /\(isDev && \(\s*origin\.startsWith\("http:\/\/localhost:"\)\s*\|\|\s*origin\.startsWith\("http:\/\/127\.0\.0\.1:"\)\s*\|\|\s*origin\.startsWith\("http:\/\/192\.168\."\)\s*\)\)/s,
    "socket CORS should only allow localhost and LAN wildcard origins in development",
  );

  const envExamplePath = path.resolve(__dirname, "..", ".env.example");
  const envExample = fs.readFileSync(envExamplePath, "utf8");

  assert.match(
    envExample,
    /SOCKET_EXTRA_ORIGINS=/,
    "env example should document explicit socket CORS overrides",
  );
});
