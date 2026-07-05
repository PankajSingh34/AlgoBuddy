// __tests__/components/storage.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/storage.test.js --colors=false

import { saveToStorage, loadFromStorage, removeFromStorage } from '@/utils/storage';

const makeMockLs = () => {
  const store = {};
  return {
    getItem: jest.fn((key) => (key in store ? store[key] : null)),
    setItem: jest.fn((key, value) => { store[key] = String(value); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
  };
};

const installLs = (mockLs) => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLs,
    writable: true,
    configurable: true,
  });
};

const uninstallLs = () => {
  Object.defineProperty(window, 'localStorage', {
    value: undefined,
    writable: true,
    configurable: true,
  });
};

// ── saveToStorage ─────────────────────────────────────────────────────────────

describe('saveToStorage', () => {
  let ls;
  beforeEach(() => {
    ls = makeMockLs();
    installLs(ls);
  });

  afterEach(() => { uninstallLs(); });

  test('stringifies and stores value in localStorage', () => {
    saveToStorage('myKey', { foo: 'bar' });
    expect(ls.setItem).toHaveBeenCalledTimes(1);
    expect(ls.setItem).toHaveBeenCalledWith(
      'myKey',
      JSON.stringify({ foo: 'bar' }),
    );
  });

  test('stores primitives as JSON strings', () => {
    saveToStorage('num', 42);
    expect(ls.setItem).toHaveBeenCalledWith('num', '42');
  });

  test('stores arrays correctly', () => {
    saveToStorage('arr', [1, 2, 3]);
    expect(ls.setItem).toHaveBeenCalledWith('arr', '[1,2,3]');
  });

  test('does not call localStorage when window is absent', () => {
    uninstallLs();
    expect(() => saveToStorage('k', 'v')).not.toThrow();
    expect(ls.setItem).not.toHaveBeenCalled();
  });
});

// ── loadFromStorage ───────────────────────────────────────────────────────────

describe('loadFromStorage', () => {
  let ls;
  beforeEach(() => {
    ls = makeMockLs();
    installLs(ls);
  });

  afterEach(() => { uninstallLs(); });

  test('returns parsed JSON when key exists and is valid JSON', () => {
    ls.getItem.mockReturnValue('{"a":1}');
    expect(loadFromStorage('myKey')).toEqual({ a: 1 });
    expect(ls.getItem).toHaveBeenCalledWith('myKey');
  });

  test('returns fallback when key does not exist', () => {
    ls.getItem.mockReturnValue(null);
    expect(loadFromStorage('missingKey', { fallback: true })).toEqual({ fallback: true });
  });

  test('returns fallback when item is empty string', () => {
    ls.getItem.mockReturnValue('');
    expect(loadFromStorage('emptyKey', 'FB')).toBe('FB');
  });

  test('returns fallback when item is not valid JSON', () => {
    ls.getItem.mockReturnValue('not-json-at-all');
    expect(loadFromStorage('corruptKey', null)).toBeNull();
  });

  test('returns fallback when getItem throws', () => {
    ls.getItem.mockImplementation(() => { throw new Error('storage error'); });
    expect(loadFromStorage('errorKey', 'default')).toBe('default');
  });

  test('returns fallback when window is absent', () => {
    uninstallLs();
    expect(loadFromStorage('anyKey', 'fallback')).toBe('fallback');
  });

  test('returns a number when localStorage stores a number string', () => {
    ls.getItem.mockReturnValue('42');
    expect(loadFromStorage('numKey')).toBe(42);
  });
});

// ── removeFromStorage ─────────────────────────────────────────────────────────

describe('removeFromStorage', () => {
  let ls;
  beforeEach(() => {
    ls = makeMockLs();
    installLs(ls);
  });

  afterEach(() => { uninstallLs(); });

  test('calls localStorage.removeItem with the correct key', () => {
    removeFromStorage('oldKey');
    expect(ls.removeItem).toHaveBeenCalledTimes(1);
    expect(ls.removeItem).toHaveBeenCalledWith('oldKey');
  });

  test('does not call localStorage when window is absent', () => {
    uninstallLs();
    expect(() => removeFromStorage('key')).not.toThrow();
    expect(ls.removeItem).not.toHaveBeenCalled();
  });
});
