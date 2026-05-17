'use client';
import { useState, useRef } from 'react';
import { FaCopy, FaCheck, FaCode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

export const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  return hljs.highlight(code, { language: validLanguage }).value;
};

const CodeBlock = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const topRef = useRef(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' }
  ];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const codeExamples = {
    javascript: `// DFS in JavaScript (Recursive + Iterative)

// Recursive DFS
function dfsRecursive(graph, vertex, visited = new Set(), order = []) {
  visited.add(vertex);
  order.push(vertex);

  for (const neighbor of graph[vertex]) {
    if (!visited.has(neighbor)) {
      dfsRecursive(graph, neighbor, visited, order);
    }
  }

  return order;
}

// Iterative DFS
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const order = [];

  while (stack.length > 0) {
    const vertex = stack.pop();

    if (!visited.has(vertex)) {
      visited.add(vertex);
      order.push(vertex);

      for (const neighbor of graph[vertex].reverse()) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }

  return order;
}

// Usage
const graph = [
  [1, 2],    // 0
  [0, 3, 4], // 1
  [0, 5],    // 2
  [1],       // 3
  [1],       // 4
  [2]        // 5
];
console.log(dfsRecursive(graph, 0)); // [0, 1, 3, 4, 2, 5]`,

    python: `# DFS in Python (Recursive + Iterative)

# Recursive DFS
def dfs_recursive(graph, vertex, visited=None, order=None):
    if visited is None:
        visited = set()
    if order is None:
        order = []

    visited.add(vertex)
    order.append(vertex)

    for neighbor in graph[vertex]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited, order)

    return order

# Iterative DFS
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    order = []

    while stack:
        vertex = stack.pop()

        if vertex not in visited:
            visited.add(vertex)
            order.append(vertex)

            for neighbor in reversed(graph[vertex]):
                if neighbor not in visited:
                    stack.append(neighbor)

    return order

# Usage
graph = [
    [1, 2],    # 0
    [0, 3, 4], # 1
    [0, 5],    # 2
    [1],       # 3
    [1],       # 4
    [2]        # 5
]
print(dfs_recursive(graph, 0))  # [0, 1, 3, 4, 2, 5]`,

    java: `// DFS in Java (Recursive + Iterative)
import java.util.*;

public class DFS {

    // Recursive DFS
    public static void dfsRecursive(List<List<Integer>> graph, int vertex,
                                     Set<Integer> visited, List<Integer> order) {
        visited.add(vertex);
        order.add(vertex);

        for (int neighbor : graph.get(vertex)) {
            if (!visited.contains(neighbor)) {
                dfsRecursive(graph, neighbor, visited, order);
            }
        }
    }

    // Iterative DFS
    public static List<Integer> dfsIterative(List<List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        Stack<Integer> stack = new Stack<>();
        List<Integer> order = new ArrayList<>();

        stack.push(start);

        while (!stack.isEmpty()) {
            int vertex = stack.pop();

            if (!visited.contains(vertex)) {
                visited.add(vertex);
                order.add(vertex);

                List<Integer> neighbors = graph.get(vertex);
                for (int i = neighbors.size() - 1; i >= 0; i--) {
                    int neighbor = neighbors.get(i);
                    if (!visited.contains(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }

        return order;
    }

    public static void main(String[] args) {
        List<List<Integer>> graph = Arrays.asList(
            Arrays.asList(1, 2),
            Arrays.asList(0, 3, 4),
            Arrays.asList(0, 5),
            Arrays.asList(1),
            Arrays.asList(1),
            Arrays.asList(2)
        );

        List<Integer> order = new ArrayList<>();
        dfsRecursive(graph, 0, new HashSet<>(), order);
        System.out.println(order); // [0, 1, 3, 4, 2, 5]
    }
}`,

    c: `// DFS in C (Iterative with Stack)
#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#define V 6

int graph[V][V] = {
    {0, 1, 1, 0, 0, 0},
    {1, 0, 0, 1, 1, 0},
    {1, 0, 0, 0, 0, 1},
    {0, 1, 0, 0, 0, 0},
    {0, 1, 0, 0, 0, 0},
    {0, 0, 1, 0, 0, 0}
};

void dfs(int start) {
    bool visited[V] = {false};
    int stack[V], top = -1;

    stack[++top] = start;

    while (top >= 0) {
        int vertex = stack[top--];

        if (!visited[vertex]) {
            visited[vertex] = true;
            printf("%d ", vertex);

            for (int i = V - 1; i >= 0; i--) {
                if (graph[vertex][i] && !visited[i]) {
                    stack[++top] = i;
                }
            }
        }
    }
}

int main() {
    printf("DFS: ");
    dfs(0); // 0 1 3 4 2 5
    return 0;
}`,

    cpp: `// DFS in C++ (Recursive + Iterative)
#include <iostream>
#include <vector>
#include <stack>
#include <unordered_set>
using namespace std;

// Recursive DFS
void dfsRecursive(const vector<vector<int>>& graph, int vertex,
                   unordered_set<int>& visited, vector<int>& order) {
    visited.insert(vertex);
    order.push_back(vertex);

    for (int neighbor : graph[vertex]) {
        if (!visited.count(neighbor)) {
            dfsRecursive(graph, neighbor, visited, order);
        }
    }
}

// Iterative DFS
vector<int> dfsIterative(const vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    stack<int> st;
    vector<int> order;

    st.push(start);

    while (!st.empty()) {
        int vertex = st.top();
        st.pop();

        if (!visited.count(vertex)) {
            visited.insert(vertex);
            order.push_back(vertex);

            auto& neighbors = graph[vertex];
            for (auto it = neighbors.rbegin(); it != neighbors.rend(); ++it) {
                if (!visited.count(*it)) {
                    st.push(*it);
                }
            }
        }
    }

    return order;
}

int main() {
    vector<vector<int>> graph = {
        {1, 2}, {0, 3, 4}, {0, 5}, {1}, {1}, {2}
    };

    vector<int> order;
    unordered_set<int> visited;
    dfsRecursive(graph, 0, visited, order);
    for (int v : order) cout << v << " "; // 0 1 3 4 2 5
    return 0;
}`
  };

  return (
    <div className="max-w-4xl mx-auto" ref={topRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <FaCode className="text-blue-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">DFS Implementation</h3>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium"
            aria-label="Copy code">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center text-green-600 dark:text-green-400"><FaCheck className="mr-1" /> Copied</motion.span>
              ) : (
                <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center"><FaCopy className="mr-1" /> Copy Code</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          {languages.map((lang) => (
            <motion.button key={lang.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedLanguage === lang.id ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              {lang.name}
            </motion.button>
          ))}
        </div>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={selectedLanguage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-x-auto p-4 bg-gray-900 text-white">
              <pre className="text-sm leading-relaxed">
                <code className={`language-${selectedLanguage}`} dangerouslySetInnerHTML={{ __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage) }} />
              </pre>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {isHovered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-3 right-3 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md">
                {selectedLanguage.toUpperCase()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeBlock;
