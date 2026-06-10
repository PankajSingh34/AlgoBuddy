/**
 * Pure generator logic for Linked List Merge operation.
 */

export function* mergeListsGenerator(list1, list2) {
  if (list1.length === 0 || list2.length === 0) {
    yield { type: 'error', message: 'Both lists must be generated.' };
    return;
  }

  yield { type: 'start' };

  // Note: The UI component generates lists and may not ensure they are strictly sorted.
  // We sort them here for the algorithmic merge logic.
  const sortedList1 = [...list1].sort((a, b) => a.value - b.value);
  const sortedList2 = [...list2].sort((a, b) => a.value - b.value);

  let i = 0;
  let j = 0;
  const result = [];

  while (i < sortedList1.length || j < sortedList2.length) {
    // Yield the current pointers for highlighting
    yield { type: 'compare', i, j, list1Len: sortedList1.length, list2Len: sortedList2.length };

    let nextNode;
    let source;

    if (
      j >= sortedList2.length ||
      (i < sortedList1.length && sortedList1[i].value <= sortedList2[j].value)
    ) {
      nextNode = { ...sortedList1[i], source: "list1" };
      source = 'list1';
      i++;
    } else {
      nextNode = { ...sortedList2[j], source: "list2" };
      source = 'list2';
      j++;
    }

    result.push(nextNode);

    // Yield the node that was added to the merged list
    yield {
      type: 'add',
      nextNode,
      source,
      currentIndex: source === 'list1' ? i - 1 : j - 1,
      mergedListSoFar: [...result],
    };
  }

  yield { type: 'complete', mergedList: result };
}
