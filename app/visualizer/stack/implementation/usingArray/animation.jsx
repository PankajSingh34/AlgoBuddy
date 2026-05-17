"use client";
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const MAX_SIZE = 8;

const ArrayStackAnimation = () => {
  const [stack, setStack] = useState([]);
  const [top, setTop] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Stack is empty. Enter a value and click Push.');
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const arrayRefs = useRef([]);

  useEffect(() => {
    if (animatingIndex !== null && arrayRefs.current[animatingIndex]) {
      gsap.fromTo(arrayRefs.current[animatingIndex],
        { scale: 1.2, backgroundColor: '#22c55e' },
        { scale: 1, backgroundColor: '#3b82f6', duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [animatingIndex]);

  const handlePush = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Please enter a valid number'); return; }
    if (top >= MAX_SIZE - 1) { setMessage('Stack Overflow! The array is full.'); return; }

    const newTop = top + 1;
    const newStack = [...stack];
    newStack[newTop] = val;
    setStack(newStack);
    setTop(newTop);
    setAnimatingIndex(newTop);
    setMessage(`Pushed ${val} to stack[${newTop}]`);
    setInputValue('');

    setTimeout(() => setAnimatingIndex(null), 500);
  };

  const handlePop = () => {
    if (top < 0) { setMessage('Stack Underflow! The stack is empty.'); return; }
    const val = stack[top];
    const newStack = [...stack];
    newStack[top] = undefined;
    setStack(newStack);
    setTop(top - 1);
    setAnimatingIndex(top);
    setMessage(`Popped ${val} from stack[${top}]`);

    setTimeout(() => setAnimatingIndex(null), 500);
  };

  const handlePeek = () => {
    if (top < 0) { setMessage('Stack is empty!'); return; }
    setAnimatingIndex(top);
    setMessage(`Top element: ${stack[top]} at stack[${top}]`);
    setTimeout(() => setAnimatingIndex(null), 500);
  };

  const reset = () => {
    setStack([]);
    setTop(-1);
    setMessage('Stack reset. Enter a value and click Push.');
    setAnimatingIndex(null);
  };

  return (
    <div className="py-16 bg-gray-100 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Array-Based Stack Visualizer
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handlePush()}
            />
            <button onClick={handlePush} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Push</button>
            <button onClick={handlePop} disabled={top < 0} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">Pop</button>
            <button onClick={handlePeek} disabled={top < 0} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">Peek</button>
            <button onClick={reset} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Reset</button>
          </div>

          <div className={`mb-4 p-3 rounded-lg text-center ${message.includes('Overflow') || message.includes('Underflow') ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}>
            {message}
          </div>

          <div className="flex items-end gap-1 justify-center mb-6" style={{ minHeight: '320px' }}>
            {Array.from({ length: MAX_SIZE }, (_, i) => {
              const idx = MAX_SIZE - 1 - i;
              const hasValue = stack[idx] !== undefined;
              const isTop = idx === top;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    ref={el => arrayRefs.current[idx] = el}
                    className={`w-16 h-14 flex items-center justify-center border-2 rounded-lg text-lg font-bold transition-all ${
                      animatingIndex === idx
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                        : isTop && hasValue
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : hasValue
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <span className="text-gray-800 dark:text-gray-200">
                      {hasValue ? stack[idx] : ''}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Animating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Top Element</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Filled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600"></div>
              <span className="text-gray-600 dark:text-gray-400">Empty</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Size: {top + 1} / {MAX_SIZE} {top >= 0 && <span>| Top: stack[{top}] = {stack[top]}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayStackAnimation;
