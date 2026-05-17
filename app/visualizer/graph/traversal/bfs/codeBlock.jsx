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
    javascript: `// BFS in JavaScript
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const order = [];

  visited.add(start);

  while (queue.length > 0) {
    const vertex = queue.shift();
    order.push(vertex);

    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

// Usage
const graph = [
  [1, 2],    // 0 connected to 1, 2
  [0, 3, 4], // 1 connected to 0, 3, 4
  [0, 5],    // 2 connected to 0, 5
  [1],       // 3 connected to 1
  [1],       // 4 connected to 1
  [2]        // 5 connected to 2
];
console.log(bfs(graph, 0)); // [0, 1, 2, 3, 4, 5]`,

    python: `# BFS in Python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []

    while queue:
        vertex = queue.popleft()
        order.append(vertex)

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order

# Usage
graph = [
    [1, 2],    # 0 connected to 1, 2
    [0, 3, 4], # 1 connected to 0, 3, 4
    [0, 5],    # 2 connected to 0, 5
    [1],       # 3 connected to 1
    [1],       # 4 connected to 1
    [2]        # 5 connected to 2
]
print(bfs(graph, 0))  # [0, 1, 2, 3, 4, 5]`,

    java: `// BFS in Java
import java.util.*;

public class BFS {
    public static List<Integer> bfs(List<List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        List<Integer> order = new ArrayList<>();

        visited.add(start);
        queue.add(start);

        while (!queue.isEmpty()) {
            int vertex = queue.poll();
            order.add(vertex);

            for (int neighbor : graph.get(vertex)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
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
        System.out.println(bfs(graph, 0)); // [0, 1, 2, 3, 4, 5]
    }
}`,

    c: `// BFS in C
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

void bfs(int start) {
    bool visited[V] = {false};
    int queue[V], front = 0, rear = 0;

    visited[start] = true;
    queue[rear++] = start;

    while (front < rear) {
        int vertex = queue[front++];
        printf("%d ", vertex);

        for (int i = 0; i < V; i++) {
            if (graph[vertex][i] && !visited[i]) {
                visited[i] = true;
                queue[rear++] = i;
            }
        }
    }
}

int main() {
    printf("BFS: ");
    bfs(0); // 0 1 2 3 4 5
    return 0;
}`,

    cpp: `// BFS in C++
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

vector<int> bfs(const vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    queue<int> q;
    vector<int> order;

    visited.insert(start);
    q.push(start);

    while (!q.empty()) {
        int vertex = q.front();
        q.pop();
        order.push_back(vertex);

        for (int neighbor : graph[vertex]) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }

    return order;
}

int main() {
    vector<vector<int>> graph = {
        {1, 2},     // 0
        {0, 3, 4},  // 1
        {0, 5},     // 2
        {1},        // 3
        {1},        // 4
        {2}         // 5
    };
    auto result = bfs(graph, 0);
    for (int v : result) cout << v << " "; // 0 1 2 3 4 5
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">BFS Implementation</h3>
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
