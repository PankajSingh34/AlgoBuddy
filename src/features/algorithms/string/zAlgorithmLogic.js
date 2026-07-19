const zAlgorithmLogic = {
  name: "Z Algorithm",

  description:
    "The Z Algorithm is an efficient linear-time string matching algorithm that constructs a Z-array, where each element represents the length of the longest substring starting from that position that matches the prefix of the string. It is widely used for exact pattern matching and other string-processing problems.",

  category: "String",

  difficulty: "Medium",

  timeComplexity: {
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(n + m)",
  },

  spaceComplexity: "O(n + m)",

  steps: [
    "Concatenate the pattern, a separator ('$'), and the text into a single string.",
    "Initialize the Z-array with all zeros.",
    "Maintain a Z-box using Left (L) and Right (R) pointers.",
    "Reuse previously computed Z-values whenever the current index lies inside the Z-box.",
    "Extend the current match by comparing characters outside the Z-box.",
    "Update the Left and Right pointers if a longer Z-box is found.",
    "Whenever a Z-value equals the pattern length, report a pattern match.",
  ],

  pseudocode: [
    "Create S = Pattern + '$' + Text.",
    "Initialize Z array.",
    "Set L = R = 0.",
    "For each index i from 1 to S.length - 1:",
    "    If i <= R, reuse previously computed Z value.",
    "    Extend the match while characters are equal.",
    "    Update L and R if the current match extends further.",
    "If Z[i] equals Pattern.length, record a match.",
  ],

  applications: [
    "Pattern Matching",
    "String Searching",
    "Text Editors",
    "Search Engines",
    "DNA Sequence Analysis",
    "Bioinformatics",
    "Plagiarism Detection",
    "Compiler Design",
    "Data Compression",
  ],
};

export default zAlgorithmLogic;