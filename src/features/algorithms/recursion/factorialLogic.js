/**
 * Pure function to generate frames for the Recursive Factorial algorithm.
 * Returns an array of frames for the visualizer to step through.
 */
export function generateFactorialFrames(n) {
  const frames = [];
  const stack = [];
  let frameIdCounter = 0;

  function fact(val, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "fact",
      n: val,
      status: "calling",
      retVal: null,
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 1,
      description: `Calling fact(${val}). Pushing a new stack frame onto the Call Stack.`,
      phase: "call",
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 2,
      description: `Checking if base case condition is met: is n (${val}) <= 1?`,
      phase: "call",
      activeFrameId: myId,
    });

    if (val <= 1) {
      stack[stack.length - 1].status = "base_case";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        description: `Base case met! n (${val}) <= 1. Returning 1.`,
        phase: "basecase",
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = 1;
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        description: `Returning 1 from fact(${val}). Stack frame is ready to pop.`,
        phase: "return",
        activeFrameId: myId,
      });

      stack.pop();
      return 1;
    }

    stack[stack.length - 1].status = "waiting";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 4,
      description: `Base case not met. We need to evaluate fact(${val - 1}) first. Calling fact(${val - 1}).`,
      phase: "call",
      activeFrameId: myId,
    });

    const subResult = fact(val - 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "calculating";
    stack[myFrameIndex].subResult = subResult;
    stack[myFrameIndex].retVal = val * subResult;

    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      activeLine: 4,
      description: `Received return value ${subResult} from fact(${val - 1}). Calculating fact(${val}) = ${val} * fact(${val - 1}) = ${val} * ${subResult} = ${val * subResult}.`,
      phase: "return",
      activeFrameId: myId,
    });

    stack[myFrameIndex].status = "returning";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      activeLine: 4,
      description: `Returning ${val * subResult} from fact(${val}). Stack frame is ready to pop.`,
      phase: "return",
      activeFrameId: myId,
    });

    stack.pop();
    return val * subResult;
  }

  const finalResult = fact(n);
  frames.push({
    stack: [],
    activeLine: 0,
    description: `Recursion finished! Final returned value is ${finalResult}.`,
    phase: "completed",
    activeFrameId: null,
  });

  return frames;
}
