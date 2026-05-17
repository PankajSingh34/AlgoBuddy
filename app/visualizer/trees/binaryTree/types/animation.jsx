"use client";
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const TREE_TYPES = {
  FULL: 'full',
  DEGENERATE: 'degenerate',
  COMPLETE: 'complete',
};

const treeData = {
  [TREE_TYPES.FULL]: {
    title: 'Full Binary Tree',
    rule: 'Every node has 0 or 2 children',
    nodes: [
      { value: 'A', x: 120, y: 40 },
      { value: 'B', x: 60, y: 110 },
      { value: 'C', x: 180, y: 110 },
      { value: 'D', x: 30, y: 180 },
      { value: 'E', x: 90, y: 180 },
      { value: 'F', x: 150, y: 180 },
      { value: 'G', x: 210, y: 180 },
    ],
    edges: [
      [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6],
    ],
    highlight: [],
    description: 'Every internal node has exactly two children. All leaves are at the same or adjacent levels.',
  },
  [TREE_TYPES.DEGENERATE]: {
    title: 'Degenerate (Skewed) Tree',
    rule: 'Each parent has only one child',
    nodes: [
      { value: '1', x: 60, y: 40 },
      { value: '2', x: 60, y: 110 },
      { value: '3', x: 60, y: 180 },
      { value: '4', x: 60, y: 250 },
    ],
    edges: [
      [0, 1], [1, 2], [2, 3],
    ],
    highlight: [],
    description: 'A degenerate tree is effectively a linked list with height O(n), the worst case for BST operations.',
  },
  [TREE_TYPES.COMPLETE]: {
    title: 'Complete Binary Tree',
    rule: 'All levels filled except possibly last, packed left',
    nodes: [
      { value: '1', x: 120, y: 40 },
      { value: '2', x: 60, y: 110 },
      { value: '3', x: 180, y: 110 },
      { value: '4', x: 30, y: 180 },
      { value: '5', x: 90, y: 180 },
      { value: '6', x: 150, y: 180 },
    ],
    edges: [
      [0, 1], [0, 2], [1, 3], [1, 4], [2, 5],
    ],
    highlight: [],
    description: 'All levels except possibly the last are completely filled. The last level is filled from left to right — used in heap data structures.',
  },
};

const TreeSVG = ({ type, highlightNode }) => {
  const svgRef = useRef(null);
  const data = treeData[type];

  useEffect(() => {
    const svg = svgRef.current;
    svg.innerHTML = '';

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    data.edges.forEach(([from, to]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', data.nodes[from].x);
      line.setAttribute('y1', data.nodes[from].y);
      line.setAttribute('x2', data.nodes[to].x);
      line.setAttribute('y2', data.nodes[to].y);
      line.setAttribute('stroke', '#6b7280');
      line.setAttribute('stroke-width', '2.5');
      g.appendChild(line);
    });

    data.nodes.forEach((node, i) => {
      const isHighlighted = highlightNode === i;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', '22');
      circle.setAttribute('fill', isHighlighted ? '#f59e0b' : '#3b82f6');
      circle.setAttribute('stroke', isHighlighted ? '#d97706' : '#1d4ed8');
      circle.setAttribute('stroke-width', '2.5');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', '600');
      text.textContent = node.value;

      g.appendChild(circle);
      g.appendChild(text);

      gsap.from(circle, { scale: 0, duration: 0.5, delay: i * 0.1, ease: 'back.out(1.7)' });
      gsap.from(text, { opacity: 0, duration: 0.3, delay: i * 0.1 + 0.2 });
    });

    svg.appendChild(g);
  }, [type, highlightNode, data]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 300"
      className="w-full max-w-[280px] h-[280px] mx-auto"
    ></svg>
  );
};

const TypesAnimation = () => {
  const [selectedType, setSelectedType] = useState(TREE_TYPES.FULL);
  const [highlightNode, setHighlightNode] = useState(null);

  const handleNodeClick = (nodeIndex) => {
    setHighlightNode(prev => prev === nodeIndex ? null : nodeIndex);
  };

  const data = treeData[selectedType];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 py-16">
      <main className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            <span className="text-blue-600 dark:text-blue-600">Binary Tree Types</span> Visualizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore Full, Degenerate, and Complete Binary Trees interactively
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {Object.values(TREE_TYPES).map((type) => (
              <button
                key={type}
                onClick={() => { setSelectedType(type); setHighlightNode(null); }}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  selectedType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {treeData[type].title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <TreeSVG type={selectedType} highlightNode={highlightNode} />
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {data.nodes.map((node, i) => (
                  <button
                    key={i}
                    onClick={() => handleNodeClick(i)}
                    className={`w-8 h-8 rounded-full text-xs font-bold text-white transition-all ${
                      highlightNode === i ? 'bg-amber-500 ring-2 ring-amber-300 scale-110' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {node.value}
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Click a node to highlight it</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{data.title}</h3>
              <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                {data.rule}
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{data.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Type Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-3 text-left border-b">Property</th>
                  <th className="p-3 text-left border-b">Full</th>
                  <th className="p-3 text-left border-b">Degenerate</th>
                  <th className="p-3 text-left border-b">Complete</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Children per node', '0 or 2', '1', '0, 1, or 2'],
                  ['Height (n nodes)', 'Θ(log n)', 'Θ(n)', 'Θ(log n)'],
                  ['Leaf level', 'Same/adjacent', 'Single path', 'Last level left-packed'],
                  ['Used in', 'Expression trees', 'Worst-case BST', 'Heap / Priority Queue'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-3 font-medium">{row[0]}</td>
                    <td className="p-3">{row[1]}</td>
                    <td className="p-3">{row[2]}</td>
                    <td className="p-3">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TypesAnimation;
