const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

test("Static Security Audit - /debug requires a configured debug key", () => {
  const routePath = path.resolve(__dirname, "..", "arena-socket-server", "index.js");
  const content = fs.readFileSync(routePath, "utf8");

  assert.match(
    content,
    /if\s*\(\s*!debugKey\s*\|\|\s*providedKey\s*!==\s*debugKey\s*\)/,
    "/debug must fail closed when DEBUG_KEY is missing or incorrect",
  );

  assert.match(
    content,
    /return\s+res\.status\(404\)\.json\(\{\s*error:\s*"Not found"\s*\}\)/,
    "/debug must hide the endpoint when the key is missing",
  );

  assert.doesNotMatch(
    content,
    /if\s*\(\s*debugKey\s*&&\s*providedKey\s*!==\s*debugKey\s*\)/,
    "/debug must not use the old key-present-only guard",
  );
});
