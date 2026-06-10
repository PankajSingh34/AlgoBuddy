/**
 * Pure generator functions for Single-Ended Queue operations.
 * Yields frames representing the state of the operation.
 */

export function* enqueueRearGenerator(currentQueue, value) {
  const val = typeof value === 'string' ? value.trim() : value;
  if (!val) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  yield { type: 'start', operation: `Enqueuing "${val}" at rear …` };
  
  const nextQueue = [...currentQueue, val];
  
  yield { type: 'complete', queue: nextQueue, message: `"${val}" added to rear` };
}

export function* dequeueFrontGenerator(currentQueue) {
  if (currentQueue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!' };
    return;
  }

  const val = currentQueue[0];
  yield { type: 'start', operation: `Dequeuing "${val}" from front …` };

  const nextQueue = currentQueue.slice(1);
  
  yield { type: 'complete', queue: nextQueue, message: `"${val}" removed from front` };
}

export function* peekFrontGenerator(queue) {
  if (queue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!' };
    return;
  }

  const val = queue[0];
  yield { type: 'start', operation: `Front element: "${val}"` };
  
  yield { type: 'complete', message: `Front element: "${val}"` };
}

export function* peekRearGenerator(queue) {
  if (queue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!' };
    return;
  }

  const val = queue[queue.length - 1];
  yield { type: 'start', operation: `Rear element: "${val}"` };
  
  yield { type: 'complete', message: `Rear element: "${val}"` };
}
