/**
 * Pure generator functions for Queue IsEmpty operation.
 * Yields frames representing the state of the operation.
 */

export function* checkEmptyGenerator(queue) {
  yield { type: 'start', operation: 'Checking if queue is empty …' };
  
  const empty = queue.length === 0;
  
  yield { 
    type: 'complete', 
    isEmpty: empty, 
    message: empty ? 'Queue is empty' : 'Queue is NOT empty' 
  };
}

export function* enqueueGenerator(currentQueue, value) {
  const val = typeof value === 'string' ? value.trim() : value;
  if (!val) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  yield { type: 'start', operation: `Enqueuing “${val}” …` };
  
  const nextQueue = [...currentQueue, val];
  
  yield { type: 'complete', queue: nextQueue, message: `“${val}” added to rear` };
}

export function* dequeueGenerator(currentQueue) {
  if (currentQueue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!', isEmpty: true };
    return;
  }

  const val = currentQueue[0];
  yield { type: 'start', operation: `Dequeuing “${val}” …` };

  const nextQueue = currentQueue.slice(1);
  
  yield { type: 'complete', queue: nextQueue, message: `“${val}” removed from front` };
}
