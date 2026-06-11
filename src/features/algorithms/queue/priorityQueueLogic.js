/**
 * Pure generator functions for Priority Queue operations.
 * Yields frames representing the operation state.
 */

export function* insertGenerator(currentPq, value, priorityStr) {
  if (!value || priorityStr === "") {
    yield { type: 'error', message: 'Please enter both value and priority' };
    return;
  }
  const pri = Number(priorityStr);
  if (isNaN(pri)) {
    yield { type: 'error', message: 'Priority must be a number' };
    return;
  }

  yield { type: 'start', message: `Inserting "${value}" with priority ${pri} …`, action: 'insert' };
  
  const newEl = { val: value, pri };
  const newPq = [...currentPq, newEl].sort((a, b) => a.pri - b.pri);
  
  yield { type: 'complete', pq: newPq, message: `"${value}" inserted` };
}

export function* extractMinGenerator(currentPq) {
  if (currentPq.length === 0) {
    yield { type: 'error', message: 'Priority queue is empty!' };
    return;
  }
  
  const minEl = currentPq[0];
  yield { type: 'start', message: `Extracting min element "${minEl.val}" …`, action: 'extract_min' };
  
  yield { type: 'complete', pq: currentPq.slice(1), message: `"${minEl.val}" (priority ${minEl.pri}) removed` };
}
