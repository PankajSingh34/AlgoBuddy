/**
 * Pure generator logic for Linked List Comparison.
 */

export function* compareListsGenerator(list1, list2) {
  if (list1.length === 0 || list2.length === 0) {
    yield { type: 'error', message: 'Both lists must be generated.' };
    return;
  }

  yield { type: 'start' };

  const maxLength = Math.max(list1.length, list2.length);
  let areSame = true;

  for (let i = 0; i < maxLength; i++) {
    const node1 = list1[i];
    const node2 = list2[i];

    // Yield the current pointers for highlighting
    yield { type: 'compare', index: i };

    if (!node1 || !node2 || node1.value !== node2.value) {
      areSame = false;
      yield {
        type: 'complete',
        match: false,
        index: i,
        value1: node1?.value,
        value2: node2?.value,
      };
      return;
    }
  }

  if (areSame) {
    yield { type: 'complete', match: true };
  }
}
