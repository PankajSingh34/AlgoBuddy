const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("Static Security Audit - newsletter subscribe uses rate limiting", () => {
  const routePath = path.resolve(__dirname, "..", "src", "app", "api", "newsletter", "subscribe", "route.js");
  const content = fs.readFileSync(routePath, "utf8");

  assert.match(content, /import\s+\{\s*checkRateLimit\s*\}\s+from\s+["']@\/lib\/rateLimit["']/);
  assert.match(content, /import\s+\{\s*getClientIp\s*\}\s+from\s+["']@\/lib\/getClientIp["']/);
  assert.match(content, /NEWSLETTER_API/);
  assert.match(content, /Retry-After/);
  assert.match(content, /X-RateLimit-Limit/);
  assert.match(content, /newsletter:\$\{ip\}/);
});
