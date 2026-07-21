export function longestSubstringLogic(input) {
  const steps = [];

  const map = new Map();

  let left = 0;
  let maxLength = 0;
  let bestSubstring = "";

  for (let right = 0; right < input.length; right++) {
    const currentChar = input[right];

    let action = `Checking '${currentChar}'`;

    // Duplicate found
    if (map.has(currentChar) && map.get(currentChar) >= left) {
      action = `Duplicate '${currentChar}' found. Move left pointer`;

      left = map.get(currentChar) + 1;
    }

    // Update latest index
    map.set(currentChar, right);

    // Current window
    const currentWindow = input.slice(left, right + 1);

    // Update best substring
    if (currentWindow.length > maxLength) {
      maxLength = currentWindow.length;
      bestSubstring = currentWindow;
    }

    // Save animation step
    steps.push({
      left,
      right,
      currentChar,
      currentWindow,
      bestSubstring,
      currentLength: currentWindow.length,
      maxLength,
      action,
      hashMap: Object.fromEntries(map),
    });
  }

  return {
    answer: maxLength,
    bestSubstring,
    steps,
  };
}