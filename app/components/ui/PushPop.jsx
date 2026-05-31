'use client';
import { useState } from 'react';
import usePlayback from '@/app/hooks/usePlayback';
import LinearMemoryControls from '@/app/components/ui/LinearMemoryControls';

const PushPop = ({
  stack,
  setStack,
  isAnimating,
  setIsAnimating,
  message,
  setMessage,
  operation,
  setOperation,
  extraActions,
  capacity,
  setCapacity,
  stackLimit,
  speed: parentSpeed,
  setSpeed: parentSetSpeed
}) => {
  const [inputValue, setInputValue] = useState('');
  const [capacityInput, setCapacityInput] = useState('');
  const localPlayback = usePlayback(1);
  const speed = parentSpeed !== undefined ? parentSpeed : localPlayback.speed;
  const setSpeed = parentSetSpeed !== undefined ? parentSetSpeed : localPlayback.setSpeed;

  const limit = capacity !== undefined && capacity !== null ? capacity : stackLimit;

  // Handle setting capacity
  const handleSetCapacity = () => {
    const size = parseInt(capacityInput, 10);
    if (isNaN(size) || size < 1 || size > 10) {
      setMessage('Please enter a valid capacity between 1 and 10.');
      return;
    }
    setCapacity(size);
    setCapacityInput('');
    setMessage(`Stack capacity set to ${size}. Ready for operations!`);
  };

  // Push operation
  const push = () => {
    if (limit && stack.length >= limit) {
      setMessage(`Stack Overflow! Cannot push. top (${stack.length - 1}) >= size - 1 (${limit - 1})`);
      return;
    }
    if (!inputValue.trim()) {
      setMessage('Please enter a value');
      return;
    }
    setIsAnimating(true);
    setOperation(`Pushing "${inputValue}"...`);
    
    setTimeout(() => {
      setStack(prev => [inputValue, ...prev]);
      setOperation(null);
      setMessage(`"${inputValue}" pushed to stack`);
      setInputValue('');
      setIsAnimating(false);
    }, 1000 / speed);
  };

  // Pop operation
  const pop = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    setIsAnimating(true);
    const poppedValue = stack[0];
    setOperation(`Popping "${poppedValue}"...`);
    
    setTimeout(() => {
      setStack(prev => prev.slice(1));
      setOperation(null);
      setMessage(`"${poppedValue}" popped from stack`);
      setIsAnimating(false);
    }, 1000 / speed);
  };

  // Peek operation
  const peek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    setIsAnimating(true);
    setOperation(`Peeking at "${stack[0]}"`);
    
    setTimeout(() => {
      setOperation(null);
      setMessage(`Top element is "${stack[0]}"`);
      setIsAnimating(false);
    }, 1000 / speed);
  };

  // Handle capacity-not-set state
  if (capacity === null) {
    return (
      <LinearMemoryControls
        inputValue={capacityInput}
        setInputValue={setCapacityInput}
        placeholder="Enter capacity (1-10)..."
        isAnimating={isAnimating}
        operation={operation}
        message={message}
        speed={speed}
        onSpeedChange={setSpeed}
        actions={[
          { label: "Set Capacity", onClick: handleSetCapacity, variant: "primary", needsInput: true }
        ]}
      />
    );
  }

  const actions = [
    { label: "Push", onClick: push, variant: "primary", needsInput: true, disabled: limit && stack.length >= limit },
    { label: "Pop", onClick: pop, disabled: stack.length === 0, variant: "secondary" },
    { label: "Peek", onClick: peek, disabled: stack.length === 0, variant: "secondary" },
    { label: "Reset", onClick: () => { setStack([]); setMessage('Stack cleared'); }, variant: "outline" },
  ];

  // If stack is empty, allow user to change size (locking capacity once an element is pushed)
  if (stack.length === 0 && setCapacity) {
    actions.push({ label: "Change Size", onClick: () => { setCapacity(null); setMessage('Please enter a new stack capacity.'); }, variant: "secondary" });
  }

  if (extraActions) {
    actions.push(...extraActions);
  }

  return (
    <LinearMemoryControls
      inputValue={inputValue}
      setInputValue={setInputValue}
      isAnimating={isAnimating}
      operation={operation}
      message={message}
      speed={speed}
      onSpeedChange={setSpeed}
      actions={actions}
    />
  );
};

export default PushPop;