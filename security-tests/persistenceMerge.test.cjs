// security-tests/persistenceMerge.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/persistenceMerge.test.cjs
//
// Tests the conflict-resolution helpers in src/lib/persistence.js.
// The logic is inlined here to avoid alias/import friction in Node test mode.

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

function mergeProgress(local, server, userId) {
  const merged = { ...local };
  if (server) {
    server.forEach((item) => {
      const problemId = item.problem_id;
      const serverStatus = item.status;
      const serverUpdated = item.updated_at ? new Date(item.updated_at).getTime() : 0;
      const localUpdated = local[problemId]?.updatedAt
        ? new Date(local[problemId].updatedAt).getTime()
        : 0;

      if (serverUpdated >= localUpdated) {
        merged[problemId] = { status: serverStatus, updatedAt: item.updated_at };
      }
    });
  }
  return merged;
}

function mergeBookmarks(localArray, serverArray, idField = 'id') {
  const merged = {};
  localArray.forEach((item) => {
    merged[item[idField]] = item;
  });
  serverArray.forEach((item) => {
    const key = item[idField] || item.problem_id;
    if (key) {
      merged[key] = item;
    }
  });
  return Object.values(merged);
}

describe('mergeProgress', () => {
  test('prefers the newer server record when it wins by timestamp', () => {
    const local = {
      alpha: { status: 'solved', updatedAt: '2026-06-19T10:00:00.000Z' },
    };
    const server = [
      { problem_id: 'alpha', status: 'attempted', updated_at: '2026-06-19T10:05:00.000Z' },
    ];

    assert.deepStrictEqual(mergeProgress(local, server, 'user-1'), {
      alpha: { status: 'attempted', updatedAt: '2026-06-19T10:05:00.000Z' },
    });
  });

  test('keeps the local record when it is newer than server data', () => {
    const local = {
      alpha: { status: 'solved', updatedAt: '2026-06-19T10:10:00.000Z' },
    };
    const server = [
      { problem_id: 'alpha', status: 'attempted', updated_at: '2026-06-19T10:05:00.000Z' },
    ];

    assert.deepStrictEqual(mergeProgress(local, server), local);
  });

  test('adds a missing problem from the server payload', () => {
    const local = {
      alpha: { status: 'solved', updatedAt: '2026-06-19T10:10:00.000Z' },
    };
    const server = [
      { problem_id: 'beta', status: 'attempted', updated_at: '2026-06-19T11:00:00.000Z' },
    ];

    assert.deepStrictEqual(mergeProgress(local, server), {
      alpha: { status: 'solved', updatedAt: '2026-06-19T10:10:00.000Z' },
      beta: { status: 'attempted', updatedAt: '2026-06-19T11:00:00.000Z' },
    });
  });

  test('treats equal timestamps as server wins', () => {
    const local = {
      alpha: { status: 'solved', updatedAt: '2026-06-19T10:10:00.000Z' },
    };
    const server = [
      { problem_id: 'alpha', status: 'attempted', updated_at: '2026-06-19T10:10:00.000Z' },
    ];

    assert.deepStrictEqual(mergeProgress(local, server), {
      alpha: { status: 'attempted', updatedAt: '2026-06-19T10:10:00.000Z' },
    });
  });

  test('returns the local map when server data is missing', () => {
    const local = {
      alpha: { status: 'solved', updatedAt: '2026-06-19T10:10:00.000Z' },
    };

    assert.deepStrictEqual(mergeProgress(local, null, 'user-1'), local);
  });

  test('userId does not affect merge semantics', () => {
    const local = {
      alpha: { status: 'solved', updatedAt: '2026-06-19T10:00:00.000Z' },
    };
    const server = [
      { problem_id: 'alpha', status: 'attempted', updated_at: '2026-06-19T10:15:00.000Z' },
    ];

    assert.deepStrictEqual(
      mergeProgress(local, server, 'user-a'),
      mergeProgress(local, server, 'user-b'),
    );
  });
});

describe('mergeBookmarks', () => {
  test('merges arrays by idField and lets server values win on conflicts', () => {
    const local = [
      { id: 'a', title: 'local a', source: 'local' },
      { id: 'b', title: 'local b', source: 'local' },
    ];
    const server = [
      { id: 'b', title: 'server b', source: 'server' },
      { id: 'c', title: 'server c', source: 'server' },
    ];

    assert.deepStrictEqual(mergeBookmarks(local, server), [
      { id: 'a', title: 'local a', source: 'local' },
      { id: 'b', title: 'server b', source: 'server' },
      { id: 'c', title: 'server c', source: 'server' },
    ]);
  });

  test('falls back to problem_id when the idField is missing on server items', () => {
    const local = [{ id: 'a', title: 'local a' }];
    const server = [{ problem_id: 'b', title: 'server b' }];

    assert.deepStrictEqual(mergeBookmarks(local, server), [
      { id: 'a', title: 'local a' },
      { problem_id: 'b', title: 'server b' },
    ]);
  });

  test('supports a custom idField for bookmark collections', () => {
    const local = [
      { bookmark_id: 'x', title: 'local x' },
    ];
    const server = [
      { bookmark_id: 'x', title: 'server x' },
      { bookmark_id: 'y', title: 'server y' },
    ];

    assert.deepStrictEqual(mergeBookmarks(local, server, 'bookmark_id'), [
      { bookmark_id: 'x', title: 'server x' },
      { bookmark_id: 'y', title: 'server y' },
    ]);
  });

  test('returns an empty array when both inputs are empty', () => {
    assert.deepStrictEqual(mergeBookmarks([], []), []);
  });

  test('ignores server records without any usable identifier', () => {
    const local = [{ id: 'a', title: 'local a' }];
    const server = [{ title: 'missing key' }];

    assert.deepStrictEqual(mergeBookmarks(local, server), [
      { id: 'a', title: 'local a' },
    ]);
  });
});
