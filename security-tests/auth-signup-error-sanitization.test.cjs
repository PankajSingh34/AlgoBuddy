const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const helperPath = path.resolve(__dirname, "..", "src", "lib", "authMessages.js");
const routePath = path.resolve(__dirname, "..", "src", "app", "api", "auth", "route.js");

test("Authentication signup error responses are sanitized", async (t) => {
  const { getSafeSignupErrorMessage } = await import(`file://${helperPath}`);

  await t.test("returns a generic public message", () => {
    const generic = getSafeSignupErrorMessage();
    assert.equal(generic, "We couldn't complete signup. Please check your details and try again.");
  });

  await t.test("route does not reflect provider error.message back to the client", () => {
    const content = fs.readFileSync(routePath, "utf8");
    assert.match(content, /getSafeSignupErrorMessage\(\)/);
    assert.doesNotMatch(content, /message:\s*error\.message/);
  });

  await t.test("route logs the provider error server-side", () => {
    const content = fs.readFileSync(routePath, "utf8");
    assert.match(content, /console\.error\("\[Auth API\] Signup provider error:"/);
  });
});
