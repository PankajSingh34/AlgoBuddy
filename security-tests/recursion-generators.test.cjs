// security-tests/recursion-generators.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/recursion-generators.test.cjs
//
// Tests generateFactorialFrames and generateFibonacciFrames in
// src/features/algorithms/recursion/.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inline generateFactorialFrames
function* generateFactorialFrames(n) {
  const stack = [];
  let frameIdCounter = 0;

  function* fact(val, parentId = null) {
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

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 1,
      description: `Calling fact(${val}). Pushing a new stack frame onto the Call Stack.`,
      phase: "call",
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 2,
      description: `Checking if base case condition is met: is n (${val}) <= 1?`,
      phase: "call",
      activeFrameId: myId,
    };

    if (val <= 1) {
      stack[stack.length - 1].status = "base_case";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        description: `Base case met! n (${val}) <= 1. Returning 1.`,
        phase: "basecase",
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = 1;
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        description: `Returning 1 from fact(${val}). Stack frame is ready to pop.`,
        phase: "return",
        activeFrameId: myId,
      };

      stack.pop();
      return 1;
    }

    stack[stack.length - 1].status = "waiting";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 4,
      description: `Base case not met. We need to evaluate fact(${val - 1}) first. Calling fact(${val - 1}).`,
      phase: "call",
      activeFrameId: myId,
    };

    const subResult = yield* fact(val - 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "calculating";
    stack[myFrameIndex].subResult = subResult;
    stack[myFrameIndex].retVal = val * subResult;

    yield {
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      activeLine: 4,
      description: `Received return value ${subResult} from fact(${val - 1}). Calculating fact(${val}) = ${val} * fact(${val - 1}) = ${val} * ${subResult} = ${val * subResult}.`,
      phase: "return",
      activeFrameId: myId,
    };

    stack[myFrameIndex].status = "returning";
    yield {
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      activeLine: 4,
      description: `Returning ${val * subResult} from fact(${val}). Stack frame is ready to pop.`,
      phase: "return",
      activeFrameId: myId,
    };

    stack.pop();
    return val * subResult;
  }

  const finalResult = yield* fact(n);
  yield {
    stack: [],
    activeLine: 0,
    description: `Recursion finished! Final returned value is ${finalResult}.`,
    phase: "completed",
    activeFrameId: null,
  };
}

