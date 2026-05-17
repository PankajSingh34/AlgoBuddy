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
    javascript: `// BST Deletion in JavaScript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function minValueNode(root) {
  let curr = root;
  while (curr && curr.left) curr = curr.left;
  return curr;
}

function deleteNode(root, val) {
  if (root === null) return null;

  if (val < root.val) {
    root.left = deleteNode(root.left, val);
  } else if (val > root.val) {
    root.right = deleteNode(root.right, val);
  } else {
    // Case 1: Leaf
    if (root.left === null && root.right === null) {
      return null;
    }
    // Case 2: One child
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;
    // Case 3: Two children
    const successor = minValueNode(root.right);
    root.val = successor.val;
    root.right = deleteNode(root.right, successor.val);
  }
  return root;
}`,

    python: `# BST Deletion in Python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def min_value_node(root):
    curr = root
    while curr and curr.left:
        curr = curr.left
    return curr

def delete_node(root, val):
    if root is None:
        return None

    if val < root.val:
        root.left = delete_node(root.left, val)
    elif val > root.val:
        root.right = delete_node(root.right, val)
    else:
        # Case 1: Leaf
        if root.left is None and root.right is None:
            return None
        # Case 2: One child
        if root.left is None:
            return root.right
        if root.right is None:
            return root.left
        # Case 3: Two children
        successor = min_value_node(root.right)
        root.val = successor.val
        root.right = delete_node(root.right, successor.val)
    return root`,

    java: `// BST Deletion in Java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) {
        this.val = val;
        this.left = this.right = null;
    }
}

public class BSTDeletion {
    private static TreeNode minValueNode(TreeNode root) {
        TreeNode curr = root;
        while (curr != null && curr.left != null) {
            curr = curr.left;
        }
        return curr;
    }

    public static TreeNode deleteNode(TreeNode root, int val) {
        if (root == null) return null;

        if (val < root.val) {
            root.left = deleteNode(root.left, val);
        } else if (val > root.val) {
            root.right = deleteNode(root.right, val);
        } else {
            // Case 1: Leaf
            if (root.left == null && root.right == null) return null;
            // Case 2: One child
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            // Case 3: Two children
            TreeNode successor = minValueNode(root.right);
            root.val = successor.val;
            root.right = deleteNode(root.right, successor.val);
        }
        return root;
    }
}`,

    c: `// BST Deletion in C
#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* createNode(int val) {
    struct TreeNode* node = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    node->val = val;
    node->left = NULL;
    node->right = NULL;
    return node;
}

struct TreeNode* minValueNode(struct TreeNode* root) {
    struct TreeNode* curr = root;
    while (curr && curr->left) curr = curr->left;
    return curr;
}

struct TreeNode* deleteNode(struct TreeNode* root, int val) {
    if (root == NULL) return NULL;

    if (val < root->val) {
        root->left = deleteNode(root->left, val);
    } else if (val > root->val) {
        root->right = deleteNode(root->right, val);
    } else {
        // Case 1: Leaf
        if (root->left == NULL && root->right == NULL) return NULL;
        // Case 2: One child
        if (root->left == NULL) return root->right;
        if (root->right == NULL) return root->left;
        // Case 3: Two children
        struct TreeNode* successor = minValueNode(root->right);
        root->val = successor->val;
        root->right = deleteNode(root->right, successor->val);
    }
    return root;
}`,

    cpp: `// BST Deletion in C++
#include <iostream>
using namespace std;

class TreeNode {
public:
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* minValueNode(TreeNode* root) {
    TreeNode* curr = root;
    while (curr && curr->left) curr = curr->left;
    return curr;
}

TreeNode* deleteNode(TreeNode* root, int val) {
    if (root == nullptr) return nullptr;

    if (val < root->val) {
        root->left = deleteNode(root->left, val);
    } else if (val > root->val) {
        root->right = deleteNode(root->right, val);
    } else {
        // Case 1: Leaf
        if (root->left == nullptr && root->right == nullptr) return nullptr;
        // Case 2: One child
        if (root->left == nullptr) return root->right;
        if (root->right == nullptr) return root->left;
        // Case 3: Two children
        TreeNode* successor = minValueNode(root->right);
        root->val = successor->val;
        root->right = deleteNode(root->right, successor->val);
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
          <div className="flex items-center mb-2 sm:mb-0"><FaCode className="text-blue-500 mr-2 text-lg" /><h3 className="text-lg font-semibold text-gray-800 dark:text-white">BST Deletion Implementation</h3></div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium" aria-label="Copy code"
          >
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
