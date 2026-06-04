/**
 * Pure generator functions for Queue data structure operations.
 * Yields frames representing the state of the operation.
 */

export function* enqueueGenerator(currentQueue, value) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  yield { type: 'start', operation: `Enqueuing "${value}" to rear...` };
  
  const nextQueue = [...currentQueue, value];
  
  yield { type: 'complete', queue: nextQueue, message: `"${value}" added to rear` };
}

export function* dequeueGenerator(currentQueue) {
  if (currentQueue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!' };
    return;
  }

  const dequeuedValue = currentQueue[0];
  yield { type: 'start', operation: `Dequeuing "${dequeuedValue}" from front...` };

  const nextQueue = currentQueue.slice(1);
  
  yield { type: 'complete', queue: nextQueue, message: `"${dequeuedValue}" removed from front` };
}
