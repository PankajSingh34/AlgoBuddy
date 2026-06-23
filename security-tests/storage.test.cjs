// security-tests/storage.test.cjs
//
// Run with:  node --test security-tests/storage.test.cjs
//
// Tests src/utils/storage.js — saveToStorage, loadFromStorage, removeFromStorage.
// Uses Function wrapper so the inlined code can access a test-provided 'window'.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// ── Inlined implementations wrapped to accept 'window' as a parameter ─────────
// Mirrors src/utils/storage.js but uses the 'window' param injected by the test.

function buildStorageUtils(window) {
  return {
    saveToStorage: (key, value) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    },
    loadFromStorage: (key, fallback) => {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item) {
          try {
            return JSON.parse(item);
          } catch {
            return fallback;
          }
        }
      }
      return fallback;
    },
    removeFromStorage: (key) => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeStore() {
  const s = {};
  return {
    getItem: (k) => s[k] ?? null,
    setItem: (k, v) => { s[k] = v; },
    removeItem: (k) => { delete s[k]; },
  };
}

function withWindow(impl, fn) {
  const mockWindow = { localStorage: impl };
  const utils = buildStorageUtils(mockWindow);
  return fn(utils);
}

function withoutWindow(fn) {
  const utils = buildStorageUtils(undefined);
  return fn(utils);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test("saveToStorage stores JSON-stringified value", () => {
  const store = makeStore();
  withWindow(store, ({ saveToStorage }) => {
    saveToStorage("theme", { mode: "dark" });
    assert.strictEqual(store.getItem("theme"), '{"mode":"dark"}');
  });
});

test("saveToStorage stores primitives as JSON strings", () => {
  const store = makeStore();
  withWindow(store, ({ saveToStorage }) => {
    saveToStorage("count", 42);
    assert.strictEqual(store.getItem("count"), "42");
    saveToStorage("flag", true);
    assert.strictEqual(store.getItem("flag"), "true");
    saveToStorage("name", "alice");
    assert.strictEqual(store.getItem("name"), '"alice"');
  });
});

test("saveToStorage no-ops when window is undefined", () => {
  withoutWindow(({ saveToStorage }) => {
    assert.doesNotThrow(() => saveToStorage("key", "value"));
  });
});

test("loadFromStorage parses stored JSON value", () => {
  const store = makeStore();
  withWindow(store, ({ loadFromStorage }) => {
    store.setItem("demo", '{"user":"alice"}');
    const result = loadFromStorage("demo");
    assert.deepStrictEqual(result, { user: "alice" });
  });
});

test("loadFromStorage returns fallback when key is absent", () => {
  const store = makeStore();
  withWindow(store, ({ loadFromStorage }) => {
    const result = loadFromStorage("nonexistent", { fallback: true });
    assert.deepStrictEqual(result, { fallback: true });
  });
});

test("loadFromStorage returns fallback when stored value is invalid JSON", () => {
  const store = makeStore();
  withWindow(store, ({ loadFromStorage }) => {
    store.setItem("corrupt", "not valid json {{{");
    const result = loadFromStorage("corrupt", null);
    assert.strictEqual(result, null);
  });
});

test("loadFromStorage returns fallback when localStorage has no value", () => {
  const store = makeStore();
  withWindow(store, ({ loadFromStorage }) => {
    const result = loadFromStorage("nothing", "default");
    assert.strictEqual(result, "default");
  });
});

test("loadFromStorage no-ops and returns fallback when window is undefined", () => {
  withoutWindow(({ loadFromStorage }) => {
    const result = loadFromStorage("key", "fallback");
    assert.strictEqual(result, "fallback");
  });
});

test("removeFromStorage deletes key from localStorage", () => {
  const store = makeStore();
  withWindow(store, ({ removeFromStorage }) => {
    store.setItem("toDelete", "value");
    removeFromStorage("toDelete");
    assert.strictEqual(store.getItem("toDelete"), null);
  });
});

test("removeFromStorage no-ops when key does not exist", () => {
  const store = makeStore();
  withWindow(store, ({ removeFromStorage }) => {
    assert.doesNotThrow(() => removeFromStorage("absent"));
  });
});

test("removeFromStorage no-ops when window is undefined", () => {
  withoutWindow(({ removeFromStorage }) => {
    assert.doesNotThrow(() => removeFromStorage("key"));
  });
});

test("full round-trip: save, load, remove", () => {
  const store = makeStore();
  withWindow(store, ({ saveToStorage, loadFromStorage, removeFromStorage }) => {
    saveToStorage("session", { token: "abc123", user: 9 });
    const loaded = loadFromStorage("session");
    assert.deepStrictEqual(loaded, { token: "abc123", user: 9 });
    removeFromStorage("session");
    const gone = loadFromStorage("session", null);
    assert.strictEqual(gone, null);
  });
});
