'use client';
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ResetButton from '@/app/components/ui/resetButton';
import GoButton from '@/app/components/ui/goButton';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const DiameterVisualizer = () => {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Generate a tree to start');
  const [isAnimating, setIsAnimating] = useState(false);
  const [diameterPath, setDiameterPath] = useState([]);
  const [diameterValue, setDiameterValue] = useState(null);
  const [endpoint1, setEndpoint1] = useState(null);
  const [endpoint2, setEndpoint2] = useState(null);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef(null);
  const treeRef = useRef(null);

  useEffect(() => {
    return () => { if (animationRef.current) clearTimeout(animationRef.current); };
  }, []);

  useEffect(() => {
    if (treeRef.current && root) {
      gsap.from(treeRef.current.querySelectorAll('circle'), {
        scale: 0, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)'
      });
    }
  }, [root]);

  const insertNode = (node, value) => {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left = insertNode(node.left, value);
    else if (value > node.value) node.right = insertNode(node.right, value);
    return node;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) { setMessage('Enter a valid number'); return; }
    setRoot(prev => {
      const newRoot = insertNode(prev ? { ...prev } : null, value);
      setMessage(`Inserted ${value}`);
      return newRoot;
    });
    setInputValue('');
    clearResults();
  };

  const generateRandomTree = () => {
    const size = Math.floor(Math.random() * 5) + 5;
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    let newRoot = null;
    values.forEach(val => { newRoot = insertNode(newRoot, val); });
    setRoot(newRoot);
    setMessage(`Generated tree with ${size} nodes`);
    clearResults();
  };

  const clearResults = () => {
    setDiameterPath([]); setDiameterValue(null);
    setEndpoint1(null); setEndpoint2(null); setStep(0);
  };

  const reset = () => {
    if (animationRef.current) clearTimeout(animationRef.current);
    setRoot(null); setInputValue(''); setIsAnimating(false);
    setMessage('Tree is empty'); clearResults();
  };

  const getHeight = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  };

  const getAllNodes = (node, list = []) => {
    if (!node) return list;
    list.push(node); getAllNodes(node.left, list); getAllNodes(node.right, list);
    return list;
  };

  const findPathToNode = (node, targetVal, path = []) => {
    if (!node) return null;
    path = [...path, node.value];
    if (node.value === targetVal) return path;
    return findPathToNode(node.left, targetVal, path) || findPathToNode(node.right, targetVal, path);
  };

  const findDiameter = () => {
    if (!root) { setMessage('Tree is empty!'); return; }
    setIsAnimating(true); clearResults();
    setMessage('Finding diameter...');

    const allNodes = getAllNodes(root);
    let maxDist = 0, bestA = null, bestB = null;

    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i; j < allNodes.length; j++) {
        const p1 = findPathToNode(root, allNodes[i].value);
        const p2 = findPathToNode(root, allNodes[j].value);
        if (!p1 || !p2) continue;
        let k = 0;
        while (k < p1.length && k < p2.length && p1[k] === p2[k]) k++;
        const dist = p1.length + p2.length - 2 * k;
        if (dist > maxDist) { maxDist = dist; bestA = allNodes[i].value; bestB = allNodes[j].value; }
      }
    }

    const fullPath = [...new Set([...(findPathToNode(root, bestA) || []), ...(findPathToNode(root, bestB) || [])])];

    let animStep = 0;
    const animate = () => {
      if (animStep < fullPath.length) {
        setDiameterPath(fullPath.slice(0, animStep + 1));
        setStep(animStep + 1);
        animStep++;
        animationRef.current = setTimeout(animate, 600 / speed);
      } else {
        setEndpoint1(bestA); setEndpoint2(bestB);
        setDiameterValue(maxDist);
        setMessage(`Diameter = ${maxDist} edges (between ${bestA} and ${bestB})`);
        setIsAnimating(false);
      }
    };
    animate();
  };

  const renderTree = (node, x = 400, y = 50, level = 0, nodes = [], edges = []) => {
    if (!node) return { nodes, edges };
    const nr = 25, xOff = Math.max(50, 200 / (level + 1)), yOff = 80;
    const inPath = diameterPath.includes(node.value);
    const isEp = node.value === endpoint1 || node.value === endpoint2;
    let fill = '#3b82f6', stroke = '#1d4ed8';
    if (isEp) { fill = '#ef4444'; stroke = '#dc2626'; }
    else if (inPath) { fill = '#f59e0b'; stroke = '#d97706'; }
    nodes.push({ value: node.value, x, y, fill, stroke });
    if (node.left) {
      edges.push({ x1: x, y1: y + nr, x2: x - xOff, y2: y + yOff - nr });
      renderTree(node.left, x - xOff, y + yOff, level + 1, nodes, edges);
    }
    if (node.right) {
      edges.push({ x1: x, y1: y + nr, x2: x + xOff, y2: y + yOff - nr });
      renderTree(node.right, x + xOff, y + yOff, level + 1, nodes, edges);
    }
    return { nodes, edges };
  };

  const { nodes, edges } = root ? renderTree(root) : { nodes: [], edges: [] };
  const svgW = Math.max(800, nodes.length ? Math.max(...nodes.map(n => n.x)) + 100 : 800);
  const svgH = Math.max(400, nodes.length ? Math.max(...nodes.map(n => n.y)) + 100 : 400);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-neutral-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={generateRandomTree} disabled={isAnimating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors">
          Generate Random Tree
        </button>
        <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)}
          placeholder="Value" onKeyPress={e => e.key === 'Enter' && handleInsert()}
          className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 w-24 text-sm" disabled={isAnimating} />
        <button onClick={handleInsert} disabled={isAnimating}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm transition-colors">
          Insert
        </button>
        <button onClick={findDiameter} disabled={!root || isAnimating}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm transition-colors">
          {isAnimating ? 'Finding...' : 'Find Diameter'}
        </button>
        <button onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors">
          Reset
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
        <input type="range" min="0.5" max="5" step="0.5" value={speed}
          onChange={e => setSpeed(parseFloat(e.target.value))}
          className="flex-1 max-w-xs" disabled={isAnimating} />
        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{speed}x</span>
      </div>

      <div className={`p-3 rounded-lg text-center text-sm mb-4 ${
        diameterValue !== null ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
        isAnimating ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
      }`}>{message}</div>

      <div ref={treeRef} className="flex justify-center overflow-auto py-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
        {nodes.length > 0 ? (
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
            {edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke="#94a3b8" strokeWidth="2" className="dark:stroke-gray-600" />
            ))}
            {nodes.map((n, i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r="22" fill={n.fill} stroke={n.stroke} strokeWidth="2" />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
                  {n.value}
                </text>
              </g>
            ))}
          </svg>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg w-full">
            No tree generated yet
          </div>
        )}
      </div>

      {diameterValue !== null && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center text-sm">
          <span className="font-bold text-green-700 dark:text-green-300">
            Diameter = {diameterValue} edges | Path from {endpoint1} to {endpoint2}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Diameter Path</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Endpoints</span>
      </div>
    </div>
  );
};

export default DiameterVisualizer;
