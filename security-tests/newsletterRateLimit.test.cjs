// security-tests/newsletterRateLimit.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/newsletterRateLimit.test.cjs
//
// Static contract check for newsletter abuse protection.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('newsletter subscribe route rate limits requests before insert', () => {
  const filePath = path.resolve(__dirname, '..', 'src', 'app', 'api', 'newsletter', 'subscribe', 'route.js');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.match(content, /checkRateLimit\(`newsletter:\$\{ip\}`\)/);
  assert.match(content, /Retry-After/);
  assert.match(content, /X-RateLimit-Limit": "5"/);
  assert.match(content, /normalizeNewsletterEmail/);
});
