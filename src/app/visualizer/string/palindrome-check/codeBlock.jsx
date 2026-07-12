"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Palindrome Check in JavaScript
function isPalindrome(str) {
    let left = 0;
    let right = str.length - 1;

    while (left < right) {
        if (str[left] !== str[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

// Example
const text = "madam";

if (isPalindrome(text)) {
    console.log("Palindrome");
} else {
    console.log("Not Palindrome");
}`,

  python: `# Palindrome Check in Python
def is_palindrome(text):
    left = 0
    right = len(text) - 1

    while left < right:
        if text[left] != text[right]:
            return False

        left += 1
        right -= 1

    return True

text = "madam"

if is_palindrome(text):
    print("Palindrome")
else:
    print("Not Palindrome")`,

  java: `// Palindrome Check in Java
public class PalindromeCheck {

    static boolean isPalindrome(String str) {

        int left = 0;
        int right = str.length() - 1;

        while(left < right){

            if(str.charAt(left) != str.charAt(right))
                return false;

            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args){

        String text = "madam";

        if(isPalindrome(text))
            System.out.println("Palindrome");
        else
            System.out.println("Not Palindrome");
    }
}`,

  c: `// Palindrome Check in C
#include <stdio.h>
#include <string.h>

int isPalindrome(char str[]) {

    int left = 0;
    int right = strlen(str) - 1;

    while(left < right){

        if(str[left] != str[right])
            return 0;

        left++;
        right--;
    }

    return 1;
}

int main(){

    char str[] = "madam";

    if(isPalindrome(str))
        printf("Palindrome");

    else
        printf("Not Palindrome");

    return 0;
}`,

  cpp: `// Palindrome Check in C++
#include <iostream>
using namespace std;

bool isPalindrome(string str){

    int left = 0;
    int right = str.length() - 1;

    while(left < right){

        if(str[left] != str[right])
            return false;

        left++;
        right--;
    }

    return true;
}

int main(){

    string text = "madam";

    if(isPalindrome(text))
        cout << "Palindrome";

    else
        cout << "Not Palindrome";

    return 0;
}`,
};

const fileNames = {
  javascript: "palindromeCheck.js",
  python: "palindrome_check.py",
  java: "PalindromeCheck.java",
  c: "palindrome_check.c",
  cpp: "palindrome_check.cpp",
};

const PalindromeCheckCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default PalindromeCheckCode;