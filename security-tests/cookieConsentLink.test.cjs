// security-tests/cookieConsentLink.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/cookieConsentLink.test.cjs
//
// Static check for the cookie policy CTA route.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('cookie consent banner points to the existing /cookie route', () => {
  const filePath = path.resolve(__dirname, '..', 'src', 'app', 'components', 'cookiesconsent.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.match(content, /href="\/cookie"/);
  assert.doesNotMatch(content, /href="\/cookie-policy"/);
});
