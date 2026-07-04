'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Shell Sort in JavaScript
function bucketSort(arr, bucketSize = 5) {
  if (arr.length === 0) {
    return arr;
  }

  let minValue = arr[0];
  let maxValue = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
    } else if (arr[i] > maxValue) {
      maxValue = arr[i];
    }
  }

  const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  const buckets = new Array(bucketCount);
  for (let i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }

  for (let i = 0; i < arr.length; i++) {
    const bucketIndex = Math.floor((arr[i] - minValue) / bucketSize);
    buckets[bucketIndex].push(arr[i]);
  }

  const sortedArray = [];
  for (let i = 0; i < buckets.length; i++) {
    // Using insertion sort for smaller arrays within buckets
    const bucket = buckets[i];
    for (let j = 1; j < bucket.length; j++) {
      const temp = bucket[j];
      let k = j - 1;
      while (k >= 0 && bucket[k] > temp) {
        bucket[k + 1] = bucket[k];
        k--;
      }
      bucket[k + 1] = temp;
    }
    for (let j = 0; j < bucket.length; j++) {
      sortedArray.push(bucket[j]);
    }
  }

  return sortedArray;
}
// Usage example
const numbers = [29, 25, 3, 49, 9, 37, 21, 43];
console.log("Before sorting:", numbers);
const result = bucketSort([...numbers]);
console.log("After sorting:", result);`,

  python: `# Shell Sort in Python
def bucket_sort(arr):
    n = len(arr)
    if n == 0:
        return arr

    max_val, min_val = max(arr), min(arr)
    bucket_count = (max_val - min_val) // 5 + 1
    buckets = [[] for _ in range(bucket_count)]

    for num in arr:
        index = (num - min_val) // 5
        buckets[index].append(num)

    sorted_arr = []
    for bucket in buckets:
        # Using insertion sort for buckets
        for i in range(1, len(bucket)):
            key = bucket[i]
            j = i - 1
            while j >= 0 and key < bucket[j]:
                bucket[j + 1] = bucket[j]
                j -= 1
            bucket[j + 1] = key
        sorted_arr.extend(bucket)
    
    return sorted_arr

# Usage example
numbers = [29, 25, 3, 49, 9, 37, 21, 43]
print("Before sorting:", numbers)
result = bucket_sort(numbers[:])
print("After sorting:", result)`,

  java: `// Shell Sort in Java
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

void bucketSort(vector<int>& arr) {
    int n = arr.size();
    if (n == 0) return;

    int max_val = *max_element(arr.begin(), arr.end());
    int min_val = *min_element(arr.begin(), arr.end());
    int bucket_size = 5;
    int bucket_count = floor((max_val - min_val) / bucket_size) + 1;
    vector<vector<int>> buckets(bucket_count);

    for (int i = 0; i < n; i++) {
        int bucket_index = floor((arr[i] - min_val) / bucket_size);
        buckets[bucket_index].push_back(arr[i]);
    }

    arr.clear();
    for (int i = 0; i < bucket_count; i++) {
        sort(buckets[i].begin(), buckets[i].end()); // Using std::sort for buckets
        for (int j = 0; j < buckets[i].size(); j++) {
            arr.push_back(buckets[i][j]);
        }
    }
}

int main() {
    vector<int> numbers = {29, 25, 3, 49, 9, 37, 21, 43};
    cout << "Before sorting: ";
    for (int num : numbers) cout << num << " ";
    cout << endl;

    bucketSort(numbers);

    cout << "After sorting: ";
    for (int num : numbers) cout << num << " ";
    cout << endl;

    return 0;
}`
};

const fileNames = {
  javascript: 'bucketSort.js',
  python: 'bucket_sort.py',
  java: 'BucketSort.java',
  cpp: 'bucket_sort.cpp',
};

const BucketSortCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default BucketSortCode;