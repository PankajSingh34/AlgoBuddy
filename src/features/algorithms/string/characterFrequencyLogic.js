const characterFrequencyLogic = (input = "banana") => {
  const frequency = {};
  const steps = [];

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (frequency[char]) {
      frequency[char]++;
    } else {
      frequency[char] = 1;
    }

    steps.push({
      index: i,
      character: char,
      frequency: { ...frequency },
      description: `Processed '${char}' → Frequency = ${frequency[char]}`,
    });
  }

  return {
    input,
    result: frequency,
    steps,
    complexity: {
      time: "O(n)",
      space: "O(k)",
    },
  };
};

export default characterFrequencyLogic;