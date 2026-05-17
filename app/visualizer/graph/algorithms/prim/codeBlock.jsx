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
    javascript: `// Prim's Algorithm in JavaScript
function primMST(graph) {
  const V = graph.length;
  const key = new Array(V).fill(Infinity);
  const parent = new Array(V).fill(-1);
  const inMST = new Array(V).fill(false);
  key[0] = 0;

  for (let count = 0; count < V - 1; count++) {
    let u = -1;
    let min = Infinity;
    for (let v = 0; v < V; v++) {
      if (!inMST[v] && key[v] < min) {
        min = key[v];
        u = v;
      }
    }

    inMST[u] = true;

    for (let v = 0; v < V; v++) {
      if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
        parent[v] = u;
        key[v] = graph[u][v];
      }
    }
  }

  const mst = [];
  for (let i = 1; i < V; i++) {
    mst.push([parent[i], i, key[i]]);
  }
  return mst;
}

// Usage
const graph = [
  [0, 4, 2, 0, 0],
  [4, 0, 1, 5, 0],
  [2, 1, 0, 8, 10],
  [0, 5, 8, 0, 2],
  [0, 0, 10, 2, 0]
];
const mst = primMST(graph);
console.log("MST edges:", mst);`,

    python: `# Prim's Algorithm in Python
import heapq

def prim_mst(graph):
    V = len(graph)
    key = [float('inf')] * V
    parent = [-1] * V
    in_mst = [False] * V
    key[0] = 0
    pq = [(0, 0)]

    while pq:
        w, u = heapq.heappop(pq)
        in_mst[u] = True

        for v in range(V):
            if graph[u][v] and not in_mst[v] and graph[u][v] < key[v]:
                key[v] = graph[u][v]
                parent[v] = u
                heapq.heappush(pq, (key[v], v))

    mst = []
    for v in range(1, V):
        mst.append((parent[v], v, key[v]))
    return mst

# Usage
graph = [
    [0, 4, 2, 0, 0],
    [4, 0, 1, 5, 0],
    [2, 1, 0, 8, 10],
    [0, 5, 8, 0, 2],
    [0, 0, 10, 2, 0]
]
mst = prim_mst(graph)
print("MST edges:", mst)`,

    java: `// Prim's Algorithm in Java
import java.util.*;

public class PrimMST {
    public static List<int[]> primMST(int[][] graph) {
        int V = graph.length;
        int[] key = new int[V];
        int[] parent = new int[V];
        boolean[] inMST = new boolean[V];
        Arrays.fill(key, Integer.MAX_VALUE);
        key[0] = 0;
        parent[0] = -1;

        for (int count = 0; count < V - 1; count++) {
            int u = -1;
            int min = Integer.MAX_VALUE;
            for (int v = 0; v < V; v++) {
                if (!inMST[v] && key[v] < min) {
                    min = key[v];
                    u = v;
                }
            }

            inMST[u] = true;

            for (int v = 0; v < V; v++) {
                if (graph[u][v] != 0 && !inMST[v] && graph[u][v] < key[v]) {
                    parent[v] = u;
                    key[v] = graph[u][v];
                }
            }
        }

        List<int[]> mst = new ArrayList<>();
        for (int i = 1; i < V; i++) {
            mst.add(new int[]{parent[i], i, key[i]});
        }
        return mst;
    }

    public static void main(String[] args) {
        int[][] graph = {
            {0, 4, 2, 0, 0},
            {4, 0, 1, 5, 0},
            {2, 1, 0, 8, 10},
            {0, 5, 8, 0, 2},
            {0, 0, 10, 2, 0}
        };
        List<int[]> mst = primMST(graph);
        System.out.print("MST edges: ");
        for (int[] e : mst) System.out.print(Arrays.toString(e) + " ");
    }
}`,

    c: `// Prim's Algorithm in C
#include <stdio.h>
#include <limits.h>
#include <stdbool.h>

#define V 5

int minKey(int key[], bool inMST[]) {
    int min = INT_MAX, min_index;
    for (int v = 0; v < V; v++)
        if (!inMST[v] && key[v] < min)
            min = key[v], min_index = v;
    return min_index;
}

void primMST(int graph[V][V]) {
    int parent[V];
    int key[V];
    bool inMST[V];

    for (int i = 0; i < V; i++)
        key[i] = INT_MAX, inMST[i] = false;

    key[0] = 0;
    parent[0] = -1;

    for (int count = 0; count < V - 1; count++) {
        int u = minKey(key, inMST);
        inMST[u] = true;

        for (int v = 0; v < V; v++)
            if (graph[u][v] && !inMST[v] && graph[u][v] < key[v])
                parent[v] = u, key[v] = graph[u][v];
    }

    printf("MST edges:\\n");
    for (int i = 1; i < V; i++)
        printf("%d - %d (weight %d)\\n", parent[i], i, key[i]);
}

int main() {
    int graph[V][V] = {
        {0, 4, 2, 0, 0},
        {4, 0, 1, 5, 0},
        {2, 1, 0, 8, 10},
        {0, 5, 8, 0, 2},
        {0, 0, 10, 2, 0}
    };
    primMST(graph);
    return 0;
}`,

    cpp: `// Prim's Algorithm in C++
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

vector<vector<int>> primMST(vector<vector<int>>& graph) {
    int V = graph.size();
    vector<int> key(V, INT_MAX);
    vector<int> parent(V, -1);
    vector<bool> inMST(V, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;

    key[0] = 0;
    pq.push({0, 0});

    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        inMST[u] = true;

        for (int v = 0; v < V; v++) {
            if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
                key[v] = graph[u][v];
                parent[v] = u;
                pq.push({key[v], v});
            }
        }
    }

    vector<vector<int>> mst;
    for (int v = 1; v < V; v++)
        mst.push_back({parent[v], v, key[v]});
    return mst;
}

int main() {
    vector<vector<int>> graph = {
        {0, 4, 2, 0, 0},
        {4, 0, 1, 5, 0},
        {2, 1, 0, 8, 10},
        {0, 5, 8, 0, 2},
        {0, 0, 10, 2, 0}
    };
    auto mst = primMST(graph);
    cout << "MST edges: ";
    for (auto& e : mst) cout << "(" << e[0] << "," << e[1] << "," << e[2] << ") ";
    cout << endl;
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Prim's Algorithm Implementation</h3>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium"
            aria-label="Copy code">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center text-green-600 dark:text-green-400">
                  <FaCheck className="mr-1" /> Copied
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                  <FaCopy className="mr-1" /> Copy Code
                </motion.span>
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
            <motion.div key={selectedLanguage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="overflow-x-auto p-4 bg-gray-900 text-white">
              <pre className="text-sm leading-relaxed">
                <code className={`language-${selectedLanguage}`} dangerouslySetInnerHTML={{ __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage) }} />
              </pre>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {isHovered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-3 right-3 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md">
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
