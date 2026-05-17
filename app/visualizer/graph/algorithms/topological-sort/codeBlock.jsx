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
    javascript: `// Topological Sort (Kahn's Algorithm) in JavaScript
function topologicalSort(vertices, edges) {
  const adj = Array.from({ length: vertices }, () => []);
  const inDegree = new Array(vertices).fill(0);

  for (const [u, v] of edges) {
    adj[u].push(v);
    inDegree[v]++;
  }

  const queue = [];
  for (let i = 0; i < vertices; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);

    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }

  return order.length === vertices ? order : null; // null if cycle
}

// Usage
const vertices = 5;
const edges = [[0, 2], [1, 2], [2, 3], [2, 4]];
const result = topologicalSort(vertices, edges);
console.log("Topological order:", result);

// DFS-based approach
function topologicalSortDFS(vertices, edges) {
  const adj = Array.from({ length: vertices }, () => []);
  for (const [u, v] of edges) adj[u].push(v);

  const visited = new Array(vertices).fill(false);
  const stack = [];

  function dfs(u) {
    visited[u] = true;
    for (const v of adj[u]) {
      if (!visited[v]) dfs(v);
    }
    stack.push(u);
  }

  for (let i = 0; i < vertices; i++) {
    if (!visited[i]) dfs(i);
  }
  return stack.reverse();
}`,

    python: `# Topological Sort (Kahn's Algorithm) in Python
from collections import deque

def topological_sort(vertices, edges):
    adj = [[] for _ in range(vertices)]
    in_degree = [0] * vertices

    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1

    queue = deque([i for i in range(vertices) if in_degree[i] == 0])
    order = []

    while queue:
        u = queue.popleft()
        order.append(u)

        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    return order if len(order) == vertices else None

# Usage
vertices = 5
edges = [(0, 2), (1, 2), (2, 3), (2, 4)]
result = topological_sort(vertices, edges)
print("Topological order:", result)

# DFS-based approach
def topological_sort_dfs(vertices, edges):
    adj = [[] for _ in range(vertices)]
    for u, v in edges:
        adj[u].append(v)

    visited = [False] * vertices
    stack = []

    def dfs(u):
        visited[u] = True
        for v in adj[u]:
            if not visited[v]:
                dfs(v)
        stack.append(u)

    for i in range(vertices):
        if not visited[i]:
            dfs(i)
    return stack[::-1]`,

    java: `// Topological Sort (Kahn's Algorithm) in Java
import java.util.*;

public class TopologicalSort {
    public static List<Integer> topologicalSort(int vertices, int[][] edges) {
        List<Integer>[] adj = new ArrayList[vertices];
        int[] inDegree = new int[vertices];
        for (int i = 0; i < vertices; i++) adj[i] = new ArrayList<>();

        for (int[] edge : edges) {
            adj[edge[0]].add(edge[1]);
            inDegree[edge[1]]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < vertices; i++) {
            if (inDegree[i] == 0) queue.add(i);
        }

        List<Integer> order = new ArrayList<>();
        while (!queue.isEmpty()) {
            int u = queue.poll();
            order.add(u);
            for (int v : adj[u]) {
                inDegree[v]--;
                if (inDegree[v] == 0) queue.add(v);
            }
        }

        return order.size() == vertices ? order : null;
    }

    public static void main(String[] args) {
        int vertices = 5;
        int[][] edges = {{0,2}, {1,2}, {2,3}, {2,4}};
        List<Integer> result = topologicalSort(vertices, edges);
        System.out.println("Topological order: " + result);
    }
}

// DFS-based approach
class TopologicalSortDFS {
    static List<Integer> topologicalSort(int vertices, int[][] edges) {
        List<Integer>[] adj = new ArrayList[vertices];
        for (int i = 0; i < vertices; i++) adj[i] = new ArrayList<>();
        for (int[] e : edges) adj[e[0]].add(e[1]);

        boolean[] visited = new boolean[vertices];
        Stack<Integer> stack = new Stack<>();

        void dfs(int u) {
            visited[u] = true;
            for (int v : adj[u]) if (!visited[v]) dfs(v);
            stack.push(u);
        }

        for (int i = 0; i < vertices; i++)
            if (!visited[i]) dfs(i);

        List<Integer> order = new ArrayList<>();
        while (!stack.isEmpty()) order.add(stack.pop());
        return order;
    }
}`,

    c: `// Topological Sort (Kahn's Algorithm) in C
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX 100

typedef struct {
    int items[MAX];
    int front, rear;
} Queue;

Queue* createQueue() {
    Queue* q = malloc(sizeof(Queue));
    q->front = 0; q->rear = -1;
    return q;
}

void enqueue(Queue* q, int v) { q->items[++q->rear] = v; }
int dequeue(Queue* q) { return q->items[q->front++]; }
bool isEmpty(Queue* q) { return q->front > q->rear; }

int* topologicalSort(int vertices, int edges[][2], int edgeCount) {
    int* adj[MAX] = {0};
    int adjCount[MAX] = {0};
    int inDegree[MAX] = {0};

    for (int i = 0; i < edgeCount; i++) {
        int u = edges[i][0], v = edges[i][1];
        if (!adj[u]) adj[u] = malloc(MAX * sizeof(int));
        adj[u][adjCount[u]++] = v;
        inDegree[v]++;
    }

    Queue* q = createQueue();
    for (int i = 0; i < vertices; i++)
        if (inDegree[i] == 0) enqueue(q, i);

    int* order = malloc(vertices * sizeof(int));
    int idx = 0;

    while (!isEmpty(q)) {
        int u = dequeue(q);
        order[idx++] = u;
        for (int j = 0; j < adjCount[u]; j++) {
            int v = adj[u][j];
            if (--inDegree[v] == 0) enqueue(q, v);
        }
    }

    if (idx != vertices) { free(order); return NULL; }
    return order;
}

int main() {
    int vertices = 5;
    int edges[][2] = {{0,2}, {1,2}, {2,3}, {2,4}};
    int* order = topologicalSort(vertices, edges, 4);
    if (order) {
        printf("Topological order: ");
        for (int i = 0; i < vertices; i++) printf("%d ", order[i]);
        printf("\\n");
        free(order);
    }
    return 0;
}`,

    cpp: `// Topological Sort (Kahn's Algorithm) in C++
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<int> topologicalSort(int vertices, vector<pair<int,int>>& edges) {
    vector<vector<int>> adj(vertices);
    vector<int> inDegree(vertices, 0);

    for (auto& [u, v] : edges) {
        adj[u].push_back(v);
        inDegree[v]++;
    }

    queue<int> q;
    for (int i = 0; i < vertices; i++)
        if (inDegree[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);

        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }

    return order.size() == vertices ? order : vector<int>();
}

int main() {
    int vertices = 5;
    vector<pair<int,int>> edges = {{0,2}, {1,2}, {2,3}, {2,4}};
    auto order = topologicalSort(vertices, edges);
    if (!order.empty()) {
        cout << "Topological order: ";
        for (int v : order) cout << v << " ";
        cout << endl;
    }
    return 0;
}

// DFS-based approach
vector<int> topologicalSortDFS(int vertices, vector<pair<int,int>>& edges) {
    vector<vector<int>> adj(vertices);
    for (auto& [u, v] : edges) adj[u].push_back(v);

    vector<bool> visited(vertices, false);
    vector<int> order;

    function<void(int)> dfs = [&](int u) {
        visited[u] = true;
        for (int v : adj[u])
            if (!visited[v]) dfs(v);
        order.push_back(u);
    };

    for (int i = 0; i < vertices; i++)
        if (!visited[i]) dfs(i);

    reverse(order.begin(), order.end());
    return order;
}`
  };

  return (
    <div className="max-w-4xl mx-auto" ref={topRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <FaCode className="text-blue-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Topological Sort Implementation</h3>
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
