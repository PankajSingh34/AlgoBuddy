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
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const topRef = useRef(null);

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "c", name: "C" },
    { id: "cpp", name: "C++" },
  ];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const codeExamples = {
    javascript: `// Tree Diameter in JavaScript

// DP approach (single pass)
let diameter = 0;

function treeDiameter(root) {
  diameter = 0;
  height(root);
  return diameter;
}

function height(node) {
  if (!node) return 0;
  
  const leftHeight = height(node.left);
  const rightHeight = height(node.right);
  
  diameter = Math.max(diameter, leftHeight + rightHeight);
  
  return 1 + Math.max(leftHeight, rightHeight);
}

// Two-pass DFS approach
function treeDiameterTwoPass(root) {
  if (!root) return 0;
  const adj = buildAdjacencyList(root);
  const [farthestNode] = bfs(adj, root.value);
  const [_, dist] = bfs(adj, farthestNode);
  return dist;
}

function bfs(adj, start) {
  const visited = new Set();
  const queue = [{ node: start, dist: 0 }];
  visited.add(start);
  let farthestNode = start;
  let maxDist = 0;
  
  while (queue.length > 0) {
    const { node, dist } = queue.shift();
    if (dist > maxDist) {
      maxDist = dist;
      farthestNode = node;
    }
    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ node: neighbor, dist: dist + 1 });
      }
    }
  }
  
  return [farthestNode, maxDist];
}`,

    python: `# Tree Diameter in Python

# DP approach (single pass)
def tree_diameter(root):
    diameter = 0
    
    def height(node):
        nonlocal diameter
        if not node:
            return 0
        
        left_height = height(node.left)
        right_height = height(node.right)
        
        diameter = max(diameter, left_height + right_height)
        
        return 1 + max(left_height, right_height)
    
    height(root)
    return diameter

# Two-pass DFS approach
def tree_diameter_two_pass(root):
    if not root:
        return 0
    adj = build_adjacency_list(root)
    farthest_node, _ = bfs(adj, root.value)
    _, dist = bfs(adj, farthest_node)
    return dist

def bfs(adj, start):
    visited = {start}
    queue = [(start, 0)]
    farthest_node = start
    max_dist = 0
    
    while queue:
        node, dist = queue.pop(0)
        if dist > max_dist:
            max_dist = dist
            farthest_node = node
        for neighbor in adj.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return farthest_node, max_dist`,

    java: `// Tree Diameter in Java
import java.util.*;

class TreeNode {
    int value;
    TreeNode left, right;
    TreeNode(int v) { value = v; }
}

public class TreeDiameter {
    private int diameter = 0;
    
    // DP approach (single pass)
    public int treeDiameter(TreeNode root) {
        diameter = 0;
        height(root);
        return diameter;
    }
    
    private int height(TreeNode node) {
        if (node == null) return 0;
        
        int leftHeight = height(node.left);
        int rightHeight = height(node.right);
        
        diameter = Math.max(diameter, leftHeight + rightHeight);
        
        return 1 + Math.max(leftHeight, rightHeight);
    }
    
    // Two-pass BFS approach
    public int treeDiameterTwoPass(TreeNode root) {
        if (root == null) return 0;
        Map<Integer, List<Integer>> adj = buildAdjacencyList(root);
        int farthestNode = bfs(adj, root.value)[0];
        return bfs(adj, farthestNode)[1];
    }
    
    private int[] bfs(Map<Integer, List<Integer>> adj, int start) {
        Set<Integer> visited = new HashSet<>();
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start, 0});
        visited.add(start);
        int farthestNode = start;
        int maxDist = 0;
        
        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int node = current[0], dist = current[1];
            if (dist > maxDist) {
                maxDist = dist;
                farthestNode = node;
            }
            for (int neighbor : adj.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(new int[]{neighbor, dist + 1});
                }
            }
        }
        
        return new int[]{farthestNode, maxDist};
    }
}`,

    c: `// Tree Diameter in C
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node* left;
    struct Node* right;
};

struct Node* createNode(int value) {
    struct Node* node = malloc(sizeof(struct Node));
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

int diameter = 0;

int height(struct Node* node) {
    if (node == NULL) return 0;
    
    int leftHeight = height(node->left);
    int rightHeight = height(node->right);
    
    if (leftHeight + rightHeight > diameter) {
        diameter = leftHeight + rightHeight;
    }
    
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}

int treeDiameter(struct Node* root) {
    diameter = 0;
    height(root);
    return diameter;
}`,

    cpp: `// Tree Diameter in C++
#include <iostream>
#include <algorithm>
#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>
using namespace std;

struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : value(v), left(nullptr), right(nullptr) {}
};

class TreeDiameter {
private:
    int diameter;
    
    int height(TreeNode* node) {
        if (!node) return 0;
        
        int leftHeight = height(node->left);
        int rightHeight = height(node->right);
        
        diameter = max(diameter, leftHeight + rightHeight);
        
        return 1 + max(leftHeight, rightHeight);
    }
    
public:
    // DP approach (single pass)
    int treeDiameter(TreeNode* root) {
        diameter = 0;
        height(root);
        return diameter;
    }
    
    // Two-pass BFS approach
    int treeDiameterTwoPass(TreeNode* root) {
        if (!root) return 0;
        auto adj = buildAdjacencyList(root);
        int farthestNode = bfs(adj, root->value).first;
        return bfs(adj, farthestNode).second;
    }
    
    pair<int, int> bfs(unordered_map<int, vector<int>>& adj, int start) {
        unordered_set<int> visited;
        queue<pair<int, int>> q;
        q.push({start, 0});
        visited.insert(start);
        int farthestNode = start, maxDist = 0;
        
        while (!q.empty()) {
            auto [node, dist] = q.front(); q.pop();
            if (dist > maxDist) {
                maxDist = dist;
                farthestNode = node;
            }
            for (int neighbor : adj[node]) {
                if (!visited.count(neighbor)) {
                    visited.insert(neighbor);
                    q.push({neighbor, dist + 1});
                }
            }
        }
        
        return {farthestNode, maxDist};
    }
};`,
  };

  return (
    <div className="max-w-4xl mx-auto" ref={topRef}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <FaCode className="text-blue-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tree Diameter Implementation</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium"
            aria-label="Copy code"
          >
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
            <motion.button
              key={lang.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedLanguage === lang.id
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >{lang.name}</motion.button>
          ))}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLanguage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-x-auto p-4 bg-gray-900 text-white"
            >
              <pre className="text-sm leading-relaxed">
                <code className={`language-${selectedLanguage}`}
                  dangerouslySetInnerHTML={{ __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage) }} />
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
