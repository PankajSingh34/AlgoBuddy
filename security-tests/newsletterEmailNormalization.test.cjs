// security-tests/newsletterEmailNormalization.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/newsletterEmailNormalization.test.cjs
//
// Tests the newsletter email normalization helper and route contract.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

describe('newsletter email helpers', () => {
  test('normalizes email casing and trims whitespace', async () => {
    const { normalizeNewsletterEmail, isValidNewsletterEmail } = await import('../src/lib/newsletter.js');

    assert.equal(normalizeNewsletterEmail('  User@Example.COM  '), 'user@example.com');
    assert.equal(isValidNewsletterEmail('  User@Example.COM  '), true);
    assert.equal(isValidNewsletterEmail('not-an-email'), false);
  });
});

describe('newsletter subscribe route', () => {
  test('stores the normalized email address', () => {
    const routePath = path.resolve(__dirname, '..', 'src', 'app', 'api', 'newsletter', 'subscribe', 'route.js');
    const content = fs.readFileSync(routePath, 'utf8');

    assert.match(content, /normalizeNewsletterEmail/);
    assert.match(content, /isValidNewsletterEmail/);
    assert.match(content, /email: normalizedEmail/);
  });
});
