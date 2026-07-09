"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Interpolation Search in JavaScript
function interpolationSearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;

    while (
        low <= high &&
        target >= arr[low] &&
        target <= arr[high]
    ) {

        let pos =
            low +
            Math.floor(
                ((target - arr[low]) * (high - low)) /
                (arr[high] - arr[low])
            );

        if (arr[pos] === target)
            return pos;

        if (arr[pos] < target)
            low = pos + 1;
        else
            high = pos - 1;
    }

    return -1;
}

// Example
const arr = [10,20,30,40,50,60,70];
console.log(interpolationSearch(arr,40));`,

  python: `# Interpolation Search in Python

def interpolation_search(arr, target):

    low = 0
    high = len(arr) - 1

    while low <= high and target >= arr[low] and target <= arr[high]:

        pos = low + ((target - arr[low]) * (high - low)) // (arr[high] - arr[low])

        if arr[pos] == target:
            return pos

        elif arr[pos] < target:
            low = pos + 1

        else:
            high = pos - 1

    return -1


arr = [10,20,30,40,50,60,70]
print(interpolation_search(arr,40))`,

  java: `// Interpolation Search in Java

class InterpolationSearch {

    static int interpolationSearch(int arr[], int target) {

        int low = 0;
        int high = arr.length - 1;

        while (low <= high &&
                target >= arr[low] &&
                target <= arr[high]) {

            int pos = low +
                    ((target - arr[low]) * (high - low))
                    / (arr[high] - arr[low]);

            if (arr[pos] == target)
                return pos;

            if (arr[pos] < target)
                low = pos + 1;
            else
                high = pos - 1;
        }

        return -1;
    }

    public static void main(String[] args) {

        int arr[] = {10,20,30,40,50,60,70};

        System.out.println(interpolationSearch(arr,40));
    }
}`,

  c: `// Interpolation Search in C

#include<stdio.h>

int interpolationSearch(int arr[], int n, int target){

    int low = 0;
    int high = n - 1;

    while(low <= high &&
          target >= arr[low] &&
          target <= arr[high]){

        int pos = low +
                  ((target-arr[low])*(high-low))
                  /(arr[high]-arr[low]);

        if(arr[pos]==target)
            return pos;

        if(arr[pos]<target)
            low=pos+1;
        else
            high=pos-1;
    }

    return -1;
}

int main(){

    int arr[]={10,20,30,40,50,60,70};

    int n=sizeof(arr)/sizeof(arr[0]);

    printf("%d",interpolationSearch(arr,n,40));

    return 0;
}`,

  cpp: `// Interpolation Search in C++

#include<iostream>
using namespace std;

int interpolationSearch(int arr[], int n, int target){

    int low=0;
    int high=n-1;

    while(low<=high &&
          target>=arr[low] &&
          target<=arr[high]){

        int pos=low+
                ((target-arr[low])*(high-low))
                /(arr[high]-arr[low]);

        if(arr[pos]==target)
            return pos;

        if(arr[pos]<target)
            low=pos+1;
        else
            high=pos-1;
    }

    return -1;
}

int main(){

    int arr[]={10,20,30,40,50,60,70};

    int n=sizeof(arr)/sizeof(arr[0]);

    cout<<interpolationSearch(arr,n,40);

    return 0;
}`,
};

const fileNames = {
  javascript: "interpolationSearch.js",
  python: "interpolation_search.py",
  java: "InterpolationSearch.java",
  c: "interpolation_search.c",
  cpp: "interpolation_search.cpp",
};

const InterpolationSearchCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default InterpolationSearchCode;