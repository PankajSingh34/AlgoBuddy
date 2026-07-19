"use client";

import CodeBlock from "@/app/components/ui/CodeBlock";

const codeExamples = {
  javascript: `// Character Frequency in JavaScript
function characterFrequency(str) {
  const freq = {};

  for (const ch of str) {
    if (freq[ch]) {
      freq[ch]++;
    } else {
      freq[ch] = 1;
    }
  }

  return freq;
}

// Usage
const text = "banana";
console.log(characterFrequency(text));

// Output:
// { b: 1, a: 3, n: 2 }`,

  python: `# Character Frequency in Python
def character_frequency(text):
    freq = {}

    for ch in text:
        if ch in freq:
            freq[ch] += 1
        else:
            freq[ch] = 1

    return freq

# Usage
text = "banana"
print(character_frequency(text))

# Output:
# {'b': 1, 'a': 3, 'n': 2}`,

  java: `// Character Frequency in Java
import java.util.HashMap;

public class CharacterFrequency {

    public static void frequency(String text) {

        HashMap<Character, Integer> map = new HashMap<>();

        for(char ch : text.toCharArray()) {
            map.put(ch, map.getOrDefault(ch, 0) + 1);
        }

        System.out.println(map);
    }

    public static void main(String[] args) {
        frequency("banana");
    }
}`,

  cpp: `// Character Frequency in C++
#include <iostream>
#include <unordered_map>
using namespace std;

int main() {

    string text = "banana";

    unordered_map<char,int> freq;

    for(char ch : text)
        freq[ch]++;

    for(auto x : freq)
        cout << x.first << " : " << x.second << endl;

    return 0;
}`,

  c: `// Character Frequency in C
#include <stdio.h>
#include <string.h>

int main() {

    char str[] = "banana";
    int freq[256] = {0};

    for(int i = 0; str[i] != '\\0'; i++) {
        freq[(unsigned char)str[i]]++;
    }

    for(int i = 0; i < 256; i++) {
        if(freq[i] != 0)
            printf("%c : %d\\n", i, freq[i]);
    }

    return 0;
}`,
};

const fileNames = {
  javascript: "characterFrequency.js",
  python: "character_frequency.py",
  java: "CharacterFrequency.java",
  cpp: "character_frequency.cpp",
  c: "character_frequency.c",
};

export default function CharacterFrequencyCode() {
  return (
    <CodeBlock
      variant="macos"
      codeExamples={codeExamples}
      fileNames={fileNames}
    />
  );
}