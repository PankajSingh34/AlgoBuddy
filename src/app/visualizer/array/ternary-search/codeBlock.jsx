"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Ternary Search in JavaScript (Iterative)
function ternarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid1 = left + Math.floor((right - left) / 3);
        const mid2 = right - Math.floor((right - left) / 3);

        if (arr[mid1] === target) {
            return mid1;
        }

        if (arr[mid2] === target) {
            return mid2;
        }

        if (target < arr[mid1]) {
            right = mid1 - 1;
        } else if (target > arr[mid2]) {
            left = mid2 + 1;
        } else {
            left = mid1 + 1;
            right = mid2 - 1;
        }
    }

    return -1;
}

// Usage Example
const numbers = [10, 20, 30, 40, 50, 60, 70, 80];
const target = 60;

const index = ternarySearch(numbers, target);

if (index !== -1) {
    console.log(\`Element found at index \${index}\`);
} else {
    console.log("Element not found");
}`,

  python: `# Ternary Search in Python (Iterative)

def ternary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3

        if arr[mid1] == target:
            return mid1

        if arr[mid2] == target:
            return mid2

        if target < arr[mid1]:
            right = mid1 - 1
        elif target > arr[mid2]:
            left = mid2 + 1
        else:
            left = mid1 + 1
            right = mid2 - 1

    return -1


numbers = [10, 20, 30, 40, 50, 60, 70, 80]
target = 60

result = ternary_search(numbers, target)

if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`,

  java: `// Ternary Search in Java

public class TernarySearch {

    static int ternarySearch(int[] arr, int target) {

        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {

            int mid1 = left + (right - left) / 3;
            int mid2 = right - (right - left) / 3;

            if (arr[mid1] == target)
                return mid1;

            if (arr[mid2] == target)
                return mid2;

            if (target < arr[mid1]) {
                right = mid1 - 1;
            } else if (target > arr[mid2]) {
                left = mid2 + 1;
            } else {
                left = mid1 + 1;
                right = mid2 - 1;
            }
        }

        return -1;
    }

    public static void main(String[] args) {

        int[] numbers = {10,20,30,40,50,60,70,80};

        int target = 60;

        int index = ternarySearch(numbers, target);

        if(index != -1)
            System.out.println("Element found at index " + index);
        else
            System.out.println("Element not found");
    }
}`,

  c: `// Ternary Search in C

#include <stdio.h>

int ternarySearch(int arr[], int size, int target) {

    int left = 0;
    int right = size - 1;

    while(left <= right) {

        int mid1 = left + (right-left)/3;
        int mid2 = right - (right-left)/3;

        if(arr[mid1] == target)
            return mid1;

        if(arr[mid2] == target)
            return mid2;

        if(target < arr[mid1])
            right = mid1 - 1;

        else if(target > arr[mid2])
            left = mid2 + 1;

        else {
            left = mid1 + 1;
            right = mid2 - 1;
        }
    }

    return -1;
}

int main() {

    int arr[] = {10,20,30,40,50,60,70,80};

    int size = sizeof(arr)/sizeof(arr[0]);

    int target = 60;

    int index = ternarySearch(arr,size,target);

    if(index != -1)
        printf("Element found at index %d\\n",index);
    else
        printf("Element not found\\n");

    return 0;
}`,

  cpp: `// Ternary Search in C++

#include <iostream>
#include <vector>

using namespace std;

int ternarySearch(vector<int> &arr, int target) {

    int left = 0;
    int right = arr.size() - 1;

    while(left <= right) {

        int mid1 = left + (right-left)/3;
        int mid2 = right - (right-left)/3;

        if(arr[mid1] == target)
            return mid1;

        if(arr[mid2] == target)
            return mid2;

        if(target < arr[mid1])
            right = mid1 - 1;

        else if(target > arr[mid2])
            left = mid2 + 1;

        else {
            left = mid1 + 1;
            right = mid2 - 1;
        }
    }

    return -1;
}

int main() {

    vector<int> numbers = {10,20,30,40,50,60,70,80};

    int target = 60;

    int index = ternarySearch(numbers,target);

    if(index != -1)
        cout << "Element found at index " << index << endl;
    else
        cout << "Element not found" << endl;

    return 0;
}`,
};

const fileNames = {
  javascript: "ternarySearch.js",
  python: "ternary_search.py",
  java: "TernarySearch.java",
  c: "ternary_search.c",
  cpp: "ternary_search.cpp",
};

const TernarySearchCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default TernarySearchCode;