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
    javascript: `// Lowest Common Ancestor in JavaScript

// Recursive approach
function findLCA(root, n1, n2) {
  if (!root) return null;
  
  if (root.value === n1 || root.value === n2) {
    return root;
  }
  
  const leftLCA = findLCA(root.left, n1, n2);
  const rightLCA = findLCA(root.right, n1, n2);
  
  if (leftLCA && rightLCA) return root;
  
  return leftLCA ? leftLCA : rightLCA;
}

// Parent pointer approach
function findLCAWithParent(n1, n2) {
  const ancestors = new Set();
  
  while (n1) {
    ancestors.add(n1);
    n1 = n1.parent;
  }
  
  while (n2) {
    if (ancestors.has(n2)) {
      return n2;
    }
    n2 = n2.parent;
  }
  
  return null;
}`,

    python: `# Lowest Common Ancestor in Python

# Recursive approach
def find_lca(root, n1, n2):
    if not root:
        return None
    
    if root.value == n1 or root.value == n2:
        return root
    
    left_lca = find_lca(root.left, n1, n2)
    right_lca = find_lca(root.right, n1, n2)
    
    if left_lca and right_lca:
        return root
    
    return left_lca if left_lca else right_lca

# Parent pointer approach
def find_lca_with_parent(n1, n2):
    ancestors = set()
    
    while n1:
        ancestors.add(n1)
        n1 = n1.parent
    
    while n2:
        if n2 in ancestors:
            return n2
        n2 = n2.parent
    
    return None`,

    java: `// Lowest Common Ancestor in Java
import java.util.HashSet;
import java.util.Set;

class TreeNode {
    int value;
    TreeNode left, right, parent;
    TreeNode(int v) { value = v; }
}

public class LCAFinder {
    
    // Recursive approach
    public TreeNode findLCA(TreeNode root, int n1, int n2) {
        if (root == null) return null;
        
        if (root.value == n1 || root.value == n2) {
            return root;
        }
        
        TreeNode leftLCA = findLCA(root.left, n1, n2);
        TreeNode rightLCA = findLCA(root.right, n1, n2);
        
        if (leftLCA != null && rightLCA != null) return root;
        
        return (leftLCA != null) ? leftLCA : rightLCA;
    }
    
    // Parent pointer approach
    public TreeNode findLCAWithParent(TreeNode n1, TreeNode n2) {
        Set<TreeNode> ancestors = new HashSet<>();
        
        while (n1 != null) {
            ancestors.add(n1);
            n1 = n1.parent;
        }
        
        while (n2 != null) {
            if (ancestors.contains(n2)) {
                return n2;
            }
            n2 = n2.parent;
        }
        
        return null;
    }
}`,

    c: `// Lowest Common Ancestor in C
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node* left;
    struct Node* right;
    struct Node* parent;
};

struct Node* createNode(int value) {
    struct Node* node = malloc(sizeof(struct Node));
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    node->parent = NULL;
    return node;
}

// Recursive approach
struct Node* findLCA(struct Node* root, int n1, int n2) {
    if (root == NULL) return NULL;
    
    if (root->value == n1 || root->value == n2) {
        return root;
    }
    
    struct Node* leftLCA = findLCA(root->left, n1, n2);
    struct Node* rightLCA = findLCA(root->right, n1, n2);
    
    if (leftLCA && rightLCA) return root;
    
    return leftLCA ? leftLCA : rightLCA;
}`,

    cpp: `// Lowest Common Ancestor in C++
#include <iostream>
#include <unordered_set>
using namespace std;

struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;
    TreeNode* parent;
    TreeNode(int v) : value(v), left(nullptr), right(nullptr), parent(nullptr) {}
};

// Recursive approach
TreeNode* findLCA(TreeNode* root, int n1, int n2) {
    if (!root) return nullptr;
    
    if (root->value == n1 || root->value == n2) {
        return root;
    }
    
    TreeNode* leftLCA = findLCA(root->left, n1, n2);
    TreeNode* rightLCA = findLCA(root->right, n1, n2);
    
    if (leftLCA && rightLCA) return root;
    
    return leftLCA ? leftLCA : rightLCA;
}

// Parent pointer approach
TreeNode* findLCAWithParent(TreeNode* n1, TreeNode* n2) {
    unordered_set<TreeNode*> ancestors;
    
    while (n1) {
        ancestors.insert(n1);
        n1 = n1->parent;
    }
    
    while (n2) {
        if (ancestors.count(n2)) {
            return n2;
        }
        n2 = n2->parent;
    }
    
    return nullptr;
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Lowest Common Ancestor Implementation</h3>
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
