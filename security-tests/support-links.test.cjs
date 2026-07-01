const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Support Center uses real navigation targets instead of dead links', () => {
  const filePath = path.resolve(__dirname, '..', 'src', 'app', 'components', 'support.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.doesNotMatch(content, /href="javascript:void\(0\)"/);
  assert.match(content, /href="\/faq"/);
  assert.match(content, /href="\/community"/);
  assert.match(content, /router\.push\("\/faq"\)/);
});
