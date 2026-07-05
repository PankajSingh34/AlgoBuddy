'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Shell Sort in JavaScript
function shellSort(arr) {
  let n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  return arr;
}
// Usage example
const numbers = [10, 7, 8, 9, 1, 5];
console.log("Before sorting:", numbers);
const result = shellSort([...numbers]);
console.log("After sorting:", result);`,

  python: `# Shell Sort in Python
def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    return arr
# Usage example
numbers = [10, 7, 8, 9, 1, 5]
print("Before sorting:", numbers)
result = shell_sort(numbers)
print("After sorting:", result)`,

  java: `// Shell Sort in Java
public class ShellSort {
    public static void shellSort(int[] arr) {
        int n = arr.length;
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = arr[i];
                int j = i;
                while (j >= gap && arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                }
                arr[j] = temp;
            }
        }
    }
    public static void main(String[] args) {
        int[] numbers = {10, 7, 8, 9, 1, 5};
        shellSort(numbers);
        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}`,

  c: `// Shell Sort in C
#include <stdio.h>
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
void shellSort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}
int main() {
    int numbers[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(numbers) / sizeof(numbers[0]);
    shellSort(numbers, n);
    for (int i = 0; i < n; i++) printf("%d ", numbers[i]);
    return 0;
}`,

  cpp: `// Shell Sort in C++
#include <iostream>
#include <vector>
using namespace std;
void shellSort(vector<int>& arr) {
    int n = arr.size();
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}
int main() {
    vector<int> numbers = {10, 7, 8, 9, 1, 5};
    shellSort(numbers);
    for (int num : numbers) cout << num << " ";
    return 0;
}`,
};

const fileNames = {
  javascript: 'shellSort.js',
  python: 'shell_sort.py',
  java: 'ShellSort.java',
  c: 'shell_sort.c',
  cpp: 'shell_sort.cpp',
};

const ShellSortCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default ShellSortCode;