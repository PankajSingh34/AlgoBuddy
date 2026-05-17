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
    javascript: `// Binary Tree Properties in JavaScript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Maximum nodes at a given level
function maxNodesAtLevel(level) {
  return Math.pow(2, level);
}

// Maximum total nodes for height h
function maxTotalNodes(height) {
  return Math.pow(2, height + 1) - 1;
}

// Check if a node is a leaf
function isLeaf(node) {
  return node.left === null && node.right === null;
}

// Calculate height of tree
function height(node) {
  if (node === null) return -1;
  return 1 + Math.max(height(node.left), height(node.right));
}

// Calculate depth of a node
function depth(root, target, d = 0) {
  if (root === null) return -1;
  if (root === target) return d;
  let left = depth(root.left, target, d + 1);
  if (left !== -1) return left;
  return depth(root.right, target, d + 1);
}`,

    python: `# Binary Tree Properties in Python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

# Maximum nodes at a given level
def max_nodes_at_level(level):
    return 2 ** level

# Maximum total nodes for height h
def max_total_nodes(height):
    return 2 ** (height + 1) - 1

# Check if a node is a leaf
def is_leaf(node):
    return node.left is None and node.right is None

# Calculate height of tree
def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))

# Calculate depth of a node
def depth(root, target, d=0):
    if root is None:
        return -1
    if root is target:
        return d
    left = depth(root.left, target, d + 1)
    if left != -1:
        return left
    return depth(root.right, target, d + 1)`,

    java: `// Binary Tree Properties in Java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) {
        this.val = val;
        this.left = this.right = null;
    }
}

public class BinaryTreeProperties {
    // Maximum nodes at a given level
    static int maxNodesAtLevel(int level) {
        return (int) Math.pow(2, level);
    }

    // Maximum total nodes for height h
    static int maxTotalNodes(int height) {
        return (int) Math.pow(2, height + 1) - 1;
    }

    // Check if a node is a leaf
    static boolean isLeaf(TreeNode node) {
        return node.left == null && node.right == null;
    }

    // Calculate height of tree
    static int height(TreeNode node) {
        if (node == null) return -1;
        return 1 + Math.max(height(node.left), height(node.right));
    }

    // Calculate depth of a node
    static int depth(TreeNode root, TreeNode target, int d) {
        if (root == null) return -1;
        if (root == target) return d;
        int left = depth(root.left, target, d + 1);
        if (left != -1) return left;
        return depth(root.right, target, d + 1);
    }
}`,

    c: `// Binary Tree Properties in C
#include <stdio.h>
#include <math.h>

struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
};

// Maximum nodes at a given level
int maxNodesAtLevel(int level) {
    return (int) pow(2, level);
}

// Maximum total nodes for height h
int maxTotalNodes(int height) {
    return (int) pow(2, height + 1) - 1;
}

// Check if a node is a leaf
int isLeaf(struct TreeNode* node) {
    return node->left == NULL && node->right == NULL;
}

// Calculate height of tree
int height(struct TreeNode* node) {
    if (node == NULL) return -1;
    int leftH = height(node->left);
    int rightH = height(node->right);
    return 1 + (leftH > rightH ? leftH : rightH);
}

// Calculate depth of a node
int depth(struct TreeNode* root, struct TreeNode* target, int d) {
    if (root == NULL) return -1;
    if (root == target) return d;
    int left = depth(root->left, target, d + 1);
    if (left != -1) return left;
    return depth(root->right, target, d + 1);
}`,

    cpp: `// Binary Tree Properties in C++
#include <iostream>
#include <cmath>
using namespace std;

class TreeNode {
public:
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

// Maximum nodes at a given level
int maxNodesAtLevel(int level) {
    return pow(2, level);
}

// Maximum total nodes for height h
int maxTotalNodes(int height) {
    return pow(2, height + 1) - 1;
}

// Check if a node is a leaf
bool isLeaf(TreeNode* node) {
    return node->left == nullptr && node->right == nullptr;
}

// Calculate height of tree
int height(TreeNode* node) {
    if (node == nullptr) return -1;
    return 1 + max(height(node->left), height(node->right));
}

// Calculate depth of a node
int depth(TreeNode* root, TreeNode* target, int d = 0) {
    if (root == nullptr) return -1;
    if (root == target) return d;
    int left = depth(root->left, target, d + 1);
    if (left != -1) return left;
    return depth(root->right, target, d + 1);
}`
  };

  return (
    <div
      className="max-w-4xl mx-auto"
      ref={topRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <FaCode className="text-blue-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Binary Tree Properties Implementation
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium"
            aria-label="Copy code"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center text-green-600 dark:text-green-400"
                >
                  <FaCheck className="mr-1" /> Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <FaCopy className="mr-1" /> Copy Code
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Language Selector */}
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          {languages.map((lang) => (
            <motion.button
              key={lang.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedLanguage === lang.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {lang.name}
            </motion.button>
          ))}
        </div>

        {/* Code Block */}
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
                <code
                  className={`language-${selectedLanguage}`}
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage)
                  }}
                />
              </pre>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-3 right-3 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
              >
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
