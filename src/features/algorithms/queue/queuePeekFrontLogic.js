/**
 * Pure generator functions for Queue Peek-Front operation.
 * Yields frames representing the state of the operation.
 */

export function* peekFrontGenerator(queue) {
  if (queue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!', isFull: false };
    return;
  }

  const val = queue[0];
  yield { type: 'start', operation: `Peeking at front element “${val}” …` };
  
  yield { 
    type: 'complete', 
    message: `Front element is “${val}”` 
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
    yield { type: 'error', message: 'Queue is empty!', isFull: false };
    return;
  }

  const val = currentQueue[0];
  yield { type: 'start', operation: `Dequeuing “${val}” …` };

  const nextQueue = currentQueue.slice(1);
  
  yield { type: 'complete', queue: nextQueue, message: `“${val}” removed from front` };
}
