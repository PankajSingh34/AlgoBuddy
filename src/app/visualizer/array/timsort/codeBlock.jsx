'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Tim Sort in JavaScript
const MIN_MERGE = 32;

function calcMinRun(n) {
  let r = 0;
  while (n >= MIN_MERGE) {
    r |= (n & 1);
    n >>= 1;
  }
  return n + r;
}

function insertionSort(arr, left, right) {
  for (let i = left + 1; i <= right; i++) {
    const temp = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
}

function merge(arr, l, m, r) {
  const len1 = m - l + 1;
  const len2 = r - m;
  const left = new Array(len1);
  const right = new Array(len2);
  for (let x = 0; x < len1; x++) left[x] = arr[l + x];
  for (let x = 0; x < len2; x++) right[x] = arr[m + 1 + x];

  let i = 0, j = 0, k = l;
  while (i < len1 && j < len2) {
    arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
  }
  while (i < len1) arr[k++] = left[i++];
  while (j < len2) arr[k++] = right[j++];
}

function timSort(arr) {
  const n = arr.length;
  const minRun = calcMinRun(n);

  for (let start = 0; start < n; start += minRun) {
    const end = Math.min(start + minRun - 1, n - 1);
    insertionSort(arr, start, end);
  }

  for (let size = minRun; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min((left + 2 * size - 1), (n - 1));
      if (mid < right) merge(arr, left, mid, right);
    }
  }
  return arr;
}
// Usage example
const numbers = [29, 25, 3, 49, 9, 37, 21, 43];
console.log("Before sorting:", numbers);
const result = timSort([...numbers]);
console.log("After sorting:", result);`,

  python: `# Tim Sort in Python
MIN_MERGE = 32

def calc_min_run(n):
    r = 0
    while n >= MIN_MERGE:
        r |= n & 1
        n >>= 1
    return n + r

def insertion_sort(arr, left, right):
    for i in range(left + 1, right + 1):
        key = arr[i]
        j = i - 1
        while j >= left and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

def merge(arr, l, m, r):
    len1, len2 = m - l + 1, r - m
    left = arr[l:m + 1]
    right = arr[m + 1:r + 1]
    i, j, k = 0, 0, l

    while i < len1 and j < len2:
        if left[i] <= right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1

    while i < len1:
        arr[k] = left[i]
        k += 1
        i += 1

    while j < len2:
        arr[k] = right[j]
        k += 1
        j += 1

def tim_sort(arr):
    n = len(arr)
    min_run = calc_min_run(n)

    for start in range(0, n, min_run):
        end = min(start + min_run - 1, n - 1)
        insertion_sort(arr, start, end)

    size = min_run
    while size < n:
        for left in range(0, n, 2 * size):
            mid = min(n - 1, left + size - 1)
            right = min((left + 2 * size - 1), (n - 1))
            if mid < right:
                merge(arr, left, mid, right)
        size *= 2
    return arr

# Usage example
numbers = [29, 25, 3, 49, 9, 37, 21, 43]
print("Before sorting:", numbers)
result = tim_sort(numbers[:])
print("After sorting:", result)`,

  cpp: `// Tim Sort in C++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int RUN = 32;

void insertionSort(vector<int>& arr, int left, int right) {
    for (int i = left + 1; i <= right; i++) {
        int temp = arr[i];
        int j = i - 1;
        while (j >= left && arr[j] > temp) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = temp;
    }
}

void merge(vector<int>& arr, int l, int m, int r) {
    int len1 = m - l + 1, len2 = r - m;
    vector<int> left(len1), right(len2);
    for (int i = 0; i < len1; i++) left[i] = arr[l + i];
    for (int i = 0; i < len2; i++) right[i] = arr[m + 1 + i];

    int i = 0, j = 0, k = l;
    while (i < len1 && j < len2) {
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    }
    while (i < len1) arr[k++] = left[i++];
    while (j < len2) arr[k++] = right[j++];
}

void timSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i += RUN) {
        insertionSort(arr, i, min((i + RUN - 1), (n - 1)));
    }
    for (int size = RUN; size < n; size = 2 * size) {
        for (int left = 0; left < n; left += 2 * size) {
            int mid = left + size - 1;
            int right = min((left + 2 * size - 1), (n - 1));
            if(mid < right) merge(arr, left, mid, right);
        }
    }
}

int main() {
    vector<int> numbers = {29, 25, 3, 49, 9, 37, 21, 43};
    cout << "Before sorting: ";
    for (int num : numbers) cout << num << " ";
    cout << endl;

    timSort(numbers);

    cout << "After sorting: ";
    for (int num : numbers) cout << num << " ";
    cout << endl;

    return 0;
}`
};

const fileNames = {
  javascript: 'timSort.js',
  python: 'tim_sort.py',
  cpp: 'tim_sort.cpp',
};

const TimSortCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default TimSortCode;