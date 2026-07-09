export const dpComplexity = {
  knapsack: {
    time: { best: "O(n * W)", average: "O(n * W)", worst: "O(n * W)" },
    space: "O(n * W)",
    explanation: "We fill an (n+1) x (W+1) table, visiting each cell exactly once - hence O(n*W) time and space.",
  },
  lcs: {
    time: { best: "O(m * n)", average: "O(m * n)", worst: "O(m * n)" },
    space: "O(m * n)",
    explanation: "We fill an (m+1) x (n+1) table comparing characters of both strings - hence O(m*n) time and space.",
  },
  "coin-change": {
    time: { best: "O(amount * coins)", average: "O(amount * coins)", worst: "O(amount * coins)" },
    space: "O(amount)",
    explanation: "For every amount from 1 to target, we try every coin - hence O(amount * coins) time, O(amount) space for the 1D table.",
  },
};

export function getOperationsCount(currentStepIndex) {
  return currentStepIndex + 1;
}
