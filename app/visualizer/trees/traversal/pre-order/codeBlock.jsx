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
    javascript: `// Pre-Order Traversal in JavaScript

// Recursive approach
function preOrderRecursive(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    result.push(node.value);
    traverse(node.left);
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// Iterative approach (using stack)
function preOrderIterative(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];
  
  while (stack.length > 0) {
    const current = stack.pop();
    result.push(current.value);
    if (current.right) stack.push(current.right);
    if (current.left) stack.push(current.left);
  }
  
  return result;
}`,

    python: `# Pre-Order Traversal in Python

# Recursive approach
def pre_order_recursive(root):
    result = []
    
    def traverse(node):
        if not node:
            return
        result.append(node.value)
        traverse(node.left)
        traverse(node.right)
    
    traverse(root)
    return result

# Iterative approach (using stack)
def pre_order_iterative(root):
    if not root:
        return []
    result = []
    stack = [root]
    
    while stack:
        current = stack.pop()
        result.append(current.value)
        if current.right:
            stack.append(current.right)
        if current.left:
            stack.append(current.left)
    
    return result`,

    java: `// Pre-Order Traversal in Java
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

class TreeNode {
    int value;
    TreeNode left, right;
    TreeNode(int v) { value = v; }
}

public class PreOrderTraversal {
    
    // Recursive approach
    public List<Integer> preOrderRecursive(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        traverse(root, result);
        return result;
    }
    
    private void traverse(TreeNode node, List<Integer> result) {
        if (node == null) return;
        result.add(node.value);
        traverse(node.left, result);
        traverse(node.right, result);
    }
    
    // Iterative approach (using stack)
    public List<Integer> preOrderIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        
        while (!stack.isEmpty()) {
            TreeNode current = stack.pop();
            result.add(current.value);
            if (current.right != null) stack.push(current.right);
            if (current.left != null) stack.push(current.left);
        }
        
        return result;
    }
}`,

    c: `// Pre-Order Traversal in C
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

// Recursive approach
void preOrderRecursive(struct Node* root) {
    if (root == NULL) return;
    printf("%d ", root->value);
    preOrderRecursive(root->left);
    preOrderRecursive(root->right);
}

// Stack-based iterative approach
#define MAX 100
void preOrderIterative(struct Node* root) {
    if (root == NULL) return;
    struct Node* stack[MAX];
    int top = 0;
    stack[top] = root;
    
    while (top >= 0) {
        struct Node* current = stack[top--];
        printf("%d ", current->value);
        if (current->right) stack[++top] = current->right;
        if (current->left) stack[++top] = current->left;
    }
}`,

    cpp: `// Pre-Order Traversal in C++
#include <iostream>
#include <stack>
#include <vector>
using namespace std;

struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : value(v), left(nullptr), right(nullptr) {}
};

// Recursive approach
void preOrderRecursive(TreeNode* root, vector<int>& result) {
    if (!root) return;
    result.push_back(root->value);
    preOrderRecursive(root->left, result);
    preOrderRecursive(root->right, result);
}

// Iterative approach (using stack)
vector<int> preOrderIterative(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    stack<TreeNode*> st;
    st.push(root);
    
    while (!st.empty()) {
        TreeNode* current = st.top();
        st.pop();
        result.push_back(current->value);
        if (current->right) st.push(current->right);
        if (current->left) st.push(current->left);
    }
    
    return result;
}`,
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Pre-Order Traversal Implementation</h3>
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
