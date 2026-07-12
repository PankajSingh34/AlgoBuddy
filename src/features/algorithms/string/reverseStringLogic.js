export function* reverseStringGenerator(input) {
  if (!input || input.length === 0) {
    yield {
      type: "empty",
      array: [],
      left: -1,
      right: -1,
      explanation: "Input string is empty.",
      step: 0,
    };
    return;
  }

  const arr = input.split("");
  let left = 0;
  let right = arr.length - 1;
  let step = 1;

  while (left < right) {
    // Highlight current characters
    yield {
      type: "compare",
      array: [...arr],
      left,
      right,
      explanation: `Step ${step}: Compare '${arr[left]}' and '${arr[right]}'.`,
      step,
    };

    // Swap characters
    [arr[left], arr[right]] = [arr[right], arr[left]];

    yield {
      type: "swap",
      array: [...arr],
      left,
      right,
      explanation: `Step ${step}: Swapped '${arr[right]}' with '${arr[left]}'.`,
      step,
    };

    left++;
    right--;
    step++;
  }

  yield {
    type: "complete",
    array: [...arr],
    left: -1,
    right: -1,
    explanation: `Reverse completed successfully. Final string: ${arr.join("")}`,
    step,
  };
}