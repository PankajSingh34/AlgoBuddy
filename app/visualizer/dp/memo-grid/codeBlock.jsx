'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// 0/1 Knapsack Solution - Tabulation (Bottom-Up) & Memoization (Top-Down)

// 1. Bottom-Up Tabulation (Iterative Grid)
function knapsackTabulation(weights, values, capacity) {
    const n = weights.length;
    // Create a 2D grid initialized to 0
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    // Fill the grid step-by-step
    for (let i = 1; i <= n; i++) {
        const currentWeight = weights[i - 1];
        const currentValue = values[i - 1];

        for (let w = 0; w <= capacity; w++) {
            if (currentWeight <= w) {
                // We choose the maximum of:
                // 1. Excluding the item: dp[i-1][w]
                // 2. Including the item: dp[i-1][w - currentWeight] + currentValue
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    dp[i - 1][w - currentWeight] + currentValue
                );
            } else {
                // Item too heavy, exclude it
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][capacity];
}

// 2. Top-Down Memoization (Recursive Tree)
function knapsackMemoization(weights, values, capacity) {
    const n = weights.length;
    const memo = Array.from({ length: n }, () => new Array(capacity + 1).fill(-1));

    function solve(i, w) {
        // Base case: no items left or no capacity left
        if (i < 0 || w === 0) return 0;

        // Cache hit: check if state was already computed
        if (memo[i][w] !== -1) return memo[i][w];

        if (weights[i] <= w) {
            // Recurse with both choices and store in cache
            memo[i][w] = Math.max(
                solve(i - 1, w),
                solve(i - 1, w - weights[i]) + values[i]
            );
        } else {
            memo[i][w] = solve(i - 1, w);
        }
        return memo[i][w];
    }

    return solve(n - 1, capacity);
}`,

  python: `# 0/1 Knapsack Solution - Tabulation (Bottom-Up) & Memoization (Top-Down)

# 1. Bottom-Up Tabulation (Iterative Grid)
def knapsack_tabulation(weights, values, capacity):
    n = len(weights)
    # Create a 2D grid initialized to 0
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    # Fill the grid step-by-step
    for i in range(1, n + 1):
        curr_weight = weights[i - 1]
        curr_value = values[i - 1]
        for w in range(capacity + 1):
            if curr_weight <= w:
                # Max of excluding or including item
                dp[i][w] = max(
                    dp[i - 1][w],
                    dp[i - 1][w - curr_weight] + curr_value
                )
            else:
                # Exclude item
                dp[i][w] = dp[i - 1][w]
                
    return dp[n][capacity]

# 2. Top-Down Memoization (Recursive Tree)
def knapsack_memoization(weights, values, capacity):
    n = len(weights)
    memo = [[-1] * (capacity + 1) for _ in range(n)]

    def solve(i, w):
        # Base case
        if i < 0 or w == 0:
            return 0
            
        # Cache hit
        if memo[i][w] != -1:
            return memo[i][w]

        if weights[i] <= w:
            # Memoize state transitions
            memo[i][w] = max(
                solve(i - 1, w),
                solve(i - 1, w - weights[i]) + values[i]
            )
        else:
            memo[i][w] = solve(i - 1, w)
            
        return memo[i][w]

    return solve(n - 1, capacity)`,

  java: `// 0/1 Knapsack Solution - Tabulation (Bottom-Up) & Memoization (Top-Down)
import java.util.Arrays;

public class Knapsack {
    
    // 1. Bottom-Up Tabulation (Iterative Grid)
    public int knapsackTabulation(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        // Fill the grid step-by-step
        for (int i = 1; i <= n; i++) {
            int currWeight = weights[i - 1];
            int currValue = values[i - 1];
            for (int w = 0; w <= capacity; w++) {
                if (currWeight <= w) {
                    dp[i][w] = Math.max(
                        dp[i - 1][w],
                        dp[i - 1][w - currWeight] + currValue
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][capacity];
    }

    // 2. Top-Down Memoization (Recursive Tree)
    public int knapsackMemoization(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] memo = new int[n][capacity + 1];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }
        return solve(n - 1, capacity, weights, values, memo);
    }

    private int solve(int i, int w, int[] weights, int[] values, int[][] memo) {
        // Base case
        if (i < 0 || w == 0) return 0;

        // Cache hit
        if (memo[i][w] != -1) return memo[i][w];

        if (weights[i] <= w) {
            memo[i][w] = Math.max(
                solve(i - 1, w, weights, values, memo),
                solve(i - 1, w - weights[i], weights, values, memo) + values[i]
            );
        } else {
            memo[i][w] = solve(i - 1, w, weights, values, memo);
        }
        return memo[i][w];
    }
}`,

  cpp: `// 0/1 Knapsack Solution - Tabulation (Bottom-Up) & Memoization (Top-Down)
#include <vector>
#include <algorithm>

using namespace std;

class Knapsack {
public:
    // 1. Bottom-Up Tabulation (Iterative Grid)
    int knapsackTabulation(const vector<int>& weights, const vector<int>& values, int capacity) {
        int n = weights.size();
        vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

        // Fill the grid step-by-step
        for (int i = 1; i <= n; ++i) {
            int currWeight = weights[i - 1];
            int currValue = values[i - 1];
            for (int w = 0; w <= capacity; ++w) {
                if (currWeight <= w) {
                    dp[i][w] = max(
                        dp[i - 1][w],
                        dp[i - 1][w - currWeight] + currValue
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][capacity];
    }

    // 2. Top-Down Memoization (Recursive Tree)
    int knapsackMemoization(const vector<int>& weights, const vector<int>& values, int capacity) {
        int n = weights.size();
        vector<vector<int>> memo(n, vector<int>(capacity + 1, -1));
        return solve(n - 1, capacity, weights, values, memo);
    }

private:
    int solve(int i, int w, const vector<int>& weights, const vector<int>& values, vector<vector<int>>& memo) {
        // Base case
        if (i < 0 || w == 0) return 0;

        // Cache hit
        if (memo[i][w] != -1) return memo[i][w];

        if (weights[i] <= w) {
            memo[i][w] = max(
                solve(i - 1, w, weights, values, memo),
                solve(i - 1, w - weights[i], weights, values, memo) + values[i]
            );
        } else {
            memo[i][w] = solve(i - 1, w, weights, values, memo);
        }
        return memo[i][w];
    }
};`
};

const fileNames = {
  javascript: 'knapsack.js',
  python: 'knapsack.py',
  java: 'Knapsack.java',
  cpp: 'knapsack.cpp'
};

const CodeBlock = () => (
  <CodeBlockUI
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default CodeBlock;
