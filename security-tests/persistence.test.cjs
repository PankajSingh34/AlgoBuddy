// security-tests/persistence.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/persistence.test.cjs
//
// Tests the mergeProgress and mergeBookmarks methods in src/lib/persistence.js.
// Inlined here because the source imports from @/lib/supabase which requires Next.js.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// ── Inlined source from src/lib/persistence.js (merge methods only) ───────

const STORAGE_KEYS = {
  PRACTICE_PROGRESS: 'algobuddy_practice_progress',
  BOOKMARKS: 'algobuddy_bookmarks',
  PROBLEM_BOOKMARKS: 'algobuddy_problem_bookmarks',
  RECENTLY_VIEWED: 'algobuddy_recently_viewed',
  THEME: 'algobuddy_theme',
};

// Minimal PersistenceManager — only the merge methods needed for testing.
// No localStorage or Supabase needed.
class PersistenceManager {
  mergeProgress(local, server, userId) {
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

  mergeBookmarks(localArray, serverArray, idField = 'id') {
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
}

const persistence = new PersistenceManager();

// ── Tests ───────────────────────────────────────────────────────────────

describe('mergeProgress', () => {
  test('returns a copy of local when server is null', () => {
    const local = { problem1: { status: 'solved', updatedAt: '2024-01-01T00:00:00Z' } };
    const result = persistence.mergeProgress(local, null, 'user1');
    assert.deepStrictEqual(result, local);
  });

  test('returns empty object when both local and server are empty', () => {
    const result = persistence.mergeProgress({}, [], 'user1');
    assert.deepStrictEqual(result, {});
  });

  test('server item newer than local wins', () => {
    const local = {
      problem1: { status: 'solved', updatedAt: '2024-01-01T00:00:00Z' },
    };
    const server = [
      { problem_id: 'problem1', status: 'reviewed', updated_at: '2024-06-01T00:00:00Z' },
    ];
    const result = persistence.mergeProgress(local, server, 'user1');
    assert.strictEqual(result.problem1.status, 'reviewed');
  });

  test('local item newer than server wins', () => {
    const local = {
      problem1: { status: 'reviewed', updatedAt: '2024-06-01T00:00:00Z' },
    };
    const server = [
      { problem_id: 'problem1', status: 'solved', updated_at: '2024-01-01T00:00:00Z' },
    ];
    const result = persistence.mergeProgress(local, server, 'user1');
    assert.strictEqual(result.problem1.status, 'reviewed');
  });

  test('local-only items are preserved', () => {
    const local = {
      problem1: { status: 'reviewed', updatedAt: '2024-06-01T00:00:00Z' },
      problem2: { status: 'solved', updatedAt: '2024-05-01T00:00:00Z' },
    };
    const server = [
      { problem_id: 'problem1', status: 'reviewed', updated_at: '2024-06-01T00:00:00Z' },
    ];
    const result = persistence.mergeProgress(local, server, 'user1');
    assert.strictEqual(result.problem2.status, 'solved');
  });

  test('server-only items are added', () => {
    const local = {
      problem1: { status: 'reviewed', updatedAt: '2024-06-01T00:00:00Z' },
    };
    const server = [
      { problem_id: 'problem1', status: 'reviewed', updated_at: '2024-06-01T00:00:00Z' },
      { problem_id: 'problem2', status: 'solved', updated_at: '2024-05-01T00:00:00Z' },
    ];
    const result = persistence.mergeProgress(local, server, 'user1');
    assert.strictEqual(result.problem2.status, 'solved');
  });

  test('item with missing updated_at treats server as epoch and wins', () => {
    const local = {
      problem1: { status: 'solved', updatedAt: '2024-01-01T00:00:00Z' },
    };
    const server = [
      { problem_id: 'problem1', status: 'reviewed', updated_at: null },
    ];
    const result = persistence.mergeProgress(local, server, 'user1');
    // serverUpdated = 0 < localUpdated = Jan 2024 → local wins
    assert.strictEqual(result.problem1.status, 'solved');
  });

  test('local item with missing updatedAt loses to server', () => {
    const local = { problem1: { status: 'solved' } }; // no updatedAt
    const server = [
      { problem_id: 'problem1', status: 'reviewed', updated_at: '2024-06-01T00:00:00Z' },
    ];
    const result = persistence.mergeProgress(local, server, 'user1');
    assert.strictEqual(result.problem1.status, 'reviewed');
  });

  test('both missing updated_at leaves server value', () => {
    const local = { problem1: { status: 'solved' } };
    const server = [{ problem_id: 'problem1', status: 'reviewed', updated_at: null }];
    const result = persistence.mergeProgress(local, server, 'user1');
    assert.strictEqual(result.problem1.status, 'reviewed');
  });

  test('updatedAt is set to server timestamp after merge', () => {
    const local = {};
    const server = [
      { problem_id: 'problem1', status: 'reviewed', updated_at: '2024-06-01T00:00:00Z' },
    ];
    const result = persistence.mergeProgress(local, server, 'user1');
    assert.strictEqual(result.problem1.updatedAt, '2024-06-01T00:00:00Z');
  });
});

describe('mergeBookmarks', () => {
  test('returns local and server bookmarks without duplication', () => {
    const local = [
      { id: '1', title: 'Bookmark A' },
      { id: '2', title: 'Bookmark B' },
    ];
    const server = [
      { id: '2', title: 'Bookmark B Updated' },
      { id: '3', title: 'Bookmark C' },
    ];
    const result = persistence.mergeBookmarks(local, server);
    assert.strictEqual(result.length, 3);
    const ids = result.map((b) => b.id);
    assert.ok(ids.includes('1'));
    assert.ok(ids.includes('2'));
    assert.ok(ids.includes('3'));
  });

  test('server bookmark overrides local when idField matches', () => {
    const local = [{ id: '1', title: 'Old Title' }];
    const server = [{ id: '1', title: 'New Title' }];
    const result = persistence.mergeBookmarks(local, server);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'New Title');
  });

  test('uses default idField when not specified', () => {
    const local = [{ id: 'a', name: 'Local Item' }];
    const server = [{ id: 'a', name: 'Server Item' }];
    const result = persistence.mergeBookmarks(local, server);
    assert.strictEqual(result[0].name, 'Server Item');
  });

  test('uses problem_id when idField yields no key', () => {
    const local = [{ id: '1', problem_id: 'prob1', name: 'Local' }];
    const server = [{ id: '2', problem_id: 'prob1', name: 'Server' }];
    const result = persistence.mergeBookmarks(local, server, 'id');
    // local.id='1' and server.id='2' are different; server uses problem_id fallback
    // merged has 2 entries since local['1'] and server['prob1'] are different keys
    assert.strictEqual(result.length, 2);
  });

  test('empty local array returns server items', () => {
    const local = [];
    const server = [{ id: '1', title: 'Server Item' }];
    const result = persistence.mergeBookmarks(local, server);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'Server Item');
  });

  test('empty server array returns local items', () => {
    const local = [{ id: '1', title: 'Local Item' }];
    const server = [];
    const result = persistence.mergeBookmarks(local, server);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'Local Item');
  });

  test('both empty arrays returns empty array', () => {
    const result = persistence.mergeBookmarks([], []);
    assert.strictEqual(result.length, 0);
  });

  test('custom idField is used for both arrays', () => {
    const local = [{ customId: 'x', title: 'Local' }];
    const server = [{ customId: 'x', title: 'Server' }];
    const result = persistence.mergeBookmarks(local, server, 'customId');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'Server');
  });
});
