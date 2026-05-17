'use client';
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ResetButton from '@/app/components/ui/resetButton';
import GoButton from '@/app/components/ui/goButton';

class TreeNode {
  constructor(value) { this.value = value; this.left = null; this.right = null; }
}

const LcaVisualizer = () => {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Generate a tree to start');
  const [isAnimating, setIsAnimating] = useState(false);
  const [path1Nodes, setPath1Nodes] = useState([]);
  const [path2Nodes, setPath2Nodes] = useState([]);
  const [lcaResult, setLcaResult] = useState(null);
  const [step, setStep] = useState(0);
  const [node1, setNode1] = useState('');
  const [node2, setNode2] = useState('');
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef(null);
  const treeRef = useRef(null);

  useEffect(() => { return () => { if (animationRef.current) clearTimeout(animationRef.current); }; }, []);
  useEffect(() => { if (treeRef.current && root) { gsap.from(treeRef.current.querySelectorAll('circle'), { scale: 0, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)' }); } }, [root]);

  const insertNode = (node, value) => {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left = insertNode(node.left, value);
    else if (value > node.value) node.right = insertNode(node.right, value);
    return node;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) { setMessage('Enter a valid number'); return; }
    setRoot(prev => { const newRoot = insertNode(prev ? { ...prev } : null, value); setMessage(`Inserted ${value}`); return newRoot; });
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

  const clearResults = () => { setPath1Nodes([]); setPath2Nodes([]); setLcaResult(null); setStep(0); };

  const reset = () => {
    if (animationRef.current) clearTimeout(animationRef.current);
    setRoot(null); setInputValue(''); setIsAnimating(false);
    setMessage('Tree is empty'); clearResults(); setNode1(''); setNode2('');
  };

  const findNode = (node, value) => {
    if (!node) return null;
    if (node.value === value) return node;
    return findNode(node.left, value) || findNode(node.right, value);
  };

  const findPath = (node, value, path = []) => {
    if (!node) return null;
    path = [...path, node.value];
    if (node.value === value) return path;
    return findPath(node.left, value, path) || findPath(node.right, value, path);
  };

  const visualizeLCA = () => {
    const v1 = parseInt(node1); const v2 = parseInt(node2);
    if (!root || isNaN(v1) || isNaN(v2)) { setMessage('Enter two valid node values'); return; }
    if (!findNode(root, v1) || !findNode(root, v2)) { setMessage('Both nodes must exist in the tree'); return; }
    setIsAnimating(true); clearResults();
    setMessage(`Finding LCA of ${v1} and ${v2}...`);

    const path1 = findPath(root, v1);
    const path2 = findPath(root, v2);
    if (!path1 || !path2) { setMessage('Could not find paths'); setIsAnimating(false); return; }

    let lca = null;
    for (let i = 0; i < Math.min(path1.length, path2.length); i++) {
      if (path1[i] === path2[i]) lca = path1[i]; else break;
    }

    let animStep = 0;
    const animatePath1 = () => {
      if (animStep < path1.length) {
        setPath1Nodes(path1.slice(0, animStep + 1));
        setStep(animStep + 1);
        animStep++;
        animationRef.current = setTimeout(animatePath1, 500 / speed);
      } else {
        animStep = 0;
        const animatePath2 = () => {
          if (animStep < path2.length) {
            setPath2Nodes(path2.slice(0, animStep + 1));
            setStep(path1.length + animStep + 1);
            animStep++;
            animationRef.current = setTimeout(animatePath2, 500 / speed);
          } else {
            setLcaResult(lca);
            setMessage(`LCA of ${v1} and ${v2} = ${lca}`);
            setIsAnimating(false);
          }
        };
        animatePath2();
      }
    };
    animatePath1();
  };

  const renderTree = (node, x = 400, y = 50, level = 0, nodes = [], edges = []) => {
    if (!node) return { nodes, edges };
    const nr = 25, xOff = Math.max(50, 200 / (level + 1)), yOff = 80;
    const isP1 = path1Nodes.includes(node.value);
    const isP2 = path2Nodes.includes(node.value);
    const isLca = lcaResult === node.value;
    let fill = '#3b82f6', stroke = '#1d4ed8';
    if (isLca) { fill = '#ef4444'; stroke = '#dc2626'; }
    else if (isP1 && isP2) { fill = '#f59e0b'; stroke = '#d97706'; }
    else if (isP1) { fill = '#22c55e'; stroke = '#16a34a'; }
    else if (isP2) { fill = '#a855f7'; stroke = '#9333ea'; }
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
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm transition-colors">Insert</button>
        <button onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors">Reset</button>
      </div>

      <div className="flex flex-wrap gap-3 items-end mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 min-w-[100px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Node 1</label>
          <input type="number" value={node1} onChange={e => setNode1(e.target.value)}
            placeholder="First node" className="w-full p-2 border rounded-lg dark:bg-gray-700 text-sm" disabled={isAnimating} />
        </div>
        <div className="flex-1 min-w-[100px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Node 2</label>
          <input type="number" value={node2} onChange={e => setNode2(e.target.value)}
            placeholder="Second node" className="w-full p-2 border rounded-lg dark:bg-gray-700 text-sm" disabled={isAnimating} />
        </div>
        <button onClick={visualizeLCA} disabled={!root || isAnimating}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 text-sm transition-colors">
          {isAnimating ? 'Finding...' : 'Find LCA'}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
        <input type="range" min="0.5" max="5" step="0.5" value={speed}
          onChange={e => setSpeed(parseFloat(e.target.value))} className="flex-1 max-w-xs" disabled={isAnimating} />
        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{speed}x</span>
      </div>

      <div className={`p-3 rounded-lg text-center text-sm mb-4 ${
        lcaResult ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
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
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">{n.value}</text>
              </g>
            ))}
          </svg>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg w-full">No tree generated yet</div>
        )}
      </div>

      {lcaResult && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center text-sm">
          <span className="font-bold text-green-700 dark:text-green-300">LCA({node1}, {node2}) = {lcaResult}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Path to Node 1</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span> Path to Node 2</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Common</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> LCA</span>
      </div>
    </div>
  );
};

export default LcaVisualizer;
