// heapVisualizerLogic.js
function compare(a, b, type) {
  return type === 'min' ? a < b : a > b;
}
function parentIndex(i) { return Math.floor((i - 1) / 2); }
function leftChildIndex(i) { return 2 * i + 1; }
function rightChildIndex(i) { return 2 * i + 2; }

export function generateInsertSteps(arr, value, type = 'min') {
  const steps = [];
  const heap = [...arr, value];
  let i = heap.length - 1;
  steps.push({ array: [...heap], comparing: [], swapping: [i], action: `Inserted ${value} at index ${i} (end of array)` });
  while (i > 0) {
    const p = parentIndex(i);
    steps.push({ array: [...heap], comparing: [i, p], swapping: [], action: `Comparing node ${heap[i]} (index ${i}) with parent ${heap[p]} (index ${p})` });
    if (compare(heap[i], heap[p], type)) {
      [heap[i], heap[p]] = [heap[p], heap[i]];
      steps.push({ array: [...heap], comparing: [], swapping: [i, p], action: `Swapped ${heap[p]} and ${heap[i]} (bubble up)` });
      i = p;
    } else {
      steps.push({ array: [...heap], comparing: [], swapping: [], action: `Heap property satisfied. Stopping bubble-up.` });
      break;
    }
  }
  return steps;
}

export function generateExtractSteps(arr, type = 'min') {
  const steps = [];
  if (arr.length === 0) return steps;
  const heap = [...arr];
  const removedValue = heap[0];
  const last = heap.pop();
  steps.push({ array: [...heap, last], comparing: [], swapping: [0, heap.length], action: `Removing root (${removedValue}). Moving last element (${last}) to root.` });
  if (heap.length === 0) {
    steps.push({ array: [], comparing: [], swapping: [], action: 'Heap is now empty.' });
    return steps;
  }
  heap[0] = last;
  steps.push({ array: [...heap], comparing: [], swapping: [0], action: `Root is now ${last}. Starting bubble-down (heapify-down).` });
  let i = 0;
  while (true) {
    const l = leftChildIndex(i);
    const r = rightChildIndex(i);
    let target = i;
    if (l < heap.length) {
      steps.push({ array: [...heap], comparing: [target, l], swapping: [], action: `Comparing node ${heap[target]} (index ${target}) with left child ${heap[l]} (index ${l})` });
      if (compare(heap[l], heap[target], type)) target = l;
    }
    if (r < heap.length) {
      steps.push({ array: [...heap], comparing: [target, r], swapping: [], action: `Comparing node ${heap[target]} (index ${target}) with right child ${heap[r]} (index ${r})` });
      if (compare(heap[r], heap[target], type)) target = r;
    }
    if (target === i) {
      steps.push({ array: [...heap], comparing: [], swapping: [], action: 'Heap property satisfied. Stopping bubble-down.' });
      break;
    }
    [heap[i], heap[target]] = [heap[target], heap[i]];
    steps.push({ array: [...heap], comparing: [], swapping: [i, target], action: `Swapped ${heap[target]} and ${heap[i]} (bubble down)` });
    i = target;
  }
  return steps;
}

export function generateHeapifySteps(arr, type = 'min') {
  const steps = [];
  const heap = [...arr];
  const n = heap.length;
  steps.push({ array: [...heap], comparing: [], swapping: [], action: 'Starting build-heap (bottom-up heapify).' });
  for (let start = Math.floor(n / 2) - 1; start >= 0; start--) {
    let i = start;
    while (true) {
      const l = leftChildIndex(i);
      const r = rightChildIndex(i);
      let target = i;
      if (l < n) {
        steps.push({ array: [...heap], comparing: [target, l], swapping: [], action: `Comparing node ${heap[target]} (index ${target}) with left child ${heap[l]} (index ${l})` });
        if (compare(heap[l], heap[target], type)) target = l;
      }
      if (r < n) {
        steps.push({ array: [...heap], comparing: [target, r], swapping: [], action: `Comparing node ${heap[target]} (index ${target}) with right child ${heap[r]} (index ${r})` });
        if (compare(heap[r], heap[target], type)) target = r;
      }
      if (target === i) break;
      [heap[i], heap[target]] = [heap[target], heap[i]];
      steps.push({ array: [...heap], comparing: [], swapping: [i, target], action: `Swapped ${heap[target]} and ${heap[i]}` });
      i = target;
    }
  }
  steps.push({ array: [...heap], comparing: [], swapping: [], action: 'Heap build complete.' });
  return steps;
}

export function computeTreeLayout(arr) {
  const positions = [];
  arr.forEach((_, i) => {
    const level = Math.floor(Math.log2(i + 1));
    const firstIndexOfLevel = Math.pow(2, level) - 1;
    const posInLevel = i - firstIndexOfLevel;
    const nodesInLevel = Math.pow(2, level);
    const x = (posInLevel + 0.5) / nodesInLevel;
    const y = level;
    positions.push({ index: i, x, y, parent: i === 0 ? null : parentIndex(i) });
  });
  return positions;
}
