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
    javascript: `// Binary Tree Node & Type Checking in JavaScript

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Check if tree is Full (every node has 0 or 2 children)
function isFullTree(root) {
  if (!root) return true;
  if (!root.left && !root.right) return true;
  if (root.left && root.right) {
    return isFullTree(root.left) && isFullTree(root.right);
  }
  return false;
}

// Check if tree is Complete (all levels packed left)
function isCompleteTree(root) {
  if (!root) return true;
  const queue = [root];
  let foundNull = false;
  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) {
      foundNull = true;
    } else {
      if (foundNull) return false;
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  return true;
}

// Check if tree is Degenerate (each node has ≤1 child)
function isDegenerate(root) {
  if (!root) return true;
  while (root) {
    if (root.left && root.right) return false;
    root = root.left || root.right;
  }
  return true;
}`,

    python: `# Binary Tree Node & Type Checking in Python

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

# Check if tree is Full (every node has 0 or 2 children)
def is_full(root):
    if not root:
        return True
    if not root.left and not root.right:
        return True
    if root.left and root.right:
        return is_full(root.left) and is_full(root.right)
    return False

# Check if tree is Complete (all levels packed left)
def is_complete(root):
    if not root:
        return True
    queue = [root]
    found_null = False
    while queue:
        node = queue.pop(0)
        if not node:
            found_null = True
        else:
            if found_null:
                return False
            queue.append(node.left)
            queue.append(node.right)
    return True

# Check if tree is Degenerate
def is_degenerate(root):
    if not root:
        return True
    while root:
        if root.left and root.right:
            return False
        root = root.left or root.right
    return True`,

    java: `// Binary Tree Node & Type Checking in Java
import java.util.LinkedList;
import java.util.Queue;

class TreeNode {
    int value;
    TreeNode left, right;
    TreeNode(int v) { value = v; }
}

public class TreeTypeChecker {
    
    // Check if tree is Full
    public boolean isFullTree(TreeNode root) {
        if (root == null) return true;
        if (root.left == null && root.right == null) return true;
        if (root.left != null && root.right != null) {
            return isFullTree(root.left) && isFullTree(root.right);
        }
        return false;
    }
    
    // Check if tree is Complete
    public boolean isCompleteTree(TreeNode root) {
        if (root == null) return true;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        boolean foundNull = false;
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                foundNull = true;
            } else {
                if (foundNull) return false;
                queue.add(node.left);
                queue.add(node.right);
            }
        }
        return true;
    }
    
    // Check if tree is Degenerate
    public boolean isDegenerate(TreeNode root) {
        if (root == null) return true;
        while (root != null) {
            if (root.left != null && root.right != null) return false;
            root = (root.left != null) ? root.left : root.right;
        }
        return true;
    }
}`,

    c: `// Binary Tree Node & Type Checking in C
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

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

// Check if tree is Full
bool isFullTree(struct Node* root) {
    if (!root) return true;
    if (!root->left && !root->right) return true;
    if (root->left && root->right) {
        return isFullTree(root->left) && isFullTree(root->right);
    }
    return false;
}

// Check if tree is Complete
bool isCompleteTree(struct Node* root) {
    if (!root) return true;
    struct Node* queue[100];
    int front = 0, rear = 0;
    queue[rear++] = root;
    bool foundNull = false;
    while (front < rear) {
        struct Node* node = queue[front++];
        if (!node) {
            foundNull = true;
        } else {
            if (foundNull) return false;
            queue[rear++] = node->left;
            queue[rear++] = node->right;
        }
    }
    return true;
}

// Check if tree is Degenerate
bool isDegenerate(struct Node* root) {
    if (!root) return true;
    while (root) {
        if (root->left && root->right) return false;
        root = root->left ? root->left : root->right;
    }
    return true;
}`,

    cpp: `// Binary Tree Node & Type Checking in C++
#include <iostream>
#include <queue>
using namespace std;

struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : value(v), left(nullptr), right(nullptr) {}
};

// Check if tree is Full
bool isFullTree(TreeNode* root) {
    if (!root) return true;
    if (!root->left && !root->right) return true;
    if (root->left && root->right) {
        return isFullTree(root->left) && isFullTree(root->right);
    }
    return false;
}

// Check if tree is Complete
bool isCompleteTree(TreeNode* root) {
    if (!root) return true;
    queue<TreeNode*> q;
    q.push(root);
    bool foundNull = false;
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (!node) {
            foundNull = true;
        } else {
            if (foundNull) return false;
            q.push(node->left);
            q.push(node->right);
        }
    }
    return true;
}

// Check if tree is Degenerate
bool isDegenerate(TreeNode* root) {
    if (!root) return true;
    while (root) {
        if (root->left && root->right) return false;
        root = root->left ? root->left : root->right;
    }
    return true;
}`,
  };

  return (
    <div className="max-w-4xl mx-auto" ref={topRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <FaCode className="text-blue-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Binary Tree Types Implementation</h3>
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
              key={lang.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedLanguage === lang.id ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
            >
              {lang.name}
            </motion.button>
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
