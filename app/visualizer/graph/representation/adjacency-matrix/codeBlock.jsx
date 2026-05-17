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
    javascript: `// Adjacency Matrix in JavaScript
class Graph {
  constructor(numVertices) {
    this.numVertices = numVertices;
    this.matrix = Array.from({ length: numVertices },
      () => Array(numVertices).fill(0));
  }

  addEdge(u, v) {
    this.matrix[u][v] = 1;
    this.matrix[v][u] = 1; // Undirected
  }

  hasEdge(u, v) {
    return this.matrix[u][v] === 1;
  }

  getNeighbors(u) {
    const neighbors = [];
    for (let v = 0; v < this.numVertices; v++) {
      if (this.matrix[u][v] === 1) neighbors.push(v);
    }
    return neighbors;
  }
}

// Usage
const g = new Graph(4);
g.addEdge(0, 1);
g.addEdge(0, 2);
g.addEdge(1, 3);
console.log(g.hasEdge(0, 1)); // true
console.log(g.getNeighbors(0)); // [1, 2]`,

    python: `# Adjacency Matrix in Python
class Graph:
    def __init__(self, num_vertices):
        self.num_vertices = num_vertices
        self.matrix = [[0] * num_vertices
                       for _ in range(num_vertices)]

    def add_edge(self, u, v):
        self.matrix[u][v] = 1
        self.matrix[v][u] = 1  # Undirected

    def has_edge(self, u, v):
        return self.matrix[u][v] == 1

    def get_neighbors(self, u):
        neighbors = []
        for v in range(self.num_vertices):
            if self.matrix[u][v] == 1:
                neighbors.append(v)
        return neighbors

# Usage
g = Graph(4)
g.add_edge(0, 1)
g.add_edge(0, 2)
g.add_edge(1, 3)
print(g.has_edge(0, 1))  # True
print(g.get_neighbors(0))  # [1, 2]`,

    java: `// Adjacency Matrix in Java
public class Graph {
    private int[][] matrix;
    private int numVertices;

    public Graph(int numVertices) {
        this.numVertices = numVertices;
        this.matrix = new int[numVertices][numVertices];
    }

    public void addEdge(int u, int v) {
        matrix[u][v] = 1;
        matrix[v][u] = 1; // Undirected
    }

    public boolean hasEdge(int u, int v) {
        return matrix[u][v] == 1;
    }

    public int[] getNeighbors(int u) {
        int count = 0;
        for (int v = 0; v < numVertices; v++) {
            if (matrix[u][v] == 1) count++;
        }
        int[] neighbors = new int[count];
        int idx = 0;
        for (int v = 0; v < numVertices; v++) {
            if (matrix[u][v] == 1) neighbors[idx++] = v;
        }
        return neighbors;
    }

    public static void main(String[] args) {
        Graph g = new Graph(4);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        System.out.println(g.hasEdge(0, 1)); // true
    }
}`,

    c: `// Adjacency Matrix in C
#include <stdio.h>
#include <stdbool.h>
#define V 4

int matrix[V][V] = {0};

void addEdge(int u, int v) {
    matrix[u][v] = 1;
    matrix[v][u] = 1; // Undirected
}

bool hasEdge(int u, int v) {
    return matrix[u][v] == 1;
}

void getNeighbors(int u) {
    printf("Neighbors of %d: ", u);
    for (int v = 0; v < V; v++) {
        if (matrix[u][v] == 1) printf("%d ", v);
    }
    printf("\\n");
}

int main() {
    addEdge(0, 1);
    addEdge(0, 2);
    addEdge(1, 3);
    printf("%d\\n", hasEdge(0, 1)); // 1 (true)
    getNeighbors(0); // 1 2
    return 0;
}`,

    cpp: `// Adjacency Matrix in C++
#include <iostream>
#include <vector>
using namespace std;

class Graph {
    int V;
    vector<vector<int>> matrix;

public:
    Graph(int V) : V(V) {
        matrix.assign(V, vector<int>(V, 0));
    }

    void addEdge(int u, int v) {
        matrix[u][v] = 1;
        matrix[v][u] = 1; // Undirected
    }

    bool hasEdge(int u, int v) {
        return matrix[u][v] == 1;
    }

    vector<int> getNeighbors(int u) {
        vector<int> neighbors;
        for (int v = 0; v < V; v++) {
            if (matrix[u][v] == 1) neighbors.push_back(v);
        }
        return neighbors;
    }
};

int main() {
    Graph g(4);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 3);
    cout << g.hasEdge(0, 1) << endl; // 1
    for (int v : g.getNeighbors(0))
        cout << v << " "; // 1 2
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Adjacency Matrix Implementation</h3>
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
