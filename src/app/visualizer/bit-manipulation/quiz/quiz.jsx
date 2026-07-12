"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const bitManipulationQuestions = [
  // --- Easy Questions (1 to 10) ---
  {
    question: "What is the binary representation of the decimal number 13?",
    options: ["1011", "1101", "1110", "1111"],
    correctAnswer: 1,
    answer: 1,
    explanation: "13 can be written as 8 + 4 + 1, which corresponds to 2^3 + 2^2 + 2^0. In binary, this is represented as 1101.",
    difficulty: "Easy"
  },
  {
    question: "What is the result of the bitwise operation 5 & 6?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 0,
    answer: 0,
    explanation: "In binary, 5 is 101 and 6 is 110. Performing a bitwise AND: 101 & 110 = 100, which is 4 in decimal.",
    difficulty: "Easy"
  },
  {
    question: "What is the result of the bitwise operation 9 | 5?",
    options: ["9", "12", "13", "14"],
    correctAnswer: 2,
    answer: 2,
    explanation: "In binary, 9 is 1001 and 5 is 0101. Performing a bitwise OR: 1001 | 0101 = 1101, which is 13 in decimal.",
    difficulty: "Easy"
  },
  {
    question: "What is the result of the bitwise operation 12 ^ 9?",
    options: ["3", "5", "12", "21"],
    correctAnswer: 1,
    answer: 1,
    explanation: "In binary, 12 is 1100 and 9 is 1001. Performing a bitwise XOR (yields 1 if bits are different): 1100 ^ 1001 = 0101, which is 5 in decimal.",
    difficulty: "Easy"
  },
  {
    question: "Assuming a standard 32-bit signed integer representation, what is the result of the bitwise NOT operation ~5?",
    options: ["-5", "-6", "5", "6"],
    correctAnswer: 1,
    answer: 1,
    explanation: "The bitwise NOT operator flips all bits. In two's complement, for any integer x, ~x is equal to -(x + 1). Thus, ~5 equals -(5 + 1) = -6.",
    difficulty: "Easy"
  },
  {
    question: "What is the value of 3 << 3?",
    options: ["9", "12", "24", "27"],
    correctAnswer: 2,
    answer: 2,
    explanation: "Left shifting a number by k bits is equivalent to multiplying the number by 2^k. Thus, 3 << 3 is 3 * 2^3 = 3 * 8 = 24.",
    difficulty: "Easy"
  },
  {
    question: "What is the value of 40 >> 2 in standard arithmetic right shift?",
    options: ["10", "20", "8", "4"],
    correctAnswer: 0,
    answer: 0,
    explanation: "Right shifting a number by k bits is equivalent to integer division of the number by 2^k. Thus, 40 >> 2 is floor(40 / 2^2) = floor(40 / 4) = 10.",
    difficulty: "Easy"
  },
  {
    question: "How many bits are required to represent the decimal number 31 in binary?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    answer: 1,
    explanation: "31 in binary is 11111, which requires exactly 5 bits. The formula for the number of bits to represent x is floor(log2(x)) + 1. For 31, floor(4.95) + 1 = 5.",
    difficulty: "Easy"
  },
  {
    question: "Which bitwise operator has the property that A op A = 0 and A op 0 = A for any integer A?",
    options: ["AND (&)", "OR (|)", "XOR (^)", "NOT (~)"],
    correctAnswer: 2,
    answer: 2,
    explanation: "The Exclusive-OR (XOR) operator outputs 0 if the inputs are identical, meaning A ^ A = 0, and outputs the original value if one input is 0, meaning A ^ 0 = A.",
    difficulty: "Easy"
  },
  {
    question: "Which of the following equations is mathematically equivalent to the bitwise expression A & 1 for any non-negative integer A?",
    options: ["A % 2", "A / 2", "A * 2", "A - 1"],
    correctAnswer: 0,
    answer: 0,
    explanation: "The bitwise AND expression A & 1 extracts the least significant bit (LSB) of A. If the LSB is 1, A is odd (A % 2 = 1). If the LSB is 0, A is even (A % 2 = 0).",
    difficulty: "Easy"
  },

  // --- Medium Questions (11 to 20) ---
  {
    question: "Which of the following expressions is used to set the i-th bit of a number N to 1?",
    options: ["N & (1 << i)", "N | (1 << i)", "N ^ (1 << i)", "N >> i"],
    correctAnswer: 1,
    answer: 1,
    explanation: "To set the i-th bit (force it to be 1), we use the bitwise OR operator with a mask that has only the i-th bit set. The mask is 1 << i, so the expression is N | (1 << i).",
    difficulty: "Medium"
  },
  {
    question: "Which of the following expressions is used to clear (set to 0) the i-th bit of a number N?",
    options: ["N & ~(1 << i)", "N | ~(1 << i)", "N ^ ~(1 << i)", "N & (1 << i)"],
    correctAnswer: 0,
    answer: 0,
    explanation: "To clear the i-th bit, we want a mask where every bit is 1 except the i-th bit which is 0, and then perform a bitwise AND. The mask is ~(1 << i), so the expression is N & ~(1 << i).",
    difficulty: "Medium"
  },
  {
    question: "Which of the following expressions is used to toggle (flip) the i-th bit of a number N?",
    options: ["N & (1 << i)", "N | (1 << i)", "N ^ (1 << i)", "N ~ (1 << i)"],
    correctAnswer: 2,
    answer: 2,
    explanation: "The XOR operator flips a bit when XORed with 1 (since 0 ^ 1 = 1 and 1 ^ 1 = 0), and leaves a bit unchanged when XORed with 0. Thus, N ^ (1 << i) toggles the i-th bit of N.",
    difficulty: "Medium"
  },
  {
    question: "How do you check if the k-th bit of a number N is set (1) or not?",
    options: ["(N & (1 << k)) != 0", "(N | (1 << k)) != 0", "(N ^ (1 << k)) != 0", "(N >> k) & 0 == 0"],
    correctAnswer: 0,
    answer: 0,
    explanation: "To check if the k-th bit is set, perform a bitwise AND with a mask where only the k-th bit is 1 (1 << k). If the result is non-zero, the k-th bit is set. Alternatively, check (N >> k) & 1 == 1.",
    difficulty: "Medium"
  },
  {
    question: "Why does (N & 1) === 0 correctly identify if a number N is even?",
    options: [
      "Even numbers have their least significant bit as 0 in binary.",
      "Even numbers have all bits set to 0.",
      "The expression calculates N divided by 2.",
      "It only works for positive numbers."
    ],
    correctAnswer: 0,
    answer: 0,
    explanation: "In binary representation, all power of two components are even except for 2^0 = 1. Therefore, an integer is even if and only if its 0th bit (least significant bit) is 0. Performing N & 1 checks this bit.",
    difficulty: "Medium"
  },
  {
    question: "In a naive approach to counting set bits (1s) in a number N, we repeatedly check the last bit and shift N right. What is the time complexity of this approach if N can be represented in W bits?",
    options: ["O(1)", "O(log W)", "O(W)", "O(2^W)"],
    correctAnswer: 2,
    answer: 2,
    explanation: "Since the loop runs once for each bit position in the word size W, checking the last bit and shifting right takes O(W) time. For a 32-bit integer, it runs exactly 32 times.",
    difficulty: "Medium"
  },
  {
    question: "Which of the following expressions evaluates to true if and only if a positive integer N is a power of two?",
    options: ["(N & (N - 1)) === 0", "(N | (N - 1)) === 0", "(N & (N + 1)) === 0", "(N ^ (N - 1)) === 0"],
    correctAnswer: 0,
    answer: 0,
    explanation: "A power of two in binary has exactly one set bit (e.g., 4 is 100). Subtracting 1 flips all bits after the set bit, including the set bit itself (e.g., 3 is 011). Performing a bitwise AND between them yields 0: 100 & 011 = 000.",
    difficulty: "Medium"
  },
  {
    question: "If we are given an array of size 2N + 1 where every element appears exactly twice except for one element which appears once, how can we find that single element in O(N) time and O(1) auxiliary space?",
    options: [
      "Sort the array and return the middle element",
      "Compute the sum of all elements and subtract the minimum",
      "Compute the bitwise XOR of all elements in the array",
      "Use a hashmap to count frequencies"
    ],
    correctAnswer: 2,
    answer: 2,
    explanation: "Due to the commutative and associative properties of XOR, and the fact that X ^ X = 0 and X ^ 0 = X, XORing all elements together will cause the duplicate pairs to cancel each other out, leaving only the single unique element.",
    difficulty: "Medium"
  },
  {
    question: "What is the correct sequence of operations to swap two variables a and b in-place using XOR?",
    options: [
      "a = a ^ b; b = a ^ b; a = a ^ b;",
      "b = a ^ b; a = a ^ b; b = a ^ b;",
      "a = a | b; b = a & b; a = a ^ b;",
      "a = a ^ b; b = a ^ b; b = a ^ b;"
    ],
    correctAnswer: 0,
    answer: 0,
    explanation: "Step 1: a = a ^ b (holds XOR sum). Step 2: b = a ^ b = (initial_a ^ initial_b) ^ initial_b = initial_a (b gets a's value). Step 3: a = a ^ b = (initial_a ^ initial_b) ^ initial_a = initial_b (a gets b's value).",
    difficulty: "Medium"
  },
  {
    question: "What is a 'bitmask'?",
    options: [
      "A special encryption key used in bitwise networking",
      "A binary pattern used to select, modify, or query specific bits in a larger bitset",
      "A software library that hides binary operations from the compiler",
      "A debugger tool that filters out bitwise exceptions"
    ],
    correctAnswer: 1,
    answer: 1,
    explanation: "A bitmask is a sequence of bits (often represented as an integer) used to isolate or change a subset of bits in another value using bitwise operations.",
    difficulty: "Medium"
  },

  // --- Hard Questions (21 to 25) ---
  {
    question: "How does Brian Kernighan's algorithm count set bits in a number?",
    options: [
      "By shifting the number bit by bit and counting 1s in O(W) time",
      "By clearing the lowest set bit in each step using N = N & (N - 1), running in O(S) where S is the number of set bits",
      "By looking up precomputed bit counts in a 256-entry table in O(1) time",
      "By recursively dividing the bitstring in half"
    ],
    correctAnswer: 1,
    answer: 1,
    explanation: "Brian Kernighan's algorithm relies on the fact that N & (N - 1) clears the lowest set bit of N. By repeating this operation until N becomes 0, we count the set bits in exactly O(S) operations, where S is the number of set bits.",
    difficulty: "Hard"
  },
  {
    question: "When generating all subsets of a set with M elements using bitmasking, what range of integer values represents all possible subset states?",
    options: ["0 to M", "0 to 2^M - 1", "1 to M^2", "0 to M!"],
    correctAnswer: 1,
    answer: 1,
    explanation: "A set of size M has 2^M subsets. Each subset can be represented by a binary mask of length M, where the i-th bit is 1 if the i-th element is included, and 0 otherwise. These masks correspond to integer values from 0 (empty set) to 2^M - 1 (full set).",
    difficulty: "Hard"
  },
  {
    question: "Given an array of numbers, which advanced data structure is most commonly used to find a pair of numbers that yields the maximum XOR value in O(N) time?",
    options: ["Binary Search Tree", "Trie (Prefix Tree) with binary alphabet (0 and 1)", "Segment Tree", "Min-Heap"],
    correctAnswer: 1,
    answer: 1,
    explanation: "To maximize XOR, we want to match each bit of our query number with its opposite bit. A binary Trie stores the numbers' binary representations, allowing us to traverse down the path that maximizes the XOR value in O(32) = O(1) time per query.",
    difficulty: "Hard"
  },
  {
    question: "An array contains elements where every number appears twice except for two unique numbers that appear once. If we XOR all elements, we get XOR_sum = A ^ B. How do we separate A and B in O(1) auxiliary space?",
    options: [
      "Find the position of the rightmost set bit in XOR_sum, and divide the array elements into two groups based on whether they have this bit set, then XOR each group separately.",
      "Subtract the sum of the array elements from the sum of squares.",
      "Perform a binary search on the array after sorting.",
      "It is mathematically impossible to separate them without O(N) extra space."
    ],
    correctAnswer: 0,
    answer: 0,
    explanation: "Since A and B are unique, A ^ B must have at least one set bit. The rightmost set bit (found using XOR_sum & -XOR_sum) represents a bit position where A and B differ. Dividing all array elements into two groups based on this bit separates A and B, and XORing each group reveals the unique numbers.",
    difficulty: "Hard"
  },
  {
    question: "What is the effect of the operation N & -N on a non-zero integer N?",
    options: [
      "It clears all set bits of N.",
      "It returns the number N unchanged.",
      "It isolates the lowest (rightmost) set bit of N.",
      "It negates the number N."
    ],
    correctAnswer: 2,
    answer: 2,
    explanation: "In two's complement representation, -N is equal to ~N + 1. This operation flips all bits up to the rightmost set bit of N, and keeps the rightmost set bit and trailing zeros identical. Performing N & -N clears all other bits, isolating the lowest set bit.",
    difficulty: "Hard"
  }
];

const Quiz = () => {
  return <QuizEngine title="Bit Manipulation Quiz" questions={bitManipulationQuestions} />;
};

export default Quiz;
