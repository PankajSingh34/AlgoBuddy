const kmpAlgorithmLogic = {
  name: "KMP Algorithm",

  description:
    "The Knuth-Morris-Pratt (KMP) Algorithm efficiently searches for a pattern in a text by preprocessing the pattern to build the Longest Prefix Suffix (LPS) array. This allows the algorithm to skip unnecessary comparisons after a mismatch.",

  category: "String",

  difficulty: "Medium",

  timeComplexity: {
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(n + m)",
  },

  spaceComplexity: "O(m)",

  steps: [
    "Build the Longest Prefix Suffix (LPS) array for the pattern.",
    "Initialize two pointers: one for the text and one for the pattern.",
    "Compare the current characters of the text and pattern.",
    "If the characters match, move both pointers forward.",
    "If all pattern characters are matched, record the occurrence.",
    "On mismatch, use the LPS array to update the pattern pointer instead of restarting.",
    "Continue until the end of the text is reached.",
  ],

  pseudocode: [
    "Compute the LPS array for the pattern.",
    "Initialize text index i = 0 and pattern index j = 0.",
    "While i < text length:",
    "    If text[i] == pattern[j], increment both i and j.",
    "    If j == pattern length, report a match and set j = LPS[j - 1].",
    "    Else if mismatch occurs:",
    "        If j != 0, set j = LPS[j - 1].",
    "        Otherwise, increment i.",
  ],

  applications: [
    "Text Editors (Find and Replace)",
    "Search Engines",
    "DNA Sequence Matching",
    "Plagiarism Detection",
    "Compiler Design",
    "Bioinformatics",
    "Pattern Matching Systems",
  ],
};

export default kmpAlgorithmLogic;