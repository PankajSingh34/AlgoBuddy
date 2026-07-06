// __tests__/components/jumpSearchLogic.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/jumpSearchLogic.test.js --colors=false
//
// Tests the jumpSearchGenerator pure generator from features/algorithms/array/jumpSearchLogic.js.

import { jumpSearchGenerator } from '@/features/algorithms/array/jumpSearchLogic.js';

function toArray(generator) {
  return [...generator];
}

describe('jumpSearchGenerator', () => {
  test('returns not_found immediately for empty array', () => {
    const frames = toArray(jumpSearchGenerator([], 5));
    expect(frames).toEqual([{ type: 'not_found' }]);
  });

  test('returns found when target is at index 0', () => {
    const frames = toArray(jumpSearchGenerator([1, 3, 5, 7, 9], 1));
    const last = frames.at(-1);
    expect(last.type).toBe('found');
    expect(last.index).toBe(0);
  });

  test('returns found when target is in the middle of the array', () => {
    const frames = toArray(jumpSearchGenerator([1, 3, 5, 7, 9], 5));
    const last = frames.at(-1);
    expect(last.type).toBe('found');
    expect(last.index).toBe(2);
  });

  test('returns found when target is at the last index', () => {
    const frames = toArray(jumpSearchGenerator([1, 3, 5, 7, 9], 9));
    const last = frames.at(-1);
    expect(last.type).toBe('found');
    expect(last.index).toBe(4);
  });

  test('returns not_found when target is beyond array bounds (larger than max)', () => {
    const frames = toArray(jumpSearchGenerator([1, 3, 5, 7, 9], 100));
    const last = frames.at(-1);
    expect(last.type).toBe('not_found');
  });

  test('returns not_found when target is smaller than min', () => {
    const frames = toArray(jumpSearchGenerator([1, 3, 5, 7, 9], -1));
    const last = frames.at(-1);
    expect(last.type).toBe('not_found');
  });

  test('single-element array: found when element matches', () => {
    const frames = toArray(jumpSearchGenerator([42], 42));
    const last = frames.at(-1);
    expect(last.type).toBe('found');
    expect(last.index).toBe(0);
  });

  test('single-element array: not_found when element does not match', () => {
    const frames = toArray(jumpSearchGenerator([42], 7));
    // Single element, arr[0]=42 < 7? No, so jumps to block_found then linear search
    const last = frames.at(-1);
    expect(last.type).toBe('not_found');
  });

  test('yields block_found frame before linear search begins', () => {
    const frames = toArray(jumpSearchGenerator([1, 3, 5, 7, 9], 5));
    const blockFoundIndex = frames.findIndex((f) => f.type === 'block_found');
    expect(blockFoundIndex).toBeGreaterThan(-1);
    // A checking frame should appear after block_found
    const checkingFrames = frames.filter((f) => f.type === 'checking');
    expect(checkingFrames.length).toBeGreaterThan(0);
  });

  test('yields jump frames during the jump phase', () => {
    // Use a larger array so there are multiple jumps
    const frames = toArray(jumpSearchGenerator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 15));
    const jumpFrames = frames.filter((f) => f.type === 'jump');
    expect(jumpFrames.length).toBeGreaterThan(0);
  });

  test('yields checking frames during the linear search phase', () => {
    const frames = toArray(jumpSearchGenerator([1, 3, 5, 7, 9], 7));
    const checkingFrames = frames.filter((f) => f.type === 'checking');
    expect(checkingFrames.length).toBeGreaterThan(0);
  });
});
