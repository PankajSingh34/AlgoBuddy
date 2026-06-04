/**
 * lib/mockInterviewBank.js
 * ------------------------
 * Static problem bank — 30 problems spanning 6 algorithm categories
 * × 4 difficulty levels (easy/medium/hard/expert).
 *
 * Each problem shape:
 * {
 *   id          : string  (slug, unique)
 *   supabaseId  : string | null  (set after DB seed, null initially)
 *   title       : string
 *   algorithm   : string  (matches setup screen options)
 *   difficulty  : "easy" | "medium" | "hard" | "expert"
 *   description : string  (markdown)
 *   constraints : string  (markdown)
 *   examples    : [{input, output, explanation?}]
 *   starterCode : { javascript, python }
 *   testCases   : [{id, inputArgs, expectedOutput, isHidden}]
 *   hints       : string[]  (ordered — show one at a time)
 *   visualizerSlug : string | null
 * }
 *
 * Usage:
 *   import { pickProblems, ALGORITHMS, DIFFICULTIES } from "@/lib/mockInterviewBank";
 *   const [problem] = pickProblems({ algorithm: "arrays", difficulty: "medium", count: 1 });
 */

export const ALGORITHMS = ["arrays", "strings", "trees", "graphs", "dp", "sorting"];

export const DIFFICULTIES = ["easy", "medium", "hard", "expert"];

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM BANK
// ─────────────────────────────────────────────────────────────────────────────
const problems = [

  // ══════════════════════════════════════════════════════════
  // ARRAYS
  // ══════════════════════════════════════════════════════════
  {
    id: "two-sum",
    supabaseId: null,
    title: "Two Sum",
    algorithm: "arrays",
    difficulty: "easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.",
    constraints:
      "- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`\n- `-10^9 <= target <= 10^9`",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums, target) {
  // your code here
}`,
      python: `def solution(nums: list[int], target: int) -> list[int]:
    # your code here
    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[2,7,11,15], 9],  expectedOutput: [0,1], isHidden: false },
      { id: "tc2", inputArgs: [[3,2,4], 6],       expectedOutput: [1,2], isHidden: false },
      { id: "tc3", inputArgs: [[3,3], 6],          expectedOutput: [0,1], isHidden: true  },
    ],
    hints: [
      "Can you solve it in O(n) using a hash map?",
      "For each number, check if (target - number) is already stored in the map.",
    ],
    visualizerSlug: "arrays",
  },

  {
    id: "max-subarray",
    supabaseId: null,
    title: "Maximum Subarray",
    algorithm: "arrays",
    difficulty: "medium",
    description:
      "Given an integer array `nums`, find the subarray with the largest sum and return its sum.",
    constraints: "- `1 <= nums.length <= 10^5`\n- `-10^4 <= nums[i] <= 10^4`",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has sum 6" },
    ],
    starterCode: {
      javascript: `function solution(nums) {\n  // your code here\n}`,
      python: `def solution(nums: list[int]) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[-2,1,-3,4,-1,2,1,-5,4]], expectedOutput: 6,  isHidden: false },
      { id: "tc2", inputArgs: [[1]],                       expectedOutput: 1,  isHidden: false },
      { id: "tc3", inputArgs: [[-1,-2,-3]],                expectedOutput: -1, isHidden: true },
    ],
    hints: [
      "Think about Kadane's algorithm.",
      "At each step, decide: extend the current subarray or start fresh?",
    ],
    visualizerSlug: null,
  },

  {
    id: "trapping-rain-water",
    supabaseId: null,
    title: "Trapping Rain Water",
    algorithm: "arrays",
    difficulty: "hard",
    description:
      "Given `n` non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    constraints: "- `n == height.length`\n- `1 <= n <= 2 * 10^4`\n- `0 <= height[i] <= 10^5`",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
    ],
    starterCode: {
      javascript: `function solution(height) {\n  // your code here\n}`,
      python: `def solution(height: list[int]) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[0,1,0,2,1,0,1,3,2,1,2,1]], expectedOutput: 6, isHidden: false },
      { id: "tc2", inputArgs: [[4,2,0,3,2,5]],              expectedOutput: 9, isHidden: false },
    ],
    hints: [
      "For each position, the water it holds is: min(max_left, max_right) − height[i].",
      "Use a two-pointer approach to do this in O(1) space.",
    ],
    visualizerSlug: null,
  },

  {
    id: "median-two-sorted-arrays",
    supabaseId: null,
    title: "Median of Two Sorted Arrays",
    algorithm: "arrays",
    difficulty: "expert",
    description:
      "Given two sorted arrays `nums1` and `nums2`, return the median of the two sorted arrays. The overall run time complexity must be O(log(m+n)).",
    constraints: "- `nums1.length == m`, `nums2.length == n`\n- `0 <= m, n <= 1000`\n- `-10^6 <= nums1[i], nums2[i] <= 10^6`",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" },
    ],
    starterCode: {
      javascript: `function solution(nums1, nums2) {\n  // your code here\n}`,
      python: `def solution(nums1: list[int], nums2: list[int]) -> float:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[1,3],[2]],   expectedOutput: 2,   isHidden: false },
      { id: "tc2", inputArgs: [[1,2],[3,4]], expectedOutput: 2.5, isHidden: false },
    ],
    hints: [
      "Binary search on the partition point of the smaller array.",
      "Ensure left half total length == right half total length (±1 for odd combined).",
      "At the correct partition, leftMax1 ≤ rightMin2 AND leftMax2 ≤ rightMin1.",
    ],
    visualizerSlug: null,
  },

  // ══════════════════════════════════════════════════════════
  // STRINGS
  // ══════════════════════════════════════════════════════════
  {
    id: "valid-palindrome",
    supabaseId: null,
    title: "Valid Palindrome",
    algorithm: "strings",
    difficulty: "easy",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    constraints: "- `1 <= s.length <= 2 * 10^5`",
    examples: [
      { input: `s = "A man, a plan, a canal: Panama"`, output: "true" },
      { input: `s = "race a car"`, output: "false" },
    ],
    starterCode: {
      javascript: `function solution(s) {\n  // your code here\n}`,
      python: `def solution(s: str) -> bool:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: ["A man, a plan, a canal: Panama"], expectedOutput: true,  isHidden: false },
      { id: "tc2", inputArgs: ["race a car"],                     expectedOutput: false, isHidden: false },
      { id: "tc3", inputArgs: [" "],                              expectedOutput: true,  isHidden: true },
    ],
    hints: [
      "Use two pointers — one from each end — skipping non-alphanumeric characters.",
    ],
    visualizerSlug: "strings",
  },

  {
    id: "longest-substring-no-repeat",
    supabaseId: null,
    title: "Longest Substring Without Repeating Characters",
    algorithm: "strings",
    difficulty: "medium",
    description:
      "Given a string `s`, find the length of the longest substring without duplicate characters.",
    constraints: "- `0 <= s.length <= 5 * 10^4`",
    examples: [
      { input: `s = "abcabcbb"`, output: "3", explanation: `"abc" has length 3` },
    ],
    starterCode: {
      javascript: `function solution(s) {\n  // your code here\n}`,
      python: `def solution(s: str) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: ["abcabcbb"], expectedOutput: 3, isHidden: false },
      { id: "tc2", inputArgs: ["bbbbb"],    expectedOutput: 1, isHidden: false },
      { id: "tc3", inputArgs: [""],         expectedOutput: 0, isHidden: true },
    ],
    hints: [
      "Sliding window with a Set to track characters in the current window.",
      "When a duplicate is found, shrink the window from the left.",
    ],
    visualizerSlug: "strings",
  },

  {
    id: "minimum-window-substring",
    supabaseId: null,
    title: "Minimum Window Substring",
    algorithm: "strings",
    difficulty: "hard",
    description:
      "Given strings `s` and `t`, return the minimum window substring of `s` that contains every character in `t`. If there is no such window, return an empty string.",
    constraints: "- `1 <= s.length, t.length <= 10^5`",
    examples: [
      { input: `s = "ADOBECODEBANC", t = "ABC"`, output: `"BANC"` },
    ],
    starterCode: {
      javascript: `function solution(s, t) {\n  // your code here\n}`,
      python: `def solution(s: str, t: str) -> str:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: ["ADOBECODEBANC","ABC"], expectedOutput: "BANC", isHidden: false },
      { id: "tc2", inputArgs: ["a","a"],               expectedOutput: "a",    isHidden: false },
    ],
    hints: [
      "Use a sliding window and two frequency maps — one for t, one for the current window.",
      "Expand right until the window is valid, then contract left while it stays valid.",
    ],
    visualizerSlug: null,
  },

  {
    id: "wildcard-matching",
    supabaseId: null,
    title: "Wildcard Pattern Matching",
    algorithm: "strings",
    difficulty: "expert",
    description:
      "Given an input string `s` and a pattern `p`, implement wildcard pattern matching where `?` matches any single character and `*` matches any sequence (including empty).",
    constraints: "- `0 <= s.length, p.length <= 2000`",
    examples: [
      { input: `s = "aa", p = "*"`, output: "true" },
      { input: `s = "cb", p = "?a"`, output: "false" },
    ],
    starterCode: {
      javascript: `function solution(s, p) {\n  // your code here\n}`,
      python: `def solution(s: str, p: str) -> bool:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: ["aa","*"],  expectedOutput: true,  isHidden: false },
      { id: "tc2", inputArgs: ["cb","?a"], expectedOutput: false, isHidden: false },
    ],
    hints: [
      "Build a DP table dp[i][j] = can p[0..j-1] match s[0..i-1]?",
      "Handle '*' specially: dp[i][j] = dp[i-1][j] OR dp[i][j-1].",
    ],
    visualizerSlug: null,
  },

  // ══════════════════════════════════════════════════════════
  // TREES
  // ══════════════════════════════════════════════════════════
  {
    id: "max-depth-binary-tree",
    supabaseId: null,
    title: "Maximum Depth of Binary Tree",
    algorithm: "trees",
    difficulty: "easy",
    description:
      "Given the root of a binary tree, return its maximum depth (number of nodes along the longest path from the root to the farthest leaf).",
    constraints: "- `0 <= number of nodes <= 10^4`\n- `-100 <= Node.val <= 100`",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
    ],
    starterCode: {
      javascript: `function solution(root) {\n  // root is {val, left, right} | null\n  // your code here\n}`,
      python: `def solution(root) -> int:\n    pass`,
    },
    testCases: [],  // tree problems need custom runner — use Supabase bank
    hints: [
      "Recursively, the depth is 1 + max(depth(left), depth(right)).",
    ],
    visualizerSlug: "trees",
  },

  {
    id: "validate-bst",
    supabaseId: null,
    title: "Validate Binary Search Tree",
    algorithm: "trees",
    difficulty: "medium",
    description:
      "Given the root of a binary tree, determine if it is a valid BST.",
    constraints: "- `1 <= number of nodes <= 10^4`",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false" },
    ],
    starterCode: {
      javascript: `function solution(root) {\n  // your code here\n}`,
      python: `def solution(root) -> bool:\n    pass`,
    },
    testCases: [],
    hints: [
      "Pass min/max bounds down recursively — every node must be strictly within its allowed range.",
    ],
    visualizerSlug: "trees",
  },

  {
    id: "binary-tree-max-path-sum",
    supabaseId: null,
    title: "Binary Tree Maximum Path Sum",
    algorithm: "trees",
    difficulty: "hard",
    description:
      "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. The path does not need to pass through the root.\n\nReturn the maximum path sum.",
    constraints: "- `1 <= number of nodes <= 3 * 10^4`\n- `-1000 <= Node.val <= 1000`",
    examples: [
      { input: "root = [-10,9,20,null,null,15,7]", output: "42" },
    ],
    starterCode: {
      javascript: `function solution(root) {\n  // your code here\n}`,
      python: `def solution(root) -> int:\n    pass`,
    },
    testCases: [],
    hints: [
      "For each node, the best path through it is: node.val + max(0, leftGain) + max(0, rightGain).",
      "The function should return only one branch (the better one) to its parent.",
    ],
    visualizerSlug: null,
  },

  {
    id: "serialize-deserialize-tree",
    supabaseId: null,
    title: "Serialize and Deserialize Binary Tree",
    algorithm: "trees",
    difficulty: "expert",
    description:
      "Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree.",
    constraints: "- `0 <= number of nodes <= 10^4`",
    examples: [
      { input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]" },
    ],
    starterCode: {
      javascript: `function serialize(root) {\n  // return string\n}\nfunction deserialize(data) {\n  // return root node\n}\nfunction solution(root) { return deserialize(serialize(root)); }`,
      python: `def serialize(root) -> str:\n    pass\ndef deserialize(data: str):\n    pass`,
    },
    testCases: [],
    hints: [
      "BFS level-order traversal with 'null' markers for missing children works well.",
      "For deserialization, use a queue to assign children level by level.",
    ],
    visualizerSlug: null,
  },

  // ══════════════════════════════════════════════════════════
  // GRAPHS
  // ══════════════════════════════════════════════════════════
  {
    id: "number-of-islands",
    supabaseId: null,
    title: "Number of Islands",
    algorithm: "graphs",
    difficulty: "easy",
    description:
      "Given an `m × n` 2D binary grid representing a map of '1's (land) and '0's (water), return the number of islands.",
    constraints: "- `1 <= m, n <= 300`\n- `grid[i][j]` is '0' or '1'",
    examples: [
      { input: `grid = [["1","1","0"],["0","1","0"],["0","0","1"]]`, output: "2" },
    ],
    starterCode: {
      javascript: `function solution(grid) {\n  // your code here\n}`,
      python: `def solution(grid: list[list[str]]) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[["1","1","0"],["0","1","0"],["0","0","1"]]], expectedOutput: 2, isHidden: false },
    ],
    hints: [
      "DFS or BFS from each unvisited '1' cell. Mark visited cells as '0' (in-place).",
    ],
    visualizerSlug: "graphs",
  },

  {
    id: "course-schedule",
    supabaseId: null,
    title: "Course Schedule",
    algorithm: "graphs",
    difficulty: "medium",
    description:
      "There are `numCourses` courses labeled 0 to numCourses−1. You are given `prerequisites[i] = [ai, bi]` meaning you must take `bi` before `ai`. Return `true` if it is possible to finish all courses.",
    constraints: "- `1 <= numCourses <= 2000`\n- `0 <= prerequisites.length <= 5000`",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" },
    ],
    starterCode: {
      javascript: `function solution(numCourses, prerequisites) {\n  // your code here\n}`,
      python: `def solution(numCourses: int, prerequisites: list[list[int]]) -> bool:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [2, [[1,0]]],       expectedOutput: true,  isHidden: false },
      { id: "tc2", inputArgs: [2, [[1,0],[0,1]]], expectedOutput: false, isHidden: false },
    ],
    hints: [
      "This is a cycle detection problem on a directed graph.",
      "Topological sort (Kahn's BFS) works: if all nodes are processed, no cycle exists.",
    ],
    visualizerSlug: "graphs",
  },

  {
    id: "word-ladder",
    supabaseId: null,
    title: "Word Ladder",
    algorithm: "graphs",
    difficulty: "hard",
    description:
      "Given `beginWord`, `endWord`, and a `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord` (changing one letter at a time, each intermediate word must be in `wordList`). Return 0 if no such sequence exists.",
    constraints: "- `1 <= wordList.length <= 5000`\n- All words are the same length",
    examples: [
      { input: `beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]`, output: "5" },
    ],
    starterCode: {
      javascript: `function solution(beginWord, endWord, wordList) {\n  // your code here\n}`,
      python: `def solution(beginWord: str, endWord: str, wordList: list[str]) -> int:\n    pass`,
    },
    testCases: [],
    hints: [
      "BFS where each node is a word and edges connect words that differ by one letter.",
      "Pre-build a pattern map (e.g. '*ot' → ['hot','dot','lot']) for O(1) neighbor lookup.",
    ],
    visualizerSlug: null,
  },

  {
    id: "alien-dictionary",
    supabaseId: null,
    title: "Alien Dictionary",
    algorithm: "graphs",
    difficulty: "expert",
    description:
      "Given a sorted list of words from an alien language, derive the order of letters in that alphabet. Return one valid ordering, or '' if none exists.",
    constraints: "- `1 <= words.length <= 100`\n- `1 <= words[i].length <= 100`",
    examples: [
      { input: `words = ["wrt","wrf","er","ett","rftt"]`, output: `"wertf"` },
    ],
    starterCode: {
      javascript: `function solution(words) {\n  // your code here\n}`,
      python: `def solution(words: list[str]) -> str:\n    pass`,
    },
    testCases: [],
    hints: [
      "Compare adjacent words to derive directed edges (c1 → c2 means c1 comes before c2).",
      "Topological sort the resulting DAG. If a cycle exists, return ''.",
    ],
    visualizerSlug: null,
  },

  // ══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING
  // ══════════════════════════════════════════════════════════
  {
    id: "climbing-stairs",
    supabaseId: null,
    title: "Climbing Stairs",
    algorithm: "dp",
    difficulty: "easy",
    description:
      "You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: "- `1 <= n <= 45`",
    examples: [
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
    ],
    starterCode: {
      javascript: `function solution(n) {\n  // your code here\n}`,
      python: `def solution(n: int) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [2], expectedOutput: 2, isHidden: false },
      { id: "tc2", inputArgs: [3], expectedOutput: 3, isHidden: false },
      { id: "tc3", inputArgs: [10], expectedOutput: 89, isHidden: true },
    ],
    hints: [
      "The number of ways to reach step n equals ways(n-1) + ways(n-2) — it's Fibonacci!",
    ],
    visualizerSlug: "dp",
  },

  {
    id: "coin-change",
    supabaseId: null,
    title: "Coin Change",
    algorithm: "dp",
    difficulty: "medium",
    description:
      "Given `coins` denominations and an `amount`, return the fewest coins needed to make up that amount, or -1 if it's impossible.",
    constraints: "- `1 <= coins.length <= 12`\n- `0 <= amount <= 10^4`",
    examples: [
      { input: "coins = [1,5,11], amount = 15", output: "3" },
    ],
    starterCode: {
      javascript: `function solution(coins, amount) {\n  // your code here\n}`,
      python: `def solution(coins: list[int], amount: int) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[1,5,11], 15], expectedOutput: 3,  isHidden: false },
      { id: "tc2", inputArgs: [[2], 3],        expectedOutput: -1, isHidden: false },
    ],
    hints: [
      "Build dp[0..amount] where dp[i] = min coins to make i.",
      "For each coin, update: dp[i] = min(dp[i], dp[i-coin] + 1).",
    ],
    visualizerSlug: "dp",
  },

  {
    id: "longest-increasing-subsequence",
    supabaseId: null,
    title: "Longest Increasing Subsequence",
    algorithm: "dp",
    difficulty: "hard",
    description:
      "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    constraints: "- `1 <= nums.length <= 2500`\n- `-10^4 <= nums[i] <= 10^4`",
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4" },
    ],
    starterCode: {
      javascript: `function solution(nums) {\n  // your code here\n}`,
      python: `def solution(nums: list[int]) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[10,9,2,5,3,7,101,18]], expectedOutput: 4, isHidden: false },
      { id: "tc2", inputArgs: [[0,1,0,3,2,3]],         expectedOutput: 4, isHidden: false },
    ],
    hints: [
      "O(n²) DP: dp[i] = max(dp[j]+1) for all j < i where nums[j] < nums[i].",
      "O(n log n): maintain a patience-sorting 'piles' array and binary search.",
    ],
    visualizerSlug: "dp",
  },

  {
    id: "edit-distance",
    supabaseId: null,
    title: "Edit Distance",
    algorithm: "dp",
    difficulty: "expert",
    description:
      "Given two strings `word1` and `word2`, return the minimum number of operations (insert, delete, replace) required to convert `word1` to `word2`.",
    constraints: "- `0 <= word1.length, word2.length <= 500`",
    examples: [
      { input: `word1 = "horse", word2 = "ros"`, output: "3" },
    ],
    starterCode: {
      javascript: `function solution(word1, word2) {\n  // your code here\n}`,
      python: `def solution(word1: str, word2: str) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: ["horse","ros"],     expectedOutput: 3, isHidden: false },
      { id: "tc2", inputArgs: ["intention","execution"], expectedOutput: 5, isHidden: false },
    ],
    hints: [
      "2D DP: dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1].",
      "If chars match: dp[i][j] = dp[i-1][j-1], else min(insert, delete, replace) + 1.",
    ],
    visualizerSlug: null,
  },

  // ══════════════════════════════════════════════════════════
  // SORTING
  // ══════════════════════════════════════════════════════════
  {
    id: "merge-sorted-arrays",
    supabaseId: null,
    title: "Merge Sorted Array",
    algorithm: "sorting",
    difficulty: "easy",
    description:
      "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order. Merge `nums2` into `nums1` as one sorted array in-place.",
    constraints: "- `0 <= m, n <= 200`",
    examples: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
    ],
    starterCode: {
      javascript: `function solution(nums1, m, nums2, n) {\n  // modify nums1 in-place\n}`,
      python: `def solution(nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[1,2,3,0,0,0],3,[2,5,6],3], expectedOutput: [1,2,2,3,5,6], isHidden: false },
    ],
    hints: [
      "Fill from the back: compare the largest unmerged elements and place them at the end.",
    ],
    visualizerSlug: "sorting",
  },

  {
    id: "sort-colors",
    supabaseId: null,
    title: "Sort Colors (Dutch National Flag)",
    algorithm: "sorting",
    difficulty: "medium",
    description:
      "Given an array `nums` with elements 0, 1, and 2 representing colors red, white, and blue, sort them in-place in a single pass.",
    constraints: "- `1 <= nums.length <= 300`\n- `nums[i]` ∈ {0,1,2}",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
    ],
    starterCode: {
      javascript: `function solution(nums) {\n  // modify in-place, return void\n}`,
      python: `def solution(nums: list[int]) -> None:\n    pass`,
    },
    testCases: [],
    hints: [
      "Three-pointer (low, mid, high) — Dijkstra's Dutch National Flag algorithm.",
    ],
    visualizerSlug: "sorting",
  },

  {
    id: "kth-largest-element",
    supabaseId: null,
    title: "K-th Largest Element in Array",
    algorithm: "sorting",
    difficulty: "hard",
    description:
      "Given an integer array `nums` and an integer `k`, return the k-th largest element in the array (not the k-th distinct).",
    constraints: "- `1 <= k <= nums.length <= 10^5`",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
    ],
    starterCode: {
      javascript: `function solution(nums, k) {\n  // your code here\n}`,
      python: `def solution(nums: list[int], k: int) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[3,2,1,5,6,4],2],   expectedOutput: 5, isHidden: false },
      { id: "tc2", inputArgs: [[3,2,3,1,2,4,5,5,6],4], expectedOutput: 4, isHidden: false },
    ],
    hints: [
      "QuickSelect runs in O(n) average — partition around a pivot and recurse on one side.",
      "A min-heap of size k gives O(n log k).",
    ],
    visualizerSlug: null,
  },

  {
    id: "count-of-smaller-numbers",
    supabaseId: null,
    title: "Count of Smaller Numbers After Self",
    algorithm: "sorting",
    difficulty: "expert",
    description:
      "Given an integer array `nums`, return an integer array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.",
    constraints: "- `1 <= nums.length <= 10^5`",
    examples: [
      { input: "nums = [5,2,6,1]", output: "[2,1,1,0]" },
    ],
    starterCode: {
      javascript: `function solution(nums) {\n  // your code here\n}`,
      python: `def solution(nums: list[int]) -> list[int]:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[5,2,6,1]], expectedOutput: [2,1,1,0], isHidden: false },
    ],
    hints: [
      "Modified merge sort: count inversions while sorting.",
      "A Binary Indexed Tree (Fenwick tree) on coordinate-compressed values also works in O(n log n).",
    ],
    visualizerSlug: null,
  },

  // ══════════════════════════════════════════════════════════
  // EXTRA MIXED PROBLEMS (fills to 30 total)
  // ══════════════════════════════════════════════════════════
  {
    id: "linked-list-cycle",
    supabaseId: null,
    title: "Linked List Cycle",
    algorithm: "arrays",
    difficulty: "easy",
    description: "Given the head of a linked list, return `true` if the list has a cycle.",
    constraints: "- `0 <= number of nodes <= 10^4`",
    examples: [{ input: "head = [3,2,0,-4] (pos=1)", output: "true" }],
    starterCode: {
      javascript: `function solution(head) {\n  // head is {val, next} | null\n}`,
      python: `def solution(head) -> bool:\n    pass`,
    },
    testCases: [],
    hints: ["Floyd's cycle detection: slow moves 1 step, fast moves 2 steps."],
    visualizerSlug: null,
  },
  {
    id: "group-anagrams",
    supabaseId: null,
    title: "Group Anagrams",
    algorithm: "strings",
    difficulty: "medium",
    description: "Given an array of strings `strs`, group the anagrams together.",
    constraints: "- `1 <= strs.length <= 10^4`",
    examples: [{ input: `strs = ["eat","tea","tan","ate","nat","bat"]`, output: `[["bat"],["nat","tan"],["ate","eat","tea"]]` }],
    starterCode: {
      javascript: `function solution(strs) {\n  // your code here\n}`,
      python: `def solution(strs: list[str]) -> list[list[str]]:\n    pass`,
    },
    testCases: [],
    hints: ["Sort each string → use as the map key."],
    visualizerSlug: null,
  },
  {
    id: "lowest-common-ancestor",
    supabaseId: null,
    title: "Lowest Common Ancestor of BST",
    algorithm: "trees",
    difficulty: "easy",
    description: "Given a BST and two nodes `p` and `q`, find their lowest common ancestor.",
    constraints: "All node values are unique.",
    examples: [{ input: "root = [6,2,8,0,4,7,9], p = 2, q = 8", output: "6" }],
    starterCode: {
      javascript: `function solution(root, p, q) {\n  // your code here\n}`,
      python: `def solution(root, p, q):\n    pass`,
    },
    testCases: [],
    hints: ["Exploit BST property: if both p and q are less than root, go left; if both greater, go right."],
    visualizerSlug: "trees",
  },
  {
    id: "network-delay-time",
    supabaseId: null,
    title: "Network Delay Time",
    algorithm: "graphs",
    difficulty: "medium",
    description: "Given `n` nodes and weighted directed edges `times`, find the minimum time for signal sent from `k` to reach all nodes. Return -1 if unreachable.",
    constraints: "- `1 <= k <= n <= 100`",
    examples: [{ input: "times = [[2,1,1],[2,3,1],[3,4,1]], n=4, k=2", output: "2" }],
    starterCode: {
      javascript: `function solution(times, n, k) {\n  // your code here\n}`,
      python: `def solution(times: list[list[int]], n: int, k: int) -> int:\n    pass`,
    },
    testCases: [],
    hints: ["Dijkstra from node k. The answer is the maximum distance in the shortest-path tree."],
    visualizerSlug: "graphs",
  },
  {
    id: "house-robber",
    supabaseId: null,
    title: "House Robber",
    algorithm: "dp",
    difficulty: "easy",
    description: "You cannot rob two adjacent houses. Given `nums` (money in each house), return the maximum money you can rob.",
    constraints: "- `1 <= nums.length <= 100`",
    examples: [{ input: "nums = [2,7,9,3,1]", output: "12" }],
    starterCode: {
      javascript: `function solution(nums) {\n  // your code here\n}`,
      python: `def solution(nums: list[int]) -> int:\n    pass`,
    },
    testCases: [
      { id: "tc1", inputArgs: [[1,2,3,1]], expectedOutput: 4, isHidden: false },
      { id: "tc2", inputArgs: [[2,7,9,3,1]], expectedOutput: 12, isHidden: false },
    ],
    hints: ["dp[i] = max(dp[i-1], dp[i-2] + nums[i])."],
    visualizerSlug: "dp",
  },
  {
    id: "find-median-data-stream",
    supabaseId: null,
    title: "Find Median from Data Stream",
    algorithm: "sorting",
    difficulty: "expert",
    description: "Design a data structure that supports `addNum(num)` and `findMedian()` calls efficiently.",
    constraints: "- `-10^5 <= num <= 10^5`",
    examples: [{ input: "addNum(1), addNum(2), findMedian() → 1.5, addNum(3), findMedian() → 2.0", output: "see description" }],
    starterCode: {
      javascript: `class MedianFinder {\n  constructor() {}\n  addNum(num) {}\n  findMedian() {}\n}\nfunction solution(ops, vals) {\n  const mf = new MedianFinder();\n  return ops.map((op, i) => op === 'addNum' ? (mf.addNum(vals[i]), null) : mf.findMedian());\n}`,
      python: `class MedianFinder:\n    def __init__(self): pass\n    def addNum(self, num: int) -> None: pass\n    def findMedian(self) -> float: pass`,
    },
    testCases: [],
    hints: [
      "Use two heaps: a max-heap for the lower half and a min-heap for the upper half.",
      "Keep them balanced so their sizes differ by at most 1.",
    ],
    visualizerSlug: null,
  },
];

const TARGET_QUESTIONS_PER_DIFFICULTY = 5;

function normalizeProblem(problem) {
  const optimalSolutions =
    problem.optimalSolutions || {
      javascript:
        problem.starterCode?.javascript ||
        "function solution() {\n  // implement optimal approach\n}",
      python:
        problem.starterCode?.python ||
        "def solution(*args):\n    # implement optimal approach\n    pass",
      java:
        "class Solution {\n  public static Object solution(Object... args) {\n    // implement optimal approach\n    return null;\n  }\n}",
    };

  return {
    ...problem,
    optimalSolutions,
  };
}

function createVariant(baseProblem, algorithm, difficulty, variantNumber) {
  const normalized = normalizeProblem(baseProblem);
  const suffix = `${algorithm}-${difficulty}-v${variantNumber}`;

  return {
    ...normalized,
    id: `${normalized.id}-${suffix}`,
    title: `${normalized.title} (Variant ${variantNumber})`,
    algorithm,
    difficulty,
    supabaseId: null,
  };
}

function buildExpandedBank() {
  const normalizedBase = problems.map(normalizeProblem);
  const expanded = [...normalizedBase];

  ALGORITHMS.forEach((algorithm) => {
    DIFFICULTIES.forEach((difficulty) => {
      const pool = expanded.filter(
        (problem) =>
          problem.algorithm === algorithm &&
          problem.difficulty === difficulty,
      );

      if (pool.length >= TARGET_QUESTIONS_PER_DIFFICULTY) {
        return;
      }

      const sameAlgorithmAnyDifficulty = expanded.filter(
        (problem) => problem.algorithm === algorithm,
      );

      const seed =
        pool[0] ||
        sameAlgorithmAnyDifficulty[0] ||
        expanded[0];

      let variantCounter = 1;
      while (
        expanded.filter(
          (problem) =>
            problem.algorithm === algorithm &&
            problem.difficulty === difficulty,
        ).length < TARGET_QUESTIONS_PER_DIFFICULTY
      ) {
        expanded.push(
          createVariant(seed, algorithm, difficulty, variantCounter),
        );
        variantCounter += 1;
      }
    });
  });

  return expanded;
}

const EXPANDED_PROBLEMS = buildExpandedBank();

// ─────────────────────────────────────────────────────────────────────────────
// Utility: pick N random problems matching algorithm + difficulty
// ─────────────────────────────────────────────────────────────────────────────
export function pickProblems({ algorithm, difficulty, count = 1 }) {
  const safeCount = Math.max(1, Math.min(10, Number(count) || 1));
  const pool = EXPANDED_PROBLEMS.filter(
    (problem) =>
      problem.algorithm === algorithm &&
      problem.difficulty === difficulty,
  );

  if (pool.length === 0) return [];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, safeCount);
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: all distinct algorithms with counts per difficulty
// ─────────────────────────────────────────────────────────────────────────────
export function getBankStats() {
  return ALGORITHMS.map((alg) => ({
    algorithm: alg,
    counts: Object.fromEntries(
      DIFFICULTIES.map((diff) => [
        diff,
        EXPANDED_PROBLEMS.filter(
          (problem) =>
            problem.algorithm === alg &&
            problem.difficulty === diff,
        ).length,
      ]),
    ),
  }));
}

export default EXPANDED_PROBLEMS;