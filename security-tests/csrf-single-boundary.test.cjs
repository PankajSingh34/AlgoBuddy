// security-tests/csrf-single-boundary.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrf-single-boundary.test.cjs
//
// Static audit ensuring CSRF validation for state-changing /api/* routes
// stays centralized in src/authProxy.js. Route handlers must not duplicate
// origin or token checks — that split enforcement is what issue #3722 fixed.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const ROOT = path.resolve(__dirname, "..");

// Every state-changing route that previously duplicated CSRF logic.
const STATE_CHANGING_ROUTES = [
  "src/app/api/contact/route.js",
  "src/app/api/send-review/route.js",
  "src/app/api/comments/route.js",
  "src/app/api/newsletter/subscribe/route.js",
  "src/app/api/community/join/route.js",
  "src/app/api/bookmarks/route.js",
  "src/app/api/applications/route.js",
  "src/app/api/job-bookmarks/route.js",
  "src/app/api/mysheet/route.js",
];

test("route handlers do not duplicate CSRF origin/token validation", () => {
  for (const route of STATE_CHANGING_ROUTES) {
    const content = fs.readFileSync(path.join(ROOT, route), "utf8");

    assert.doesNotMatch(
      content,
      /validateCsrfOrigin/,
      `${route} must not perform its own CSRF origin check; authProxy.js already validates it`,
    );
    assert.doesNotMatch(
      content,
      /validateCsrfTokenEdge/,
      `${route} must not perform its own CSRF token validation; authProxy.js already validates it`,
    );
    assert.doesNotMatch(
      content,
      /CSRF_HEADER_NAME|CSRF_COOKIE_NAME/,
      `${route} must not read CSRF header/cookie names directly; authProxy.js already validates it`,
    );
  }
});

test("authProxy.js remains the single place performing CSRF origin and token checks", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/authProxy.js"), "utf8");

  assert.match(content, /validateCsrfOrigin/, "authProxy.js must validate CSRF origin");
  assert.match(content, /validateCsrfTokenEdge/, "authProxy.js must validate CSRF token signature");
  assert.match(
    content,
    /single CSRF enforcement boundary/i,
    "authProxy.js should document itself as the single CSRF enforcement boundary",
  );
});
