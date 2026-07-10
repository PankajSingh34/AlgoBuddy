"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Fibonacci Search in JavaScript
function fibonacciSearch(arr, target) {
    let n = arr.length;

    let fibMMm2 = 0;
    let fibMMm1 = 1;
    let fibM = fibMMm2 + fibMMm1;

    while (fibM < n) {
        fibMMm2 = fibMMm1;
        fibMMm1 = fibM;
        fibM = fibMMm2 + fibMMm1;
    }

    let offset = -1;

    while (fibM > 1) {
        let i = Math.min(offset + fibMMm2, n - 1);

        if (arr[i] < target) {
            fibM = fibMMm1;
            fibMMm1 = fibMMm2;
            fibMMm2 = fibM - fibMMm1;
            offset = i;
        } else if (arr[i] > target) {
            fibM = fibMMm2;
            fibMMm1 = fibMMm1 - fibMMm2;
            fibMMm2 = fibM - fibMMm1;
        } else {
            return i;
        }
    }

    if (fibMMm1 && arr[offset + 1] === target)
        return offset + 1;

    return -1;
}

// Example
const arr = [10,20,30,40,50,60,70];
console.log(fibonacciSearch(arr, 50));`,

  python: `# Fibonacci Search in Python
def fibonacci_search(arr, target):
    n = len(arr)

    fib2 = 0
    fib1 = 1
    fib = fib1 + fib2

    while fib < n:
        fib2 = fib1
        fib1 = fib
        fib = fib1 + fib2

    offset = -1

    while fib > 1:
        i = min(offset + fib2, n - 1)

        if arr[i] < target:
            fib = fib1
            fib1 = fib2
            fib2 = fib - fib1
            offset = i
        elif arr[i] > target:
            fib = fib2
            fib1 = fib1 - fib2
            fib2 = fib - fib1
        else:
            return i

    if fib1 and offset + 1 < n and arr[offset + 1] == target:
        return offset + 1

    return -1

arr = [10,20,30,40,50,60,70]
print(fibonacci_search(arr,50))`,

  java: `// Fibonacci Search in Java
public class FibonacciSearch {

    static int fibonacciSearch(int[] arr, int target) {

        int n = arr.length;

        int fib2 = 0;
        int fib1 = 1;
        int fib = fib1 + fib2;

        while (fib < n) {
            fib2 = fib1;
            fib1 = fib;
            fib = fib1 + fib2;
        }

        int offset = -1;

        while (fib > 1) {

            int i = Math.min(offset + fib2, n - 1);

            if (arr[i] < target) {
                fib = fib1;
                fib1 = fib2;
                fib2 = fib - fib1;
                offset = i;
            } else if (arr[i] > target) {
                fib = fib2;
                fib1 = fib1 - fib2;
                fib2 = fib - fib1;
            } else {
                return i;
            }
        }

        if (fib1 == 1 && arr[offset + 1] == target)
            return offset + 1;

        return -1;
    }

    public static void main(String[] args) {
        int[] arr={10,20,30,40,50,60,70};
        System.out.println(fibonacciSearch(arr,50));
    }
}`,

  c: `// Fibonacci Search in C
#include <stdio.h>

int fibonacciSearch(int arr[], int n, int target){

    int fib2=0,fib1=1,fib=fib1+fib2;

    while(fib<n){
        fib2=fib1;
        fib1=fib;
        fib=fib1+fib2;
    }

    int offset=-1;

    while(fib>1){

        int i=(offset+fib2<n-1)?offset+fib2:n-1;

        if(arr[i]<target){
            fib=fib1;
            fib1=fib2;
            fib2=fib-fib1;
            offset=i;
        }
        else if(arr[i]>target){
            fib=fib2;
            fib1=fib1-fib2;
            fib2=fib-fib1;
        }
        else
            return i;
    }

    if(fib1 && arr[offset+1]==target)
        return offset+1;

    return -1;
}

int main(){

    int arr[]={10,20,30,40,50,60,70};

    printf("%d",fibonacciSearch(arr,7,50));

    return 0;
}`,

  cpp: `// Fibonacci Search in C++
#include<iostream>
using namespace std;

int fibonacciSearch(int arr[],int n,int target){

    int fib2=0,fib1=1,fib=fib1+fib2;

    while(fib<n){
        fib2=fib1;
        fib1=fib;
        fib=fib1+fib2;
    }

    int offset=-1;

    while(fib>1){

        int i=min(offset+fib2,n-1);

        if(arr[i]<target){
            fib=fib1;
            fib1=fib2;
            fib2=fib-fib1;
            offset=i;
        }
        else if(arr[i]>target){
            fib=fib2;
            fib1=fib1-fib2;
            fib2=fib-fib1;
        }
        else
            return i;
    }

    if(fib1 && arr[offset+1]==target)
        return offset+1;

    return -1;
}

int main(){

    int arr[]={10,20,30,40,50,60,70};

    cout<<fibonacciSearch(arr,7,50);

    return 0;
}`,
};

const fileNames = {
  javascript: "fibonacciSearch.js",
  python: "fibonacci_search.py",
  java: "FibonacciSearch.java",
  c: "fibonacci_search.c",
  cpp: "fibonacci_search.cpp",
};

const FibonacciSearchCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default FibonacciSearchCode;