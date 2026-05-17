"use client";
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const MAX_SIZE = 8;

const ArrayQueueAnimation = () => {
  const [queue, setQueue] = useState([]);
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Queue is empty. Enter a value and click Enqueue.');
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [isCircular, setIsCircular] = useState(true);
  const cellRefs = useRef([]);

  useEffect(() => {
    if (animatingIndex !== null && cellRefs.current[animatingIndex]) {
      gsap.fromTo(cellRefs.current[animatingIndex],
        { scale: 1.2, backgroundColor: '#22c55e' },
        { scale: 1, backgroundColor: '#3b82f6', duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [animatingIndex]);

  const getNextRear = (r) => isCircular ? (r + 1) % MAX_SIZE : r + 1;

  const handleEnqueue = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Please enter a valid number'); return; }

    const nextRear = getNextRear(rear);
    if (nextRear === front && front !== -1) {
      setMessage(isCircular ? 'Queue Overflow! Circular array is full.' : 'Queue Overflow! Rear reached end of array.');
      return;
    }

    const newQueue = [...queue];
    const newFront = front === -1 ? 0 : front;
    newQueue[nextRear] = val;

    setQueue(newQueue);
    setFront(newFront);
    setRear(nextRear);
    setAnimatingIndex(nextRear);
    setMessage(`Enqueued ${val} at index [${nextRear}]`);
    setInputValue('');

    setTimeout(() => setAnimatingIndex(null), 500);
  };

  const handleDequeue = () => {
    if (front === -1) { setMessage('Queue Underflow! Queue is empty.'); return; }

    const val = queue[front];
    const newQueue = [...queue];
    newQueue[front] = undefined;

    if (front === rear) {
      setQueue([]);
      setFront(-1);
      setRear(-1);
    } else {
      const newFront = isCircular ? (front + 1) % MAX_SIZE : front + 1;
      setQueue(newQueue);
      setFront(newFront);
    }

    setAnimatingIndex(front);
    setMessage(`Dequeued ${val} from index [${front}]`);
    setTimeout(() => setAnimatingIndex(null), 500);
  };

  const handlePeek = () => {
    if (front === -1) { setMessage('Queue is empty!'); return; }
    setAnimatingIndex(front);
    setMessage(`Front element: ${queue[front]} at index [${front}]`);
    setTimeout(() => setAnimatingIndex(null), 500);
  };

  const reset = () => {
    setQueue([]);
    setFront(-1);
    setRear(-1);
    setMessage('Queue reset.');
    setAnimatingIndex(null);
  };

  const getCellStyle = (idx) => {
    const hasValue = queue[idx] !== undefined;
    const isAnim = animatingIndex === idx;

    if (isAnim) return 'border-green-500 bg-green-50 dark:bg-green-900/30 scale-110';
    if (hasValue && idx === front) return 'border-purple-500 bg-purple-50 dark:bg-purple-900/30';
    if (hasValue && idx === rear) return 'border-amber-500 bg-amber-50 dark:bg-amber-900/30';
    if (hasValue) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/30';
    return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700';
  };

  return (
    <div className="py-16 bg-gray-100 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            {isCircular ? 'Circular' : 'Linear'} Array Queue Visualizer
          </h2>

          <div className="flex justify-center mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={isCircular} onChange={() => { setIsCircular(!isCircular); reset(); }} className="rounded" />
              Circular Mode (wrap-around)
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
            />
            <button onClick={handleEnqueue} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Enqueue</button>
            <button onClick={handleDequeue} disabled={front === -1} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">Dequeue</button>
            <button onClick={handlePeek} disabled={front === -1} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">Front</button>
            <button onClick={reset} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Reset</button>
          </div>

          <div className={`mb-4 p-3 rounded-lg text-center ${message.includes('Overflow') || message.includes('Underflow') ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}>
            {message}
          </div>

          <div className="flex items-end gap-1 justify-center mb-6" style={{ minHeight: '260px' }}>
            {Array.from({ length: MAX_SIZE }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  ref={el => cellRefs.current[i] = el}
                  className={`w-16 h-14 flex items-center justify-center border-2 rounded-lg text-lg font-bold transition-all ${getCellStyle(i)}`}
                >
                  <span className="text-gray-800 dark:text-gray-200">{queue[i] !== undefined ? queue[i] : ''}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">[{i}]</span>
                {i === front && <span className="text-xs text-purple-500 font-bold">FRONT</span>}
                {i === rear && <span className="text-xs text-amber-500 font-bold">REAR</span>}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Animating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Front</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Rear</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Filled</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Size: {front === -1 ? 0 : rear >= front ? rear - front + 1 : MAX_SIZE - front + rear + 1} / {MAX_SIZE}
            {front !== -1 && <span> | Front: [{front}] = {queue[front]} | Rear: [{rear}] = {queue[rear]}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayQueueAnimation;
