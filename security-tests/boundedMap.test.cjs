const test = require("node:test");
const assert = require("node:assert/strict");

class BoundedMap {
  constructor(maxSize = 10000) {
    this.maxSize = maxSize;
    this._map = new Map();
  }

  get(key) {
    return this._map.get(key);
  }

  set(key, value) {
    const hadKey = this._map.has(key);
    const previous = hadKey ? this._map.get(key) : undefined;

    if (hadKey) {
      this._map.delete(key);
    } else if (this._map.size >= this.maxSize) {
      const oldest = this._map.keys().next().value;
      if (oldest !== undefined) {
        this._map.delete(oldest);
      }
    }

    this._map.set(key, value);
    return previous;
  }

  delete(key) {
    return this._map.delete(key);
  }

  entries() {
    return this._map.entries();
  }

  clear() {
    this._map.clear();
  }

  get size() {
    return this._map.size;
  }
}

test("returns undefined for missing entries", () => {
  const map = new BoundedMap(2);
  assert.equal(map.get("missing"), undefined);
  assert.equal(map.size, 0);
});

test("set returns the previous value when replacing an existing key", () => {
  const map = new BoundedMap(2);
  assert.equal(map.set("a", 1), undefined);
  assert.equal(map.set("a", 2), 1);
  assert.equal(map.get("a"), 2);
  assert.equal(map.size, 1);
});

test("evicts the oldest entry when maxSize is exceeded", () => {
  const map = new BoundedMap(2);
  map.set("a", 1);
  map.set("b", 2);
  map.set("c", 3);

  assert.equal(map.get("a"), undefined);
  assert.equal(map.get("b"), 2);
  assert.equal(map.get("c"), 3);
  assert.equal(map.size, 2);
});

test("delete returns true for existing keys and false for missing keys", () => {
  const map = new BoundedMap(2);
  map.set("a", 1);

  assert.equal(map.delete("a"), true);
  assert.equal(map.delete("a"), false);
  assert.equal(map.size, 0);
});

test("entries preserves insertion order after updates", () => {
  const map = new BoundedMap(3);
  map.set("a", 1);
  map.set("b", 2);
  map.set("a", 3);

  assert.deepEqual(Array.from(map.entries()), [["b", 2], ["a", 3]]);
});

test("clear removes all entries", () => {
  const map = new BoundedMap(2);
  map.set("a", 1);
  map.set("b", 2);
  map.clear();

  assert.equal(map.size, 0);
  assert.deepEqual(Array.from(map.entries()), []);
});
