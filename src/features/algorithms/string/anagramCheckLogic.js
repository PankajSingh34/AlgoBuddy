const anagramCheckLogic = (first = "listen", second = "silent") => {
  const normalize = (str) =>
    str.toLowerCase().replace(/\s+/g, "");

  const str1 = normalize(first);
  const str2 = normalize(second);

  const steps = [];

  // Step 1: Check lengths
  if (str1.length !== str2.length) {
    steps.push({
      step: 1,
      description: "The strings have different lengths, so they cannot be anagrams.",
    });

    return {
      input: { first, second },
      result: false,
      steps,
      complexity: {
        time: "O(1)",
        space: "O(1)",
      },
    };
  }

  const frequency = {};

  // Step 2: Count characters in first string
  for (const ch of str1) {
    frequency[ch] = (frequency[ch] || 0) + 1;

    steps.push({
      character: ch,
      frequency: { ...frequency },
      description: `Count '${ch}' in first string.`,
    });
  }

  // Step 3: Remove characters using second string
  for (const ch of str2) {
    if (!frequency[ch]) {
      steps.push({
        character: ch,
        frequency: { ...frequency },
        description: `'${ch}' does not exist or count became zero.`,
      });

      return {
        input: { first, second },
        result: false,
        steps,
        complexity: {
          time: "O(n)",
          space: "O(n)",
        },
      };
    }

    frequency[ch]--;

    steps.push({
      character: ch,
      frequency: { ...frequency },
      description: `Decrease count of '${ch}'.`,
    });
  }

  const isAnagram = Object.values(frequency).every(
    (count) => count === 0
  );

  steps.push({
    description: isAnagram
      ? "All character counts became zero. Strings are anagrams."
      : "Some character counts are not zero. Strings are not anagrams.",
  });

  return {
    input: { first, second },
    result: isAnagram,
    steps,
    complexity: {
      time: "O(n)",
      space: "O(n)",
    },
  };
};

export default anagramCheckLogic;