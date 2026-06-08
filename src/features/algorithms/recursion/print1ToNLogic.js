/**
 * Pure generator logic for Recursion: Print 1 to N
 * Decoupled from React UI.
 * @param {number} n - The target number
 * @returns {Array} sequence of state frames
 */
export function generatePrint1ToNFrames(n) {
  const frames = [];
  const stack = [];
  const printed = [];
  let frameIdCounter = 0;

  function run(i, maxVal, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "print1ToN",
      i,
      n: maxVal,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 1,
      description: `Calling print1ToN(i = ${i}, n = ${maxVal}). Pushing new stack frame.`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 2,
      description: `Checking base case condition: is i (${i}) > n (${maxVal})?`,
      activeFrameId: myId,
    });

    if (i > maxVal) {
      stack[stack.length - 1].status = "base_case";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Base case met! i (${i}) > n (${maxVal}). Stopping recursion.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Returning from print1ToN(i = ${i}). Stack frame is ready to pop.`,
        activeFrameId: myId,
      });

      stack.pop();
      return;
    }

    // Print i
    printed.push(i);
    stack[stack.length - 1].status = "printing";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 3,
      description: `Printing value: ${i}. Output array is updated.`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "waiting";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 4,
      description: `Making recursive call for next number: print1ToN(i = ${i + 1}, n = ${maxVal}).`,
      activeFrameId: myId,
    });

    run(i + 1, maxVal, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "returning";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      printed: [...printed],
      activeLine: 4,
      description: `Returning back to caller print1ToN(i = ${i}). Stack frame is ready to pop.`,
      activeFrameId: myId,
    });

    stack.pop();
  }

  run(1, n);
  frames.push({
    stack: [],
    printed: [...printed],
    activeLine: 0,
    description: `Recursion finished. All numbers from 1 to ${n} have been printed.`,
    activeFrameId: null,
  });

  return frames;
}
