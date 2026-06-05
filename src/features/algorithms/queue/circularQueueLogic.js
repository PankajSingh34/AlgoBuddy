/**
 * Pure generator functions for Circular Queue data structure operations.
 * Yields frames representing the state of the operation.
 */

const wrap = (idx, maxSize) => (idx + maxSize) % maxSize;

export function* enqueueCircularGenerator(queue, front, rear, count, maxSize, inputValue) {
  if (!inputValue || (typeof inputValue === 'string' && !inputValue.trim())) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }
  if (count === maxSize) {
    yield { type: 'error', message: 'Circular queue is full!' };
    return;
  }
  
  yield { type: 'start', operation: `Enqueuing "${inputValue}" at rear …` };
  
  const newRear = wrap(rear + 1, maxSize);
  const newQ = [...queue];
  newQ[newRear] = inputValue;
  
  yield { 
    type: 'complete', 
    queue: newQ, 
    rear: newRear, 
    count: count + 1, 
    message: `"${inputValue}" added` 
  };
}

export function* dequeueCircularGenerator(queue, front, rear, count, maxSize) {
  if (count === 0) {
    yield { type: 'error', message: 'Circular queue is empty!' };
    return;
  }

  const item = queue[front];
  yield { type: 'start', operation: `Dequeuing "${item}" from front …` };

  const newQ = [...queue];
  newQ[front] = null;
  
  yield { 
    type: 'complete', 
    queue: newQ, 
    front: wrap(front + 1, maxSize), 
    count: count - 1, 
    message: `"${item}" removed` 
  };
}

export function* checkEmptyCircularGenerator(count) {
  yield { type: 'start', operation: 'Checking if empty …' };
  yield { 
    type: 'complete', 
    message: count === 0 ? "Circular queue is EMPTY" : "Circular queue is NOT empty" 
  };
}

export function* checkFullCircularGenerator(count, maxSize) {
  yield { type: 'start', operation: 'Checking if full …' };
  yield { 
    type: 'complete', 
    message: count === maxSize ? "Circular queue is FULL" : "Circular queue is NOT full" 
  };
}
