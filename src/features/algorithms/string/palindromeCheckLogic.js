export function* palindromeCheckGenerator(str) {
  let left = 0;
  let right = str.length - 1;

  const matched = [];

  let step = 1;

  while (left < right) {
    yield {
      type: "compare",
      left,
      right,
      leftChar: str[left],
      rightChar: str[right],
      matched: [...matched],
      mismatch: [],
      step,
    };

    if (str[left] !== str[right]) {
      yield {
        type: "mismatch",
        left,
        right,
        leftChar: str[left],
        rightChar: str[right],
        matched: [...matched],
        mismatch: [left, right],
        result: false,
        step,
      };

      return;
    }

    matched.push(left);
    matched.push(right);

    yield {
      type: "match",
      left,
      right,
      leftChar: str[left],
      rightChar: str[right],
      matched: [...matched],
      mismatch: [],
      step,
    };

    left++;
    right--;
    step++;
  }

  // Middle character (odd-length strings)
  if (left === right) {
    matched.push(left);
  }

  yield {
    type: "success",
    left,
    right,
    matched: [...matched],
    mismatch: [],
    result: true,
    step,
  };
}