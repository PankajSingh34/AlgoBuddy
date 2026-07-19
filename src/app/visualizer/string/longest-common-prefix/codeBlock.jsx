"use client";

const cpp = `#include <iostream>
#include <vector>
using namespace std;

string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";

    string prefix = strs[0];

    for (int i = 1; i < strs.size(); i++) {
        while (strs[i].find(prefix) != 0) {
            prefix.pop_back();

            if (prefix.empty())
                return "";
        }
    }

    return prefix;
}

int main() {
    vector<string> strs = {"flower", "flow", "flight"};

    cout << "Longest Common Prefix: "
         << longestCommonPrefix(strs);

    return 0;
}
`;

const java = `class Solution {

    public String longestCommonPrefix(String[] strs) {

        if (strs.length == 0) return "";

        String prefix = strs[0];

        for (int i = 1; i < strs.length; i++) {

            while (!strs[i].startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);

                if (prefix.isEmpty())
                    return "";
            }
        }

        return prefix;
    }
}
`;

const python = `def longest_common_prefix(strs):

    if not strs:
        return ""

    prefix = strs[0]

    for word in strs[1:]:

        while not word.startswith(prefix):
            prefix = prefix[:-1]

            if prefix == "":
                return ""

    return prefix

print(longest_common_prefix(
    ["flower","flow","flight"]
))
`;

const javascript = `function longestCommonPrefix(strs) {

    if (strs.length === 0) return "";

    let prefix = strs[0];

    for (let i = 1; i < strs.length; i++) {

        while (!strs[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1);

            if (prefix === "")
                return "";
        }
    }

    return prefix;
}

console.log(
    longestCommonPrefix([
        "flower",
        "flow",
        "flight"
    ])
);
`;

export default function CodeBlock() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-3">C++</h2>
        <pre className="rounded-lg bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm">
          <code>{cpp}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Java</h2>
        <pre className="rounded-lg bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm">
          <code>{java}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Python</h2>
        <pre className="rounded-lg bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm">
          <code>{python}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">JavaScript</h2>
        <pre className="rounded-lg bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm">
          <code>{javascript}</code>
        </pre>
      </div>
    </div>
  );
}