'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  generateInsertSteps,
  generateExtractSteps,
  generateHeapifySteps,
  computeTreeLayout,
} from './heapVisualizerLogic';

const DEFAULT_ARRAY = [50, 30, 40, 10, 20, 35, 15];

export default function HeapVisualizerClient() {
  const [heapType, setHeapType] = useState('min');
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [inputValue, setInputValue] = useState('');
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const timerRef = useRef(null);

  const currentStep = steps[stepIndex] || { array, comparing: [], swapping: [], action: 'Ready.' };

  useEffect(() => {
    if (isPlaying && stepIndex < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIndex((s) => s + 1), speed);
    } else if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, stepIndex, steps, speed]);

  const runSteps = useCallback((newSteps) => {
    setSteps(newSteps);
    setStepIndex(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (steps.length > 0 && stepIndex === steps.length - 1) {
      setArray(steps[steps.length - 1].array);
    }
  }, [stepIndex, steps]);

  const handleInsert = () => {
    const value = parseInt(inputValue, 10);
    if (Number.isNaN(value)) return;
    const currentArray = currentStep.array;
    const newSteps = generateInsertSteps(currentArray, value, heapType);
    runSteps(newSteps);
    setInputValue('');
  };

  const handleExtract = () => {
    const currentArray = currentStep.array;
    if (currentArray.length === 0) return;
    const newSteps = generateExtractSteps(currentArray, heapType);
    runSteps(newSteps);
  };

  const handleRandomArray = () => {
    const n = 7 + Math.floor(Math.random() * 4);
    const randomArr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
    const newSteps = generateHeapifySteps(randomArr, heapType);
    runSteps(newSteps);
  };

  const handleReset = () => {
    setSteps([]);
    setStepIndex(0);
    setIsPlaying(false);
    setArray(DEFAULT_ARRAY);
  };

  const handleHeapTypeChange = (type) => {
    setHeapType(type);
    const newSteps = generateHeapifySteps(currentStep.array, type);
    runSteps(newSteps);
  };

  const stepForward = () => {
    setIsPlaying(false);
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  };

  const stepBack = () => {
    setIsPlaying(false);
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  const displayArray = currentStep.array;
  const layout = computeTreeLayout(displayArray);
  const maxLevel = layout.length > 0 ? Math.max(...layout.map((p) => p.y)) : 0;
  const svgHeight = (maxLevel + 1) * 90 + 40;
  const svgWidth = 700;

  const nodeColor = (i) => {
    if (currentStep.swapping?.includes(i)) return '#f97316';
    if (currentStep.comparing?.includes(i)) return '#facc15';
    return heapType === 'min' ? '#6366f1' : '#a855f7';
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Heap Visualizer</h1>
        <p className="text-sm text-gray-500">
          Insert, extract, and heapify with step-by-step Min-Heap / Max-Heap animation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase text-gray-500">Heap Type</h3>
          <div className="flex gap-2">
            <button onClick={() => handleHeapTypeChange('min')} className={`flex-1 py-2 rounded-lg font-medium ${heapType === 'min' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
              Min-Heap
            </button>
            <button onClick={() => handleHeapTypeChange('max')} className={`flex-1 py-2 rounded-lg font-medium ${heapType === 'max' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
              Max-Heap
            </button>
          </div>
        </div>

        <div className="border rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase text-gray-500">Insert / Extract</h3>
          <div className="flex gap-2">
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Value" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <button onClick={handleInsert} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium">
              Insert
            </button>
          </div>
          <button onClick={handleExtract} className="w-full py-2 rounded-lg bg-rose-600 text-white text-sm font-medium">
            Extract {heapType === 'min' ? 'Min' : 'Max'} (Root)
          </button>
        </div>

        <div className="border rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase text-gray-500">Dataset</h3>
          <button onClick={handleRandomArray} className="w-full py-2 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium">
            Generate Random Array
          </button>
          <button onClick={handleReset} className="w-full py-2 rounded-lg bg-gray-100 text-sm font-medium">
            Reset
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap border rounded-xl p-4">
        <button onClick={stepBack} disabled={stepIndex === 0} className="px-3 py-2 rounded-lg bg-gray-100 disabled:opacity-40">
          Step Back
        </button>
        <button onClick={() => setIsPlaying((p) => !p)} disabled={steps.length === 0} className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-40">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={stepForward} disabled={stepIndex >= steps.length - 1} className="px-3 py-2 rounded-lg bg-gray-100 disabled:opacity-40">
          Step Forward
        </button>

        <div className="flex items-center gap-2 ml-auto text-sm">
          <span>Speed</span>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </div>

        <span className="text-xs text-gray-500 w-full md:w-auto">
          Step {steps.length === 0 ? 0 : stepIndex + 1} / {steps.length}
        </span>
      </div>

      <div className="text-center text-sm font-medium bg-gray-50 border rounded-lg py-2">
        {currentStep.action}
      </div>

      <div className="border rounded-xl p-4 overflow-x-auto">
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Tree View</h3>
        <svg width={svgWidth} height={svgHeight}>
          {layout.map((p) =>
            p.parent !== null ? (
              <line key={`edge-${p.index}`} x1={layout[p.parent].x * svgWidth} y1={layout[p.parent].y * 90 + 30} x2={p.x * svgWidth} y2={p.y * 90 + 30} stroke="#cbd5e1" strokeWidth="2" />
            ) : null
          )}
          {layout.map((p) => (
            <g key={`node-${p.index}`}>
              <circle cx={p.x * svgWidth} cy={p.y * 90 + 30} r="22" fill={nodeColor(p.index)} style={{ transition: 'all 0.3s ease' }} />
              <text x={p.x * svgWidth} y={p.y * 90 + 35} textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
                {displayArray[p.index]}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="border rounded-xl p-4">
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Array Representation</h3>
        <div className="flex gap-2 flex-wrap">
          {displayArray.map((val, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-lg text-white font-semibold text-sm" style={{ backgroundColor: nodeColor(i), transition: 'background-color 0.3s ease' }}>
                {val}
              </div>
              <span className="text-xs text-gray-400 mt-1">{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
