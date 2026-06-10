/**
 * Pure generator functions for Queue IsFull operation.
 * Yields frames representing the state of the operation.
 */

export function* checkFullGenerator(queue, capacity) {
  yield { type: 'start', operation: 'Checking if queue is full …' };
  
  const full = queue.length >= capacity;
  
  yield { 
    type: 'complete', 
    isFull: full, 
    message: full ? 'Queue is FULL' : 'Queue is NOT full' 
  };
}

export function* enqueueGenerator(currentQueue, value, capacity) {
  if (currentQueue.length >= capacity) {
    yield { type: 'error', message: 'Queue is full!' };
    return;
  }

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
    yield { type: 'error', message: 'Queue is empty!', isFull: false };
    return;
  }

  const val = currentQueue[0];
  yield { type: 'start', operation: `Dequeuing “${val}” …` };

  const nextQueue = currentQueue.slice(1);
  
  yield { type: 'complete', queue: nextQueue, message: `“${val}” removed from front` };
}
