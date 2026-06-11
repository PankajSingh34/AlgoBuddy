/**
 * Pure generator/function for Linked List Traversal operations.
 */

export function generateRandomListLogic() {
  const values = [
    "\u{1F436}", "\u{1F431}", "\u{1F42D}", "\u{1F439}", 
    "\u{1F430}", "\u{1F98A}", "\u{1F43B}", "\u{1F43C}",
  ];
  const size = Math.min(Math.floor(Math.random() * 3) + 3, values.length);
  const shuffledValues = [...values].sort(() => 0.5 - Math.random());

  // Generate stable addresses for each node.
  const addresses = Array.from({ length: size }, () =>
    `0x${Math.floor(Math.random() * 0x10000)
      .toString(16)
      .padStart(4, "0")}`
  );

  const newList = shuffledValues.slice(0, size).map((value, index) => ({
    value,
    id: Date.now() + index,
    address: addresses[index],
    next: index < size - 1 ? addresses[index + 1] : "NULL",
  }));

  return newList;
}
