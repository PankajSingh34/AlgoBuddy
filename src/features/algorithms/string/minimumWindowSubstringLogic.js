const minimumWindowSubstringLogic = {
  name: "Minimum Window Substring",

  description:
    "Minimum Window Substring is a classic Sliding Window algorithm that finds the smallest substring of a given string containing all the characters of a target string, including duplicate occurrences. It efficiently expands and contracts a window while maintaining character frequencies.",

  category: "String",

  difficulty: "Hard",

  timeComplexity: {
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(n + m)",
  },

  spaceComplexity: "O(m)",

  steps: [
    "Create a frequency map of all characters in the target string.",
    "Initialize two pointers (left and right) representing the sliding window.",
    "Expand the window by moving the right pointer and updating character frequencies.",
    "When all required characters are present, attempt to shrink the window from the left.",
    "Update the minimum window whenever a smaller valid window is found.",
    "Continue expanding and shrinking until the right pointer reaches the end of the string.",
    "Return the smallest valid substring if found; otherwise return an empty string.",
  ],

  pseudocode: [
    "Create frequency map for target string.",
    "Initialize left = 0, right = 0.",
    "Maintain required and formed character counts.",
    "Expand window by moving right pointer.",
    "If window is valid, update minimum answer.",
    "Shrink window by moving left pointer.",
    "Repeat until right reaches end.",
    "Return minimum window substring.",
  ],

  applications: [
    "Pattern Matching",
    "Search Engines",
    "Text Processing",
    "Natural Language Processing (NLP)",
    "DNA Sequence Analysis",
    "Log File Analysis",
    "Streaming Data Processing",
    "Coding Interview Problems",
  ],
};

export default minimumWindowSubstringLogic;