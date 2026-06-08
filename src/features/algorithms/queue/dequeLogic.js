/**
 * Pure generator functions for Deque (Double-Ended Queue) operations.
 * Yields frames representing the operation state.
 */

export function* enqueueFrontGenerator(currentDeque, value) {
  if (!value) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }
  yield { type: 'start', message: `Enqueuing "${value}" at front …`, action: 'enqueue_front' };
  yield { type: 'complete', deque: [value, ...currentDeque], message: `"${value}" added to front` };
}

export function* enqueueRearGenerator(currentDeque, value) {
  if (!value) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }
  yield { type: 'start', message: `Enqueuing "${value}" at rear …`, action: 'enqueue_rear' };
  yield { type: 'complete', deque: [...currentDeque, value], message: `"${value}" added to rear` };
}

export function* dequeueFrontGenerator(currentDeque) {
  if (currentDeque.length === 0) {
    yield { type: 'error', message: 'Deque is empty!' };
    return;
  }
  const front = currentDeque[0];
  yield { type: 'start', message: `Dequeuing "${front}" from front …`, action: 'dequeue_front' };
  yield { type: 'complete', deque: currentDeque.slice(1), message: `"${front}" removed from front` };
}

export function* dequeueRearGenerator(currentDeque) {
  if (currentDeque.length === 0) {
    yield { type: 'error', message: 'Deque is empty!' };
    return;
  }
  const rear = currentDeque[currentDeque.length - 1];
  yield { type: 'start', message: `Dequeuing "${rear}" from rear …`, action: 'dequeue_rear' };
  yield { type: 'complete', deque: currentDeque.slice(0, -1), message: `"${rear}" removed from rear` };
}
