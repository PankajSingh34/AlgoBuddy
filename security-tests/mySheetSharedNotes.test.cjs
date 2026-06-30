// security-tests/mySheetSharedNotes.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/mySheetSharedNotes.test.cjs
//
// Tests the shared-note gate used by the mysheet share and clone routes.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('getSharedNote', () => {
  test('returns an empty string when shared_notes is false', async () => {
    const { getSharedNote } = await import('../src/lib/mySheetSharedNotes.js');

    assert.equal(getSharedNote({ shared_notes: false, note: 'secret note' }), '');
    assert.equal(getSharedNote({ shared_notes: 0, note: 'secret note' }), '');
  });

  test('returns the note only when shared_notes is true', async () => {
    const { getSharedNote } = await import('../src/lib/mySheetSharedNotes.js');

    assert.equal(getSharedNote({ shared_notes: true, note: 'public note' }), 'public note');
    assert.equal(getSharedNote({ shared_notes: true, note: '' }), '');
  });

  test('handles missing row data safely', async () => {
    const { getSharedNote } = await import('../src/lib/mySheetSharedNotes.js');

    assert.equal(getSharedNote(null), '');
    assert.equal(getSharedNote(undefined), '');
  });
});
