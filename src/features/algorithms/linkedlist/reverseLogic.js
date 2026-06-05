/**
 * Pure generator function for Reversing a Linked List.
 * Yields state frames representing the pointers and list state.
 */

export function* reverseGenerator(list) {
  if (list.length === 0) return;

  const nodes = list.map((node) => ({ ...node }));
  let prevIndex = -1;
  let currentIndex = 0;
  let nextIndex = nodes[currentIndex] && nodes[currentIndex].next !== "NULL" ? currentIndex + 1 : -1;

  yield {
    type: 'start',
    prevIndex,
    currentIndex,
    nextIndex,
    list: [...nodes]
  };

  while (currentIndex !== -1) {
    yield {
      type: 'step_pointers',
      prevIndex,
      currentIndex,
      nextIndex,
      list: [...nodes]
    };

    const nextIdxHex = prevIndex === -1 ? "NULL" : `0x${(1000 + prevIndex).toString(16).padStart(4, "0")}`;
    nodes[currentIndex].next = nextIdxHex;

    yield {
      type: 'step_update_link',
      prevIndex,
      currentIndex,
      nextIndex,
      list: [...nodes]
    };

    prevIndex = currentIndex;
    currentIndex = nextIndex;
    nextIndex = currentIndex !== -1 && nodes[currentIndex].next !== "NULL" ? currentIndex + 1 : -1;
  }

  yield {
    type: 'complete',
    prevIndex: -1,
    currentIndex: -1,
    nextIndex: -1,
    list: [...nodes]
  };
}
