/**
 * Pure generator logic for Recursion: Print N to 1
 * Decoupled from React UI.
 * @param {number} n - The starting number
 * @returns {Array} sequence of state frames
 */
export function generatePrintNTo1Frames(n) {
  const frames = [];
  const stack = [];
  const printed = [];
  let frameIdCounter = 0;

  function run(i, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "printNTo1",
      i,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 1,
      description: `Calling printNTo1(i = ${i}). Pushing new stack frame.`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 2,
      description: `Checking base case condition: is i (${i}) < 1?`,
      activeFrameId: myId,
    });

    if (i < 1) {
      stack[stack.length - 1].status = "base_case";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Base case met! i (${i}) < 1. Stopping recursion.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Returning from printNTo1(i = ${i}). Stack frame is ready to pop.`,
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
      description: `Making recursive call for next number: printNTo1(i = ${i - 1}).`,
      activeFrameId: myId,
    });

    run(i - 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "returning";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      printed: [...printed],
      activeLine: 4,
      description: `Returning back to caller printNTo1(i = ${i}). Stack frame is ready to pop.`,
      activeFrameId: myId,
    });

    stack.pop();
  }

  run(n);

  frames.push({
    stack: [],
    printed: [...printed],
    activeLine: null,
    description: "Recursion tree completely unspooled. All frames popped.",
    activeFrameId: null,
  });

  return frames;
}
