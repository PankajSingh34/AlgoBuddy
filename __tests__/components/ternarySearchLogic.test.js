// __tests__/components/ternarySearchLogic.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/ternarySearchLogic.test.js --colors=false
//
// Tests the ternarySearchGenerator pure generator from features/algorithms/array/ternarySearchLogic.js.

import { ternarySearchGenerator } from '@/features/algorithms/array/ternarySearchLogic.js';

function toArray(generator) {
  return [...generator];
}

describe('ternarySearchGenerator', () => {
  test('returns not_found for empty array', () => {
    const frames = toArray(ternarySearchGenerator([], 5));
    expect(frames[0].type).toBe('not_found');
  });

  test('returns found_mid1 when target is at mid1 position', () => {
    // For arr of length 3: mid1 = 0, mid2 = 2
    const frames = toArray(ternarySearchGenerator([1, 5, 9], 1));
    const last = frames.at(-1);
    expect(last.type).toBe('found_mid1');
    expect(last.mid1).toBe(0);
  });

  test('returns found_mid2 when target is at mid2 position', () => {
    const frames = toArray(ternarySearchGenerator([1, 5, 9], 9));
    const last = frames.at(-1);
    expect(last.type).toBe('found_mid2');
    expect(last.mid2).toBe(2);
  });

  test('returns not_found when target is not in array', () => {
    const frames = toArray(ternarySearchGenerator([1, 5, 9, 13, 17], 100));
    const last = frames.at(-1);
    expect(last.type).toBe('not_found');
  });

  test('yields discard_right_two_thirds when target < arr[mid1]', () => {
    const frames = toArray(ternarySearchGenerator([1, 5, 9, 13, 17, 21, 25], 3));
    const discardFrame = frames.find((f) => f.type === 'discard_right_two_thirds');
    expect(discardFrame).toBeDefined();
    expect(frames.at(-1).type).toBe('not_found');
  });

  test('yields discard_left_two_thirds when target > arr[mid2]', () => {
    const frames = toArray(ternarySearchGenerator([1, 5, 9, 13, 17, 21, 25], 23));
    const discardFrame = frames.find((f) => f.type === 'discard_left_two_thirds');
    expect(discardFrame).toBeDefined();
    expect(frames.at(-1).type).toBe('not_found');
  });

  test('yields discard_outer_thirds when arr[mid1] < target < arr[mid2]', () => {
    // For [1,2,3,4,5,6]: l=0,h=5, mid1=1,mid2=4; arr[1]=2,arr[4]=5; target=4
    // 2 < 4 < 5 so discard outer thirds: l=mid1+1=2, h=mid2-1=3
    const frames = toArray(ternarySearchGenerator([1, 2, 3, 4, 5, 6], 4));
    const discardFrame = frames.find((f) => f.type === 'discard_outer_thirds');
    expect(discardFrame).toBeDefined();
    // After discarding outer thirds, l=2,h=3, mid1=2,mid2=3; arr[3]=4 found_mid2
    const last = frames.at(-1);
    expect(last.type).toBe('found_mid2');
    expect(last.mid2).toBe(3);
  });

  test('step counter increments each iteration', () => {
    const frames = toArray(ternarySearchGenerator([1, 5, 9, 13, 17], 13));
    const checkingFrames = frames.filter((f) => f.type === 'checking');
    for (let i = 0; i < checkingFrames.length; i++) {
      if (i > 0) {
        expect(checkingFrames[i].step).toBe(checkingFrames[i - 1].step + 1);
      }
    }
  });

  test('checking frames include correct l, h, mid1, mid2 values', () => {
    const frames = toArray(ternarySearchGenerator([1, 5, 9, 13, 17, 21, 25, 29, 33], 21));
    const firstChecking = frames.find((f) => f.type === 'checking');
    expect(firstChecking).toBeDefined();
    expect(typeof firstChecking.l).toBe('number');
    expect(typeof firstChecking.h).toBe('number');
    expect(typeof firstChecking.mid1).toBe('number');
    expect(typeof firstChecking.mid2).toBe('number');
  });
});