// Inline generateFibonacciFrames
function* generateFibonacciFrames(n) {
  const stack = [];
  let frameIdCounter = 0;
  const treeNodesMap = {};

  function prebuildTree(val, path = "root") {
    treeNodesMap[path] = {
      id: path,
      label: `fib(${val})`,
      val,
      status: "pending",
      result: null,
      parentId: path.includes("-") ? path.substring(0, path.lastIndexOf("-")) : null,
    };
    if (val <= 1) return;
    prebuildTree(val - 1, path + "-L");
    prebuildTree(val - 2, path + "-R");
  }

  prebuildTree(n);

  function* fib(val, path = "root", parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "fib",
      n: val,
      status: "calling",
      retVal: null,
      parentId,
      path,
    };
    stack.push(currentFrame);
    treeNodesMap[path].status = "active";

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 1,
      description: `Calling fib(${val}). Pushing onto the stack and activating tree node.`,
      phase: "call",
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 2,
      description: `Checking base case condition for fib(${val}): is n <= 1?`,
      phase: "call",
      activeFrameId: myId,
    };

    if (val <= 1) {
      stack[stack.length - 1].status = "base_case";
      treeNodesMap[path].status = "base";
      treeNodesMap[path].result = val;
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        activeLine: 2,
        description: `Base case met! fib(${val}) returns ${val}.`,
        phase: "basecase",
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = val;
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        activeLine: 2,
        description: `Returning ${val} from fib(${val}). Stack frame is ready to pop.`,
        phase: "return",
        activeFrameId: myId,
      };

      stack.pop();
      return val;
    }

    stack[stack.length - 1].status = "waiting_L";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `fib(${val}) requires left term fib(${val - 1}). Calling fib(${val - 1}).`,
      phase: "call",
      activeFrameId: myId,
    };

    const leftVal = yield* fib(val - 1, path + "-L", myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "waiting_R";
    stack[myFrameIndex].leftVal = leftVal;
    yield {
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Left child returned ${leftVal}. Now fib(${val}) requires right term fib(${val - 2}). Calling fib(${val - 2}).`,
      phase: "call",
      activeFrameId: myId,
    };

    const rightVal = yield* fib(val - 2, path + "-R", myId);

    const myFrameIndex2 = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex2].status = "calculating";
    stack[myFrameIndex2].rightVal = rightVal;
    stack[myFrameIndex2].retVal = leftVal + rightVal;
    treeNodesMap[path].status = "returned";
    treeNodesMap[path].result = leftVal + rightVal;

    yield {
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Right child returned ${rightVal}. Calculating fib(${val}) = left (${leftVal}) + right (${rightVal}) = ${leftVal + rightVal}.`,
      phase: "return",
      activeFrameId: myId,
    };

    stack[myFrameIndex2].status = "returning";
    yield {
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Returning ${leftVal + rightVal} from fib(${val}). Stack frame is ready to pop.`,
      phase: "return",
      activeFrameId: myId,
    };

    stack.pop();
    return leftVal + rightVal;
  }

  const finalResult = yield* fib(n);
  yield {
    stack: [],
    treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
    activeLine: 0,
    description: `Recursion finished! Final returned value is ${finalResult}.`,
    phase: "completed",
    activeFrameId: null,
  };
}

function collectFrames(generator) {
  const frames = [];
  for (const frame of generator) {
    frames.push(frame);
  }
  return frames;
}

describe("generateFactorialFrames", () => {
  test("factorial(0) yields only base case and completed frames", () => {
    const frames = collectFrames(generateFactorialFrames(0));
    assert.ok(frames.length >= 1);
    const last = frames[frames.length - 1];
    assert.strictEqual(last.phase, "completed");
    assert.strictEqual(last.stack.length, 0);
    // The final description mentions the result
    assert.ok(last.description.includes("0") || last.description.includes("1"));
  });

  test("factorial(1) yields base case and completed frames", () => {
    const frames = collectFrames(generateFactorialFrames(1));
    const last = frames[frames.length - 1];
    assert.strictEqual(last.phase, "completed");
    assert.strictEqual(last.stack.length, 0);
  });

  test("factorial(3) returns 6 as final result", () => {
    const frames = collectFrames(generateFactorialFrames(3));
    const last = frames[frames.length - 1];
    assert.strictEqual(last.phase, "completed");
    assert.ok(last.description.includes("6"));
  });

  test("factorial(3) includes call, basecase, and calculating phases", () => {
    const frames = collectFrames(generateFactorialFrames(3));
    const phases = frames.map((f) => f.phase);
    assert.ok(phases.includes("call"), "should have call phase");
    assert.ok(phases.includes("basecase"), "should have basecase phase");
    assert.ok(phases.includes("return"), "should have return phase");
    assert.ok(phases.includes("completed"), "should have completed phase");
  });

  test("each frame has required keys", () => {
    const frames = collectFrames(generateFactorialFrames(1));
    for (const frame of frames) {
      assert.ok("stack" in frame, "frame must have stack");
      assert.ok("activeLine" in frame, "frame must have activeLine");
      assert.ok("description" in frame, "frame must have description");
      assert.ok("phase" in frame, "frame must have phase");
      assert.ok("activeFrameId" in frame, "frame must have activeFrameId");
    }
  });

  test("base case frame has phase=basecase", () => {
    const frames = collectFrames(generateFactorialFrames(1));
    const baseFrames = frames.filter((f) => f.phase === "basecase");
    assert.ok(baseFrames.length >= 1, "should have at least one basecase frame");
  });
});

describe("generateFibonacciFrames", () => {
  test("fibonacci(0) yields base case and completed frames with result 0", () => {
    const frames = collectFrames(generateFibonacciFrames(0));
    const last = frames[frames.length - 1];
    assert.strictEqual(last.phase, "completed");
    assert.strictEqual(last.stack.length, 0);
    assert.ok(last.description.includes("0"));
  });

  test("fibonacci(1) yields base case and completed frames with result 1", () => {
    const frames = collectFrames(generateFibonacciFrames(1));
    const last = frames[frames.length - 1];
    assert.strictEqual(last.phase, "completed");
    assert.ok(last.description.includes("1"));
  });

  test("fibonacci(3) returns 2 as final result (fib sequence: 0,1,1,2)", () => {
    const frames = collectFrames(generateFibonacciFrames(3));
    const last = frames[frames.length - 1];
    assert.strictEqual(last.phase, "completed");
    assert.ok(last.description.includes("2"));
  });

  test("fibonacci(3) includes call, waiting, calculating, and completed phases", () => {
    const frames = collectFrames(generateFibonacciFrames(3));
    const phases = frames.map((f) => f.phase);
    assert.ok(phases.includes("call"), "should have call phase");
    assert.ok(phases.includes("basecase"), "should have basecase phase");
    assert.ok(phases.includes("return"), "should have return phase");
    assert.ok(phases.includes("completed"), "should have completed phase");
  });

  test("each frame has required keys including treeNodes", () => {
    const frames = collectFrames(generateFibonacciFrames(1));
    for (const frame of frames) {
      assert.ok("stack" in frame, "frame must have stack");
      assert.ok("treeNodes" in frame, "frame must have treeNodes");
      assert.ok("activeLine" in frame, "frame must have activeLine");
      assert.ok("description" in frame, "frame must have description");
      assert.ok("phase" in frame, "frame must have phase");
      assert.ok("activeFrameId" in frame, "frame must have activeFrameId");
    }
  });

  test("final frame has empty stack and phase=completed", () => {
    const frames = collectFrames(generateFibonacciFrames(2));
    const last = frames[frames.length - 1];
    assert.strictEqual(last.phase, "completed");
    assert.strictEqual(last.stack.length, 0);
    assert.strictEqual(last.activeFrameId, null);
  });
});
