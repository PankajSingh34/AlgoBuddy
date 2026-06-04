/**
 * Pure logic function for Linked List Insertion operation.
 * Yields the new node and the updated list state.
 */

export function generateAddress() {
  return `0x${Math.floor(Math.random() * 0x10000)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")}`;
}

export function* insertionGenerator(currentList, inputValue) {
  if (!inputValue) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  const newNode = {
    value: inputValue,
    id: Date.now(),
    address: generateAddress(),
    next: "NULL",
  };

  yield { type: 'start', newNode };

  let nextList;
  if (currentList.length > 0) {
    nextList = [...currentList];
    nextList[nextList.length - 1].next = newNode.address;
    nextList.push(newNode);
  } else {
    nextList = [newNode];
  }

  yield { type: 'complete', list: nextList, newNode };
}
