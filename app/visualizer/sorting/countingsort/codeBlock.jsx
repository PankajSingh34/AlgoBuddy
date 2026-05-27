"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Counting Sort in JavaScript
function countingSort(arr) {
  if (arr.length === 0) return arr;

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const count = Array(max - min + 1).fill(0);
  const output = Array(arr.length);

  for (const value of arr) {
    count[value - min]++;
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    const value = arr[i];
    const position = count[value - min] - 1;
    output[position] = value;
    count[value - min]--;
  }

  return output;
}

const values = [4, 2, 2, 8, 3, 3, 1];
console.log(countingSort(values));`,

  python: `# Counting Sort in Python
def counting_sort(arr):
    if not arr:
        return arr

    minimum = min(arr)
    maximum = max(arr)
    count = [0] * (maximum - minimum + 1)
    output = [0] * len(arr)

    for value in arr:
        count[value - minimum] += 1

    for i in range(1, len(count)):
        count[i] += count[i - 1]

    for value in reversed(arr):
        position = count[value - minimum] - 1
        output[position] = value
        count[value - minimum] -= 1

    return output

values = [4, 2, 2, 8, 3, 3, 1]
print(counting_sort(values))`,

  java: `// Counting Sort in Java
import java.util.Arrays;

public class CountingSort {
    public static int[] countingSort(int[] arr) {
        if (arr.length == 0) return arr;

        int min = arr[0], max = arr[0];
        for (int value : arr) {
            min = Math.min(min, value);
            max = Math.max(max, value);
        }

        int[] count = new int[max - min + 1];
        int[] output = new int[arr.length];

        for (int value : arr) count[value - min]++;

        for (int i = 1; i < count.length; i++) {
            count[i] += count[i - 1];
        }

        for (int i = arr.length - 1; i >= 0; i--) {
            int value = arr[i];
            int position = count[value - min] - 1;
            output[position] = value;
            count[value - min]--;
        }

        return output;
    }

    public static void main(String[] args) {
        int[] values = {4, 2, 2, 8, 3, 3, 1};
        System.out.println(Arrays.toString(countingSort(values)));
    }
}`,

  c: `// Counting Sort in C
#include <stdio.h>
#include <stdlib.h>

void countingSort(int arr[], int n) {
    if (n == 0) return;

    int min = arr[0], max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }

    int range = max - min + 1;
    int *count = calloc(range, sizeof(int));
    int *output = malloc(n * sizeof(int));

    for (int i = 0; i < n; i++) count[arr[i] - min]++;
    for (int i = 1; i < range; i++) count[i] += count[i - 1];

    for (int i = n - 1; i >= 0; i--) {
        int value = arr[i];
        int position = count[value - min] - 1;
        output[position] = value;
        count[value - min]--;
    }

    for (int i = 0; i < n; i++) arr[i] = output[i];
    free(count);
    free(output);
}

int main() {
    int values[] = {4, 2, 2, 8, 3, 3, 1};
    int n = sizeof(values) / sizeof(values[0]);
    countingSort(values, n);
    for (int i = 0; i < n; i++) printf("%d ", values[i]);
    return 0;
}`,

  cpp: `// Counting Sort in C++
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

vector<int> countingSort(const vector<int>& arr) {
    if (arr.empty()) return arr;

    int minValue = *min_element(arr.begin(), arr.end());
    int maxValue = *max_element(arr.begin(), arr.end());
    vector<int> count(maxValue - minValue + 1, 0);
    vector<int> output(arr.size());

    for (int value : arr) count[value - minValue]++;

    for (int i = 1; i < count.size(); i++) {
        count[i] += count[i - 1];
    }

    for (int i = arr.size() - 1; i >= 0; i--) {
        int value = arr[i];
        int position = count[value - minValue] - 1;
        output[position] = value;
        count[value - minValue]--;
    }

    return output;
}

int main() {
    vector<int> values = {4, 2, 2, 8, 3, 3, 1};
    for (int value : countingSort(values)) cout << value << " ";
    return 0;
}`,
};

const fileNames = {
  javascript: "countingSort.js",
  python: "counting_sort.py",
  java: "CountingSort.java",
  c: "counting_sort.c",
  cpp: "counting_sort.cpp",
};

const CountingSortCode = () => (
  <CodeBlock variant="macos" codeExamples={codeExamples} fileNames={fileNames} />
);

export default CountingSortCode;
