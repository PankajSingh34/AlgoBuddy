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

  yield {
    list: [...currentList],
    newNode: newNode,
    action: 'add',
    phase: 'start',
    explanation: `Creating node with value "${inputValue}".`
  };

  let updatedList = [...currentList];
  if (updatedList.length > 0) {
    updatedList[updatedList.length - 1] = { ...updatedList[updatedList.length - 1], next: newNode.address };
    updatedList.push(newNode);
  } else {
    updatedList = [newNode];
  }

  yield {
    list: updatedList,
    newNode: null,
    action: 'add',
    phase: 'complete',
    explanation: `Added node with value "${inputValue}".`
  };
}

export function* deleteLastNodeGen(currentList) {
  if (currentList.length === 0) {
    yield { type: 'error', message: 'List is already empty' };
    return;
  }
  
  const targetIndex = currentList.length - 1;

  if (currentList.length > 1) {
    for (let i = 0; i < currentList.length - 1; i++) {
        yield {
            list: [...currentList],
            action: 'delete_last',
            phase: 'traverse',
            currentNodeIndex: i,
            explanation: `Traversing... currently at node with value "${currentList[i].value}". Looking for the second to last node.`
        };
    }
    
    yield {
        list: [...currentList],
        action: 'delete_last',
        phase: 'found_prev',
        currentNodeIndex: currentList.length - 2,
        targetNodeIndex: targetIndex,
        explanation: `Found the second to last node. Its "next" pointer will be updated to NULL.`
    };
  } else {
    yield {
        list: [...currentList],
        action: 'delete_last',
        phase: 'found_prev',
        currentNodeIndex: -1,
        targetNodeIndex: targetIndex,
        explanation: `Only one node in the list. It will be removed.`
    };
  }

  let updatedList = [...currentList];
  if (updatedList.length > 1) {
    updatedList.pop();
    updatedList[updatedList.length - 1] = { ...updatedList[updatedList.length - 1], next: "NULL" };
  } else {
    updatedList = [];
  }

  yield {
    list: updatedList,
    action: 'delete_last',
    phase: 'complete',
    currentNodeIndex: -1,
    targetNodeIndex: -1,
    explanation: 'Deleted the last node.'
  };
}
