// security-tests/profileLookup.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/profileLookup.test.cjs
//
// Tests the shared profile username validation and rate-limit key helper.

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

describe('profile lookup helpers', () => {
  test('validates expected usernames per platform', async () => {
    const { isValidProfileUsername, normalizeProfileUsername, getProfileRateLimitKey } = await import('../src/lib/profileLookup.js');

    assert.equal(normalizeProfileUsername('  octocat  '), 'octocat');
    assert.equal(isValidProfileUsername('github', 'octocat'), true);
    assert.equal(isValidProfileUsername('github', 'octo-cat'), true);
    assert.equal(isValidProfileUsername('github', '-bad'), false);
    assert.equal(isValidProfileUsername('github', 'bad-'), false);
    assert.equal(isValidProfileUsername('leetcode', 'leet_user-1'), true);
    assert.equal(isValidProfileUsername('codeforces', 'cf.user_1'), true);
    assert.equal(isValidProfileUsername('codechef', 'chef-user_1'), true);
    assert.equal(isValidProfileUsername('unknown', 'anything'), false);
    assert.equal(getProfileRateLimitKey('github', '127.0.0.1'), 'profile:github:127.0.0.1');
  });
});

describe('profile proxy routes', () => {
  test('github repos route rate limits and validates usernames before fetch', () => {
    const filePath = path.resolve(__dirname, '..', 'src', 'app', 'api', 'github-repos', 'route.js');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.match(content, /checkRateLimit\(getProfileRateLimitKey\("github"/);
    assert.match(content, /Invalid GitHub username/);
    assert.match(content, /X-RateLimit-Limit": "5"/);
  });

  test('coding profiles route rate limits and validates usernames before fetch', () => {
    const filePath = path.resolve(__dirname, '..', 'src', 'app', 'api', 'coding-profiles', 'fetch', 'route.js');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.match(content, /checkRateLimit\(getProfileRateLimitKey\(platform, ip\)\)/);
    assert.match(content, /Invalid username/);
    assert.match(content, /X-RateLimit-Limit": "5"/);
  });
});
