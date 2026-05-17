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
    javascript: `// Adjacency List in JavaScript
class Graph {
  constructor(numVertices) {
    this.numVertices = numVertices;
    this.list = Array.from({ length: numVertices }, () => []);
  }

  addEdge(u, v) {
    this.list[u].push(v);
    this.list[v].push(u); // Undirected
  }

  hasEdge(u, v) {
    return this.list[u].includes(v);
  }

  getNeighbors(u) {
    return [...this.list[u]];
  }
}

// Usage
const g = new Graph(4);
g.addEdge(0, 1);
g.addEdge(0, 2);
g.addEdge(1, 3);
console.log(g.hasEdge(0, 1)); // true
console.log(g.getNeighbors(0)); // [1, 2]`,

    python: `# Adjacency List in Python
class Graph:
    def __init__(self, num_vertices):
        self.num_vertices = num_vertices
        self.list = [[] for _ in range(num_vertices)]

    def add_edge(self, u, v):
        self.list[u].append(v)
        self.list[v].append(u)  # Undirected

    def has_edge(self, u, v):
        return v in self.list[u]

    def get_neighbors(self, u):
        return self.list[u].copy()

# Usage
g = Graph(4)
g.add_edge(0, 1)
g.add_edge(0, 2)
g.add_edge(1, 3)
print(g.has_edge(0, 1))  # True
print(g.get_neighbors(0))  # [1, 2]`,

    java: `// Adjacency List in Java
import java.util.*;

public class Graph {
    private List<List<Integer>> list;
    private int numVertices;

    public Graph(int numVertices) {
        this.numVertices = numVertices;
        this.list = new ArrayList<>();
        for (int i = 0; i < numVertices; i++) {
            this.list.add(new ArrayList<>());
        }
    }

    public void addEdge(int u, int v) {
        list.get(u).add(v);
        list.get(v).add(u); // Undirected
    }

    public boolean hasEdge(int u, int v) {
        return list.get(u).contains(v);
    }

    public List<Integer> getNeighbors(int u) {
        return new ArrayList<>(list.get(u));
    }

    public static void main(String[] args) {
        Graph g = new Graph(4);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        System.out.println(g.hasEdge(0, 1)); // true
        System.out.println(g.getNeighbors(0)); // [1, 2]
    }
}`,

    c: `// Adjacency List in C
#include <stdio.h>
#include <stdlib.h>
#define V 4

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* list[V] = {NULL};

Node* createNode(int v) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = v;
    newNode->next = NULL;
    return newNode;
}

void addEdge(int u, int v) {
    Node* newNode = createNode(v);
    newNode->next = list[u];
    list[u] = newNode;

    newNode = createNode(u);
    newNode->next = list[v];
    list[v] = newNode;
}

int hasEdge(int u, int v) {
    Node* temp = list[u];
    while (temp) {
        if (temp->data == v) return 1;
        temp = temp->next;
    }
    return 0;
}

void getNeighbors(int u) {
    printf("Neighbors of %d: ", u);
    Node* temp = list[u];
    while (temp) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\\n");
}

int main() {
    addEdge(0, 1);
    addEdge(0, 2);
    addEdge(1, 3);
    printf("%d\\n", hasEdge(0, 1)); // 1
    getNeighbors(0); // 1 2
    return 0;
}`,

    cpp: `// Adjacency List in C++
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Graph {
    int V;
    vector<vector<int>> list;

public:
    Graph(int V) : V(V) {
        list.resize(V);
    }

    void addEdge(int u, int v) {
        list[u].push_back(v);
        list[v].push_back(u); // Undirected
    }

    bool hasEdge(int u, int v) {
        return find(list[u].begin(), list[u].end(), v)
               != list[u].end();
    }

    vector<int> getNeighbors(int u) {
        return list[u];
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Adjacency List Implementation</h3>
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
