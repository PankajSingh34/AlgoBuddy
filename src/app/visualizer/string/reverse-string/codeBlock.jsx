"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Reverse String in JavaScript
function reverseString(str) {
    let arr = str.split("");
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }

    return arr.join("");
}

// Usage
const input = "HELLO";
console.log(reverseString(input));`,

  python: `# Reverse String in Python
def reverse_string(s):
    arr = list(s)
    left = 0
    right = len(arr) - 1

    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1

    return "".join(arr)

# Usage
print(reverse_string("HELLO"))`,

  java: `// Reverse String in Java
public class ReverseString {

    public static String reverseString(String s) {
        char[] arr = s.toCharArray();

        int left = 0;
        int right = arr.length - 1;

        while (left < right) {
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;

            left++;
            right--;
        }

        return new String(arr);
    }

    public static void main(String[] args) {
        System.out.println(reverseString("HELLO"));
    }
}`,

  c: `// Reverse String in C
#include <stdio.h>
#include <string.h>

void reverseString(char str[]) {
    int left = 0;
    int right = strlen(str) - 1;

    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;

        left++;
        right--;
    }
}

int main() {
    char str[] = "HELLO";

    reverseString(str);

    printf("%s\\n", str);

    return 0;
}`,

  cpp: `// Reverse String in C++
#include <iostream>
#include <string>

using namespace std;

void reverseString(string &s) {
    int left = 0;
    int right = s.length() - 1;

    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}

int main() {
    string s = "HELLO";

    reverseString(s);

    cout << s << endl;

    return 0;
}`,
};

const fileNames = {
  javascript: "reverseString.js",
  python: "reverse_string.py",
  java: "ReverseString.java",
  c: "reverse_string.c",
  cpp: "reverse_string.cpp",
};

const ReverseStringCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default ReverseStringCode;