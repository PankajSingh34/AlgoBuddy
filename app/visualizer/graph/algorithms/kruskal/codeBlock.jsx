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
    javascript: `// Kruskal's Algorithm in JavaScript
class UnionFind {
  constructor(n) {
    this.parent = [...Array(n).keys()];
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x)
      this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  union(x, y) {
    const rx = this.find(x), ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry])
      this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry])
      this.parent[ry] = rx;
    else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
    return true;
  }
}

function kruskalMST(vertices, edges) {
  edges.sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(vertices);
  const mst = [];

  for (const [u, v, w] of edges) {
    if (uf.union(u, v)) {
      mst.push([u, v, w]);
    }
  }
  return mst;
}

// Usage
const vertices = 5;
const edges = [
  [0, 1, 4], [0, 2, 2], [1, 2, 1],
  [1, 3, 5], [2, 3, 8], [2, 4, 10], [3, 4, 2]
];
const mst = kruskalMST(vertices, edges);
console.log("MST:", mst);`,

    python: `# Kruskal's Algorithm in Python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        if self.rank[rx] < self.rank[ry]:
            self.parent[rx] = ry
        elif self.rank[rx] > self.rank[ry]:
            self.parent[ry] = rx
        else:
            self.parent[ry] = rx
            self.rank[rx] += 1
        return True

def kruskal_mst(vertices, edges):
    edges.sort(key=lambda x: x[2])
    uf = UnionFind(vertices)
    mst = []

    for u, v, w in edges:
        if uf.union(u, v):
            mst.append((u, v, w))
    return mst

# Usage
vertices = 5
edges = [
    (0, 1, 4), (0, 2, 2), (1, 2, 1),
    (1, 3, 5), (2, 3, 8), (2, 4, 10), (3, 4, 2)
]
mst = kruskal_mst(vertices, edges)
print("MST:", mst)`,

    java: `// Kruskal's Algorithm in Java
import java.util.*;

class Edge implements Comparable<Edge> {
    int src, dest, weight;
    Edge(int s, int d, int w) { src = s; dest = d; weight = w; }
    public int compareTo(Edge other) { return this.weight - other.weight; }
}

class UnionFind {
    int[] parent, rank;
    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    boolean union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank[rx] < rank[ry]) parent[rx] = ry;
        else if (rank[rx] > rank[ry]) parent[ry] = rx;
        else { parent[ry] = rx; rank[rx]++; }
        return true;
    }
}

public class KruskalMST {
    public static List<Edge> kruskalMST(int vertices, List<Edge> edges) {
        Collections.sort(edges);
        UnionFind uf = new UnionFind(vertices);
        List<Edge> mst = new ArrayList<>();

        for (Edge e : edges) {
            if (uf.union(e.src, e.dest))
                mst.add(e);
        }
        return mst;
    }

    public static void main(String[] args) {
        int vertices = 5;
        List<Edge> edges = Arrays.asList(
            new Edge(0,1,4), new Edge(0,2,2), new Edge(1,2,1),
            new Edge(1,3,5), new Edge(2,3,8), new Edge(2,4,10), new Edge(3,4,2)
        );
        List<Edge> mst = kruskalMST(vertices, edges);
        System.out.print("MST: ");
        for (Edge e : mst)
            System.out.print("(" + e.src + "," + e.dest + "," + e.weight + ") ");
    }
}`,

    c: `// Kruskal's Algorithm in C
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int src, dest, weight;
} Edge;

typedef struct {
    int *parent, *rank;
    int n;
} UnionFind;

UnionFind* createUF(int n) {
    UnionFind* uf = malloc(sizeof(UnionFind));
    uf->n = n;
    uf->parent = malloc(n * sizeof(int));
    uf->rank = calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) uf->parent[i] = i;
    return uf;
}

int find(UnionFind* uf, int x) {
    if (uf->parent[x] != x)
        uf->parent[x] = find(uf, uf->parent[x]);
    return uf->parent[x];
}

int unionSets(UnionFind* uf, int x, int y) {
    int rx = find(uf, x), ry = find(uf, y);
    if (rx == ry) return 0;
    if (uf->rank[rx] < uf->rank[ry])
        uf->parent[rx] = ry;
    else if (uf->rank[rx] > uf->rank[ry])
        uf->parent[ry] = rx;
    else { uf->parent[ry] = rx; uf->rank[rx]++; }
    return 1;
}

int cmp(const void* a, const void* b) {
    return ((Edge*)a)->weight - ((Edge*)b)->weight;
}

void kruskalMST(int vertices, Edge* edges, int edgeCount) {
    qsort(edges, edgeCount, sizeof(Edge), cmp);
    UnionFind* uf = createUF(vertices);

    printf("MST edges:\\n");
    for (int i = 0; i < edgeCount; i++) {
        if (unionSets(uf, edges[i].src, edges[i].dest))
            printf("%d - %d (weight %d)\\n", edges[i].src, edges[i].dest, edges[i].weight);
    }
}

int main() {
    Edge edges[] = {
        {0,1,4}, {0,2,2}, {1,2,1}, {1,3,5},
        {2,3,8}, {2,4,10}, {3,4,2}
    };
    kruskalMST(5, edges, 7);
    return 0;
}`,

    cpp: `// Kruskal's Algorithm in C++
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Edge {
    int src, dest, weight;
};

class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank[rx] < rank[ry]) parent[rx] = ry;
        else if (rank[rx] > rank[ry]) parent[ry] = rx;
        else { parent[ry] = rx; rank[rx]++; }
        return true;
    }
};

vector<Edge> kruskalMST(int vertices, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(),
        [](const Edge& a, const Edge& b) { return a.weight < b.weight; });

    UnionFind uf(vertices);
    vector<Edge> mst;

    for (auto& e : edges) {
        if (uf.unite(e.src, e.dest))
            mst.push_back(e);
    }
    return mst;
}

int main() {
    vector<Edge> edges = {
        {0, 1, 4}, {0, 2, 2}, {1, 2, 1},
        {1, 3, 5}, {2, 3, 8}, {2, 4, 10}, {3, 4, 2}
    };
    auto mst = kruskalMST(5, edges);
    cout << "MST: ";
    for (auto& e : mst)
        cout << "(" << e.src << "," << e.dest << "," << e.weight << ") ";
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Kruskal's Algorithm Implementation</h3>
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
