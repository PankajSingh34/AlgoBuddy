export const complexityFunctions = {
  "O(1)": (n) => 1,

  "O(log n)": (n) => Math.log2(n),

  "O(n)": (n) => n,

  "O(n log n)": (n) => n * Math.log2(n),

  "O(n^2)": (n) => n * n,

  "O(n^3)": (n) => n * n * n,

  "O(2^n)": (n) => Math.pow(2, n / 5),
};

export const generateComplexityData = (maxN = 100) => {
  const data = [];

  for (let n = 1; n <= maxN; n += 1) {
    data.push({
      n,
      "O(1)": complexityFunctions["O(1)"](n),
      "O(log n)": complexityFunctions["O(log n)"](n),
      "O(n)": complexityFunctions["O(n)"](n),
      "O(n log n)": complexityFunctions["O(n log n)"](n),
      "O(n^2)": complexityFunctions["O(n^2)"](n),
      "O(n^3)": complexityFunctions["O(n^3)"](n),
      "O(2^n)": complexityFunctions["O(2^n)"](n),
    });
  }

  return data;
};
