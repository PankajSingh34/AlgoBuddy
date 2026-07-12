"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Exponential Search in JavaScript
function binarySearch(arr, left, right, target) {
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        if (arr[mid] === target)
            return mid;

        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return -1;
}

function exponentialSearch(arr, target) {
    const n = arr.length;

    if (arr[0] === target)
        return 0;

    let i = 1;

    while (i < n && arr[i] <= target)
        i *= 2;

    return binarySearch(arr, i / 2, Math.min(i, n - 1), target);
}

// Example
const arr = [2, 3, 4, 10, 40, 50, 60, 70];
console.log(exponentialSearch(arr, 40));`,

  python: `# Exponential Search in Python

def binary_search(arr, left, right, target):
    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid

        elif arr[mid] < target:
            left = mid + 1

        else:
            right = mid - 1

    return -1


def exponential_search(arr, target):
    n = len(arr)

    if arr[0] == target:
        return 0

    i = 1

    while i < n and arr[i] <= target:
        i *= 2

    return binary_search(arr, i // 2, min(i, n - 1), target)


arr = [2,3,4,10,40,50,60]
print(exponential_search(arr,40))`,

  java: `// Exponential Search in Java

class ExponentialSearch {

    static int binarySearch(int[] arr,int left,int right,int target){

        while(left<=right){

            int mid=left+(right-left)/2;

            if(arr[mid]==target)
                return mid;

            if(arr[mid]<target)
                left=mid+1;
            else
                right=mid-1;
        }

        return -1;
    }

    static int exponentialSearch(int[] arr,int target){

        int n=arr.length;

        if(arr[0]==target)
            return 0;

        int i=1;

        while(i<n && arr[i]<=target)
            i*=2;

        return binarySearch(arr,i/2,Math.min(i,n-1),target);
    }

    public static void main(String args[]){

        int arr[]={2,3,4,10,40,50,60};

        System.out.println(exponentialSearch(arr,40));
    }
}`,

  c: `// Exponential Search in C

#include<stdio.h>

int binarySearch(int arr[],int left,int right,int target){

    while(left<=right){

        int mid=left+(right-left)/2;

        if(arr[mid]==target)
            return mid;

        if(arr[mid]<target)
            left=mid+1;
        else
            right=mid-1;
    }

    return -1;
}

int exponentialSearch(int arr[],int n,int target){

    if(arr[0]==target)
        return 0;

    int i=1;

    while(i<n && arr[i]<=target)
        i*=2;

    return binarySearch(arr,i/2,(i<n)?i:n-1,target);
}

int main(){

    int arr[]={2,3,4,10,40,50,60};

    int n=sizeof(arr)/sizeof(arr[0]);

    printf("%d",exponentialSearch(arr,n,40));

    return 0;
}`,

  cpp: `// Exponential Search in C++

#include<iostream>
using namespace std;

int binarySearch(int arr[],int left,int right,int target){

    while(left<=right){

        int mid=left+(right-left)/2;

        if(arr[mid]==target)
            return mid;

        if(arr[mid]<target)
            left=mid+1;
        else
            right=mid-1;
    }

    return -1;
}

int exponentialSearch(int arr[],int n,int target){

    if(arr[0]==target)
        return 0;

    int i=1;

    while(i<n && arr[i]<=target)
        i*=2;

    return binarySearch(arr,i/2,min(i,n-1),target);
}

int main(){

    int arr[]={2,3,4,10,40,50,60};

    int n=sizeof(arr)/sizeof(arr[0]);

    cout<<exponentialSearch(arr,n,40);

    return 0;
}`,
};

const fileNames = {
  javascript: "exponentialSearch.js",
  python: "exponential_search.py",
  java: "ExponentialSearch.java",
  c: "exponential_search.c",
  cpp: "exponential_search.cpp",
};

const ExponentialSearchCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default ExponentialSearchCode;