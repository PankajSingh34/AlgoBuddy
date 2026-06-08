/**
 * Pure generator functions for Linked List Deletion operations.
 * Yields frames representing the operation state.
 */

const generateAddress = () =>
  `0x${Math.floor(Math.random() * 0x10000)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")}`;

export function* addNodeDeletionGen(currentList, inputValue) {
  if (!inputValue) {
    yield { type: 'error', message: 'Value is required' };
    return;
  }
  
  const newNode = {
    value: inputValue,
    id: Date.now(),
    address: generateAddress(),
    next: "NULL",
  };

  yield { type: 'start', action: 'add', newNode };

  let updatedList = [...currentList];
  if (updatedList.length > 0) {
    updatedList[updatedList.length - 1].next = newNode.address;
    updatedList.push(newNode);
  } else {
    updatedList = [newNode];
  }

  yield { type: 'complete', list: updatedList, message: `Added ${inputValue}` };
}

export function* deleteLastNodeGen(currentList) {
  if (currentList.length === 0) {
    yield { type: 'error', message: 'List is already empty' };
    return;
  }
  
  yield { type: 'start', action: 'delete_last', index: currentList.length - 1 };

  let updatedList = [...currentList];
  if (updatedList.length > 1) {
    updatedList.pop();
    updatedList[updatedList.length - 1].next = "NULL";
  } else {
    updatedList = [];
  }

  yield { type: 'complete', list: updatedList, message: 'Deleted last node' };
}
