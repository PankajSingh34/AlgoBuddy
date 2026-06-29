const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

test('Static Security Audit - arena match verification endpoints require auth', () => {
  const routePath = path.resolve(__dirname, '..', 'arena-socket-server', 'index.js');
  const content = fs.readFileSync(routePath, 'utf8');

  assert.match(
    content,
    /async function getAuthenticatedHttpUserId\(req\)/,
    'arena server should expose a helper that resolves the authenticated user id from the bearer token',
  );

  assert.match(
    content,
    /app\.get\("\/api\/verify-match\/:matchId\/:userId"[^]+?authenticatedUserId !== userId[^]+?403/,
    'verify-match should reject mismatched or missing authenticated users',
  );

  assert.match(
    content,
    /app\.get\("\/api\/verify-match-result\/:matchId\/:userId"[^]+?authenticatedUserId !== userId[^]+?403/,
    'verify-match-result should reject mismatched or missing authenticated users',
  );

  assert.match(
    content,
    /401\)\.json\(\{ verified: false, error: "Authentication required" \}\)/,
    'unauthenticated requests should receive a 401 response',
  );
});
