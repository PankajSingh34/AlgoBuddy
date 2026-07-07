"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Jump Search in JavaScript
function jumpSearch(arr, target) {
    const n = arr.length;
    const step = Math.floor(Math.sqrt(n));

    let prev = 0;
    let curr = step;

    while (arr[Math.min(curr, n) - 1] < target) {
        prev = curr;
        curr += step;

        if (prev >= n)
            return -1;
    }

    while (prev < Math.min(curr, n)) {
        if (arr[prev] === target)
            return prev;

        prev++;
    }

    return -1;
}

const arr = [2,4,6,8,10,12,14,16,18];
console.log(jumpSearch(arr, 12));`,

  python: `# Jump Search in Python
import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))

    prev = 0
    curr = step

    while arr[min(curr, n)-1] < target:
        prev = curr
        curr += step

        if prev >= n:
            return -1

    while prev < min(curr, n):
        if arr[prev] == target:
            return prev
        prev += 1

    return -1

arr = [2,4,6,8,10,12,14,16,18]
print(jump_search(arr,12))`,

  java: `public class JumpSearch {

    static int jumpSearch(int arr[], int target){

        int n = arr.length;
        int step = (int)Math.sqrt(n);

        int prev = 0;
        int curr = step;

        while(arr[Math.min(curr,n)-1] < target){

            prev = curr;
            curr += step;

            if(prev >= n)
                return -1;
        }

        while(prev < Math.min(curr,n)){

            if(arr[prev] == target)
                return prev;

            prev++;
        }

        return -1;
    }

    public static void main(String[] args){

        int arr[] = {2,4,6,8,10,12,14,16,18};

        System.out.println(jumpSearch(arr,12));
    }
}`,

  c: `#include<stdio.h>
#include<math.h>

int jumpSearch(int arr[],int n,int target){

    int step=sqrt(n);

    int prev=0;
    int curr=step;

    while(arr[(curr<n?curr:n)-1] < target){

        prev=curr;
        curr+=step;

        if(prev>=n)
            return -1;
    }

    while(prev<(curr<n?curr:n)){

        if(arr[prev]==target)
            return prev;

        prev++;
    }

    return -1;
}

int main(){

    int arr[]={2,4,6,8,10,12,14,16,18};

    printf("%d",jumpSearch(arr,9,12));

    return 0;
}`,

  cpp: `#include<iostream>
#include<vector>
#include<cmath>

using namespace std;

int jumpSearch(vector<int>& arr,int target){

    int n=arr.size();

    int step=sqrt(n);

    int prev=0;
    int curr=step;

    while(arr[min(curr,n)-1] < target){

        prev=curr;
        curr+=step;

        if(prev>=n)
            return -1;
    }

    while(prev<min(curr,n)){

        if(arr[prev]==target)
            return prev;

        prev++;
    }

    return -1;
}

int main(){

    vector<int> arr={2,4,6,8,10,12,14,16,18};

    cout<<jumpSearch(arr,12);

    return 0;
}`,
};

const fileNames = {
  javascript: "jumpSearch.js",
  python: "jump_search.py",
  java: "JumpSearch.java",
  c: "jump_search.c",
  cpp: "jump_search.cpp",
};

const JumpSearchCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default JumpSearchCode;