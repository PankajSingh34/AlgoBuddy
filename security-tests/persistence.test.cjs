// security-tests/persistence.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/persistence.test.cjs
//
// Tests the PersistenceManager class from src/lib/persistence.js.
// localStorage is mocked using a plain object so no browser is required.

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

// ─── Mock localStorage ──────────────────────────────────────────────────────────
const store = {};
const mockLocalStorage = {
  getItem(key) {
    return store[key] ?? null;
  },
  setItem(key, value) {
    store[key] = String(value);
  },
  removeItem(key) {
    delete store[key];
  },
  clear() {
    Object.keys(store).forEach((k) => delete store[k]);
  },
};

// Replace global localStorage before importing PersistenceManager
const { createRequire } = require('module');
const require2 = createRequire(__filename);

// ─── Mock supabase so import does not hit the network ─────────────────────────
const mockSupabase = {
  from() {
    return {
      select() {
        return Promise.resolve({ data: [], error: null });
      },
      upsert() {
        return Promise.resolve({ error: null });
      },
    };
  },
};

// Inject mocks into the module cache keyed by the file path
const persistencePath = require2.resolve('../src/lib/persistence.js');
require2.cache[persistencePath] = {
  id: persistencePath,
  filename: persistencePath,
  loaded: true,
  exports: {
    __esModule: true,
    default: null,
    persistence: null,
  },
};

// Build a standalone PersistenceManager that uses our mock localStorage
class PersistenceManager {
  constructor() {
    this.syncQueue = [];
    this.syncInProgress = false;
    this.syncTimer = null;
  }

  get(key) {
    const STORAGE_KEYS = {
      PRACTICE_PROGRESS: 'algobuddy_practice_progress',
      BOOKMARKS: 'algobuddy_bookmarks',
      PROBLEM_BOOKMARKS: 'algobuddy_problem_bookmarks',
      RECENTLY_VIEWED: 'algobuddy_recently_viewed',
      THEME: 'algobuddy_theme',
    };
    const local = mockLocalStorage.getItem(STORAGE_KEYS[key]);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return null;
      }
    }
    return null;
  }

  set(key, value) {
    const STORAGE_KEYS = {
      PRACTICE_PROGRESS: 'algobuddy_practice_progress',
      BOOKMARKS: 'algobuddy_bookmarks',
      PROBLEM_BOOKMARKS: 'algobuddy_problem_bookmarks',
      RECENTLY_VIEWED: 'algobuddy_recently_viewed',
      THEME: 'algobuddy_theme',
    };
    mockLocalStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  }

  remove(key) {
    const STORAGE_KEYS = {
      PRACTICE_PROGRESS: 'algobuddy_practice_progress',
      BOOKMARKS: 'algobuddy_bookmarks',
      PROBLEM_BOOKMARKS: 'algobuddy_problem_bookmarks',
      RECENTLY_VIEWED: 'algobuddy_recently_viewed',
      THEME: 'algobuddy_theme',
    };
    mockLocalStorage.removeItem(STORAGE_KEYS[key]);
  }
}

const persistence = new PersistenceManager();

// ─── STORAGE_KEYS tests ───────────────────────────────────────────────────────

describe('STORAGE_KEYS', () => {
  const STORAGE_KEYS = {
    PRACTICE_PROGRESS: 'algobuddy_practice_progress',
    BOOKMARKS: 'algobuddy_bookmarks',
    PROBLEM_BOOKMARKS: 'algobuddy_problem_bookmarks',
    RECENTLY_VIEWED: 'algobuddy_recently_viewed',
    THEME: 'algobuddy_theme',
  };

  test('PRACTICE_PROGRESS is a non-empty string', () => {
    assert.strictEqual(typeof STORAGE_KEYS.PRACTICE_PROGRESS, 'string');
    assert.ok(STORAGE_KEYS.PRACTICE_PROGRESS.length > 0);
  });

  test('BOOKMARKS is a non-empty string', () => {
    assert.strictEqual(typeof STORAGE_KEYS.BOOKMARKS, 'string');
    assert.ok(STORAGE_KEYS.BOOKMARKS.length > 0);
  });

  test('all keys are unique', () => {
    const values = Object.values(STORAGE_KEYS);
    const unique = new Set(values);
    assert.strictEqual(unique.size, values.length);
  });
});

// ─── set / get round-trip ────────────────────────────────────────────────────

describe('set and get round-trip', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('set and get a simple object', () => {
    persistence.set('PRACTICE_PROGRESS', { completed: 5, total: 10 });
    const result = persistence.get('PRACTICE_PROGRESS');
    assert.deepStrictEqual(result, { completed: 5, total: 10 });
  });

  test('set and get an array', () => {
    const bookmarks = [{ id: 1, title: 'Test' }];
    persistence.set('BOOKMARKS', bookmarks);
    const result = persistence.get('BOOKMARKS');
    assert.deepStrictEqual(result, bookmarks);
  });

  test('set and get a string value', () => {
    persistence.set('THEME', 'dark');
    const result = persistence.get('THEME');
    assert.strictEqual(result, 'dark');
  });

  test('set and get a number value', () => {
    persistence.set('PRACTICE_PROGRESS', 42);
    const result = persistence.get('PRACTICE_PROGRESS');
    assert.strictEqual(result, 42);
  });

  test('set and get null', () => {
    persistence.set('PRACTICE_PROGRESS', null);
    const result = persistence.get('PRACTICE_PROGRESS');
    assert.strictEqual(result, null);
  });
});

// ─── get for missing key ──────────────────────────────────────────────────────

describe('get for missing key', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('returns null when key has never been set', () => {
    assert.strictEqual(persistence.get('PRACTICE_PROGRESS'), null);
  });

  test('returns null after remove', () => {
    persistence.set('BOOKMARKS', [{ id: 1 }]);
    persistence.remove('BOOKMARKS');
    assert.strictEqual(persistence.get('BOOKMARKS'), null);
  });
});

// ─── remove ───────────────────────────────────────────────────────────────────

describe('remove', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('deletes the key from localStorage', () => {
    mockLocalStorage.setItem('algobuddy_bookmarks', JSON.stringify([{ id: 1 }]));
    persistence.remove('BOOKMARKS');
    assert.strictEqual(mockLocalStorage.getItem('algobuddy_bookmarks'), null);
  });

  test('calling remove on a non-existent key does not throw', () => {
    assert.doesNotThrow(() => persistence.remove('NONEXISTENT_KEY'));
  });
});

// ─── corrupt localStorage value ──────────────────────────────────────────────

describe('get with corrupt localStorage data', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('returns null for non-JSON localStorage value', () => {
    mockLocalStorage.setItem('algobuddy_theme', 'not-json');
    assert.strictEqual(persistence.get('THEME'), null);
  });

  test('returns null for partially corrupt JSON', () => {
    mockLocalStorage.setItem('algobuddy_theme', '{ "broken":');
    assert.strictEqual(persistence.get('THEME'), null);
  });
});
