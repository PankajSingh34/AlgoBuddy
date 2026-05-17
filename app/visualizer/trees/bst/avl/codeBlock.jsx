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
    javascript: `// AVL Tree Insertion in JavaScript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 0;
  }
}

function getHeight(node) {
  return node ? node.height : -1;
}

function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function rotateRight(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  return x;
}

function rotateLeft(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  return y;
}

function insert(root, val) {
  if (root === null) return new TreeNode(val);
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);

  root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
  const bf = getBalance(root);

  if (bf > 1 && val < root.left.val) return rotateRight(root);
  if (bf < -1 && val > root.right.val) return rotateLeft(root);
  if (bf > 1 && val > root.left.val) {
    root.left = rotateLeft(root.left);
    return rotateRight(root);
  }
  if (bf < -1 && val < root.right.val) {
    root.right = rotateRight(root.right);
    return rotateLeft(root);
  }
  return root;
}`,

    python: `# AVL Tree Insertion in Python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 0

def get_height(node):
    return node.height if node else -1

def get_balance(node):
    return get_height(node.left) - get_height(node.right) if node else 0

def rotate_right(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    return x

def rotate_left(x):
    y = x.right
    T2 = y.left
    y.left = x
    x.right = T2
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    return y

def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)

    root.height = 1 + max(get_height(root.left), get_height(root.right))
    bf = get_balance(root)

    if bf > 1 and val < root.left.val:
        return rotate_right(root)
    if bf < -1 and val > root.right.val:
        return rotate_left(root)
    if bf > 1 and val > root.left.val:
        root.left = rotate_left(root.left)
        return rotate_right(root)
    if bf < -1 and val < root.right.val:
        root.right = rotate_right(root.right)
        return rotate_left(root)
    return root`,

    java: `// AVL Tree Insertion in Java
class TreeNode {
    int val, height;
    TreeNode left, right;
    TreeNode(int val) {
        this.val = val;
        this.height = 0;
        this.left = this.right = null;
    }
}

public class AVLTree {
    private int getHeight(TreeNode node) {
        return node == null ? -1 : node.height;
    }

    private int getBalance(TreeNode node) {
        return node == null ? 0 : getHeight(node.left) - getHeight(node.right);
    }

    private TreeNode rotateRight(TreeNode y) {
        TreeNode x = y.left;
        TreeNode T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
        return x;
    }

    private TreeNode rotateLeft(TreeNode x) {
        TreeNode y = x.right;
        TreeNode T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
        y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
        return y;
    }

    public TreeNode insert(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insert(root.left, val);
        else root.right = insert(root.right, val);

        root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
        int bf = getBalance(root);

        if (bf > 1 && val < root.left.val) return rotateRight(root);
        if (bf < -1 && val > root.right.val) return rotateLeft(root);
        if (bf > 1 && val > root.left.val) {
            root.left = rotateLeft(root.left);
            return rotateRight(root);
        }
        if (bf < -1 && val < root.right.val) {
            root.right = rotateRight(root.right);
            return rotateLeft(root);
        }
        return root;
    }
}`,

    c: `// AVL Tree Insertion in C
#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int val, height;
    struct TreeNode* left;
    struct TreeNode* right;
};

int getHeight(struct TreeNode* node) {
    return node ? node->height : -1;
}

int getBalance(struct TreeNode* node) {
    return node ? getHeight(node->left) - getHeight(node->right) : 0;
}

int max(int a, int b) { return a > b ? a : b; }

struct TreeNode* createNode(int val) {
    struct TreeNode* node = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    node->val = val;
    node->height = 0;
    node->left = node->right = NULL;
    return node;
}

struct TreeNode* rotateRight(struct TreeNode* y) {
    struct TreeNode* x = y->left;
    struct TreeNode* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    return x;
}

struct TreeNode* rotateLeft(struct TreeNode* x) {
    struct TreeNode* y = x->right;
    struct TreeNode* T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    return y;
}

struct TreeNode* insert(struct TreeNode* root, int val) {
    if (root == NULL) return createNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);

    root->height = 1 + max(getHeight(root->left), getHeight(root->right));
    int bf = getBalance(root);

    if (bf > 1 && val < root->left->val) return rotateRight(root);
    if (bf < -1 && val > root->right->val) return rotateLeft(root);
    if (bf > 1 && val > root->left->val) {
        root->left = rotateLeft(root->left);
        return rotateRight(root);
    }
    if (bf < -1 && val < root->right->val) {
        root->right = rotateRight(root->right);
        return rotateLeft(root);
    }
    return root;
}`,

    cpp: `// AVL Tree Insertion in C++
#include <iostream>
#include <algorithm>
using namespace std;

class TreeNode {
public:
    int val, height;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), height(0), left(nullptr), right(nullptr) {}
};

int getHeight(TreeNode* node) {
    return node ? node->height : -1;
}

int getBalance(TreeNode* node) {
    return node ? getHeight(node->left) - getHeight(node->right) : 0;
}

TreeNode* rotateRight(TreeNode* y) {
    TreeNode* x = y->left;
    TreeNode* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    return x;
}

TreeNode* rotateLeft(TreeNode* x) {
    TreeNode* y = x->right;
    TreeNode* T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    return y;
}

TreeNode* insert(TreeNode* root, int val) {
    if (root == nullptr) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);

    root->height = 1 + max(getHeight(root->left), getHeight(root->right));
    int bf = getBalance(root);

    if (bf > 1 && val < root->left->val) return rotateRight(root);
    if (bf < -1 && val > root->right->val) return rotateLeft(root);
    if (bf > 1 && val > root->left->val) {
        root->left = rotateLeft(root->left);
        return rotateRight(root);
    }
    if (bf < -1 && val < root->right->val) {
        root->right = rotateRight(root->right);
        return rotateLeft(root);
    }
    return root;
}`
  };

  return (
    <div className="max-w-4xl mx-auto" ref={topRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0"><FaCode className="text-blue-500 mr-2 text-lg" /><h3 className="text-lg font-semibold text-gray-800 dark:text-white">AVL Tree Implementation</h3></div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium" aria-label="Copy code"
          >
            <AnimatePresence mode="wait">
              {copied ? (<motion.span key="check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center text-green-600 dark:text-green-400"><FaCheck className="mr-1" /> Copied</motion.span>) : (<motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center"><FaCopy className="mr-1" /> Copy Code</motion.span>)}
            </AnimatePresence>
          </motion.button>
        </div>
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          {languages.map((lang) => (
            <motion.button key={lang.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedLanguage === lang.id ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >{lang.name}</motion.button>
          ))}
        </div>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={selectedLanguage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="overflow-x-auto p-4 bg-gray-900 text-white"
            >
              <pre className="text-sm leading-relaxed"><code className={`language-${selectedLanguage}`} dangerouslySetInnerHTML={{ __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage) }} /></pre>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-3 right-3 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md">{selectedLanguage.toUpperCase()}</motion.div>}</AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeBlock;
