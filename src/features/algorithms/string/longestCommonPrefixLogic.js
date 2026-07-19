const longestCommonPrefixLogic = (
  words = ["flower", "flow", "flight"]
) => {
  const steps = [];

  if (!words || words.length === 0) {
    return {
      input: words,
      result: "",
      steps: [
        {
          description: "The input array is empty.",
        },
      ],
      complexity: {
        time: "O(1)",
        space: "O(1)",
      },
    };
  }

  let prefix = words[0];

  steps.push({
    step: 1,
    currentPrefix: prefix,
    description: `Initial prefix is "${prefix}".`,
  });

  for (let i = 1; i < words.length; i++) {
    const currentWord = words[i];

    steps.push({
      step: steps.length + 1,
      currentPrefix: prefix,
      currentWord,
      description: `Comparing prefix "${prefix}" with "${currentWord}".`,
    });

    while (!currentWord.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);

      steps.push({
        step: steps.length + 1,
        currentPrefix: prefix,
        currentWord,
        description: `Prefix does not match. Shrinking prefix to "${prefix}".`,
      });

      if (prefix === "") {
        steps.push({
          step: steps.length + 1,
          currentPrefix: "",
          description:
            "No common prefix exists among all strings.",
        });

        return {
          input: words,
          result: "",
          steps,
          complexity: {
            time: "O(n × m)",
            space: "O(1)",
          },
        };
      }
    }
  }

  steps.push({
    step: steps.length + 1,
    currentPrefix: prefix,
    description: `Longest Common Prefix found: "${prefix}".`,
  });

  return {
    input: words,
    result: prefix,
    steps,
    complexity: {
      time: "O(n × m)",
      space: "O(1)",
    },
  };
};

export default longestCommonPrefixLogic;