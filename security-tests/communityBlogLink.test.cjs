// security-tests/communityBlogLink.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/communityBlogLink.test.cjs
//
// Static check for the community blog CTA route.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('community blog feed points to the existing /blog route', () => {
  const filePath = path.resolve(__dirname, '..', 'src', 'app', 'components', 'community', 'CommunityBlogFeed.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.match(content, /href="\/blog"/);
  assert.doesNotMatch(content, /href="\/blogs"/);
});
