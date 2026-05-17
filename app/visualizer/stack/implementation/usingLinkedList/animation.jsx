"use client";
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const LinkedListStackAnimation = () => {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Stack is empty. Enter a value and click Push.');
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    if (animatingIndex !== null && nodeRefs.current[animatingIndex]) {
      gsap.fromTo(nodeRefs.current[animatingIndex],
        { scale: 1.3, backgroundColor: '#22c55e' },
        { scale: 1, backgroundColor: '#3b82f6', duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [animatingIndex]);

  const handlePush = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Please enter a valid number'); return; }
    const newNode = { value: val, id: Date.now() };
    const newStack = [newNode, ...stack];
    setStack(newStack);
    setAnimatingIndex(0);
    setMessage(`Pushed ${val} to top of stack`);
    setInputValue('');
    setTimeout(() => setAnimatingIndex(null), 500);
  };

  const handlePop = () => {
    if (stack.length === 0) { setMessage('Stack Underflow! Stack is empty.'); return; }
    const val = stack[0].value;
    setAnimatingIndex(0);
    setTimeout(() => {
      setStack(prev => prev.slice(1));
      setAnimatingIndex(null);
      setMessage(`Popped ${val} from top of stack`);
    }, 300);
  };

  const handlePeek = () => {
    if (stack.length === 0) { setMessage('Stack is empty!'); return; }
    setAnimatingIndex(0);
    setMessage(`Top element: ${stack[0].value}`);
    setTimeout(() => setAnimatingIndex(null), 500);
  };

  const reset = () => {
    setStack([]);
    setMessage('Stack reset. Enter a value and click Push.');
    setAnimatingIndex(null);
  };

  return (
    <div className="py-16 bg-gray-100 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Linked List Stack Visualizer
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
            <button onClick={handlePop} disabled={stack.length === 0} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">Pop</button>
            <button onClick={handlePeek} disabled={stack.length === 0} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">Peek</button>
            <button onClick={reset} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Reset</button>
          </div>

          <div className={`mb-4 p-3 rounded-lg text-center ${message.includes('Underflow') ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}>
            {message}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-0 mb-6" style={{ minHeight: '120px' }}>
            {stack.length === 0 ? (
              <div className="text-gray-400 dark:text-gray-500 text-lg border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg px-8 py-6">
                Empty Stack (null)
              </div>
            ) : (
              stack.map((node, i) => (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col items-center">
                    <div
                      ref={el => nodeRefs.current[i] = el}
                      className={`w-20 h-16 flex items-center justify-center border-2 rounded-lg text-lg font-bold transition-all ${
                        animatingIndex === i
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 scale-110'
                          : i === 0
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      }`}
                    >
                      <span className="text-gray-800 dark:text-gray-200">{node.value}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{i === 0 ? 'TOP' : ''}</span>
                  </div>
                  {i < stack.length - 1 && (
                    <div className="flex items-center text-gray-400 text-2xl mx-1">→</div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>

          {stack.length > 0 && (
            <div className="text-center text-xs text-gray-400 dark:text-gray-500 mb-4">
              null ← ... ← Node({stack[stack.length - 1].value}) ← ... ← Node({stack[0].value}) ← TOP
            </div>
          )}

          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Top</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Animating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Node</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Size: {stack.length} {stack.length > 0 && <span>| Top: {stack[0].value}</span>} | No overflow (dynamic memory)
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListStackAnimation;
