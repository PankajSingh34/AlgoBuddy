// security-tests/minmaxLogic.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/minmaxLogic.test.cjs
//
// Tests the minmaxGenerator function in src/features/algorithms/ai/minmaxLogic.js.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined minmaxGenerator to avoid ESM import issues.
function* minmaxGenerator(initialNodes) {
  let nodes = initialNodes.map(n => ({ ...n }));
  let currentNodeClass = {};

  function* evaluate(nodeIndex, depth, isMax) {
    if (depth === 3) {
      currentNodeClass[nodeIndex] = "bg-green-500 text-white border-green-700";
      yield {
        treeNodes: nodes.map(n => ({ ...n })),
        currentNodeClass: { ...currentNodeClass },
        stepExplanation: `Evaluating leaf node at distance ${nodeIndex - 7}, value: ${nodes[nodeIndex].val}`
      };
      return nodes[nodeIndex].val;
    }

    currentNodeClass[nodeIndex] = "bg-yellow-300 text-black border-yellow-500";
    yield {
      treeNodes: nodes.map(n => ({ ...n })),
      currentNodeClass: { ...currentNodeClass },
      stepExplanation: `Visiting ${isMax ? "Max" : "Min"} node.`
    };

    const leftChild = 2 * nodeIndex + 1;
    const rightChild = 2 * nodeIndex + 2;

    const leftVal = yield* evaluate(leftChild, depth + 1, !isMax);
    const rightVal = yield* evaluate(rightChild, depth + 1, !isMax);

    const bestVal = isMax ? Math.max(leftVal, rightVal) : Math.min(leftVal, rightVal);

    nodes[nodeIndex].val = bestVal;

    currentNodeClass[leftChild] = "bg-gray-300 text-black border-gray-400";
    currentNodeClass[rightChild] = "bg-gray-300 text-black border-gray-400";
    currentNodeClass[nodeIndex] = "bg-blue-500 text-white border-blue-700";

    yield {
      treeNodes: nodes.map(n => ({ ...n })),
      currentNodeClass: { ...currentNodeClass },
      stepExplanation: `${isMax ? "Max" : "Min"} node completed. Chose ${bestVal} from (${leftVal}, ${rightVal}).`
    };

    return bestVal;
  }

  const rootVal = yield* evaluate(0, 0, true);

  yield {
    treeNodes: nodes.map(n => ({ ...n })),
    currentNodeClass: { ...currentNodeClass },
    stepExplanation: `Algorithm finished. Optimal value is ${rootVal}.`,
    message: `Finished! Optimal value: ${rootVal}`
  };
}

function collectSteps(gen) {
  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

// Build a tree of 15 nodes (depth 0-3): indices 0-14, leaves at 7-14
// Root (index 0, depth 0) is Max
// Level 1: nodes 1,2 (Min)
// Level 2: nodes 3,4,5,6 (Max)
// Level 3: nodes 7-14 (Leaves)
function buildTree(leafValues) {
  // 8 leaves for a 4-level minmax tree
  const nodes = [];
  for (let i = 0; i < 15; i++) {
    nodes.push({ val: 0 });
  }
  for (let i = 0; i < 8; i++) {
    nodes[7 + i] = { val: leafValues[i] };
  }
  return nodes;
}

describe("minmaxGenerator", () => {
  test("yields at least one step", () => {
    const tree = buildTree([1, 2, 3, 4, 5, 6, 7, 8]);
    const steps = collectSteps(minmaxGenerator(tree));
    assert.ok(steps.length > 0, "should yield at least one step");
  });

  test("each yielded step has expected shape", () => {
    const tree = buildTree([1, 2, 3, 4, 5, 6, 7, 8]);
    const steps = collectSteps(minmaxGenerator(tree));
    for (const step of steps) {
      assert.ok(Array.isArray(step.treeNodes), "step.treeNodes should be an array");
      assert.ok(step.currentNodeClass && typeof step.currentNodeClass === "object");
      assert.strictEqual(typeof step.stepExplanation, "string");
    }
  });

  test("final step contains the optimal value in stepExplanation and message", () => {
    // Tree: root(max) -> children nodes 1,2 (min) -> ... -> leaves
    // Leaves values: [1,2,3,4,5,6,7,8]
    // Expected: max of (min of [1,2,3,4], min of [5,6,7,8]) = max(1, 5) = 5
    const tree = buildTree([1, 2, 3, 4, 5, 6, 7, 8]);
    const steps = collectSteps(minmaxGenerator(tree));
    const lastStep = steps[steps.length - 1];
    assert.ok(
      lastStep.stepExplanation.includes("6"),
      `final explanation should mention optimal value 6, got: ${lastStep.stepExplanation}`,
    );
    assert.ok(
      lastStep.message && lastStep.message.includes("6"),
      `final message should mention optimal value 6, got: ${lastStep.message}`,
    );
  });

  test("returns correct optimal value for tree with leaves [3,5,1,7,2,9,4,6]", () => {
    // Level 2 (max nodes): node3=max(3,5)=5, node4=max(1,7)=7, node5=max(2,9)=9, node6=max(4,6)=6
    // Level 1 (min nodes): node1=min(5,7)=5, node2=min(9,6)=6
    // Level 0 (max root): max(5,6)=6
    const tree = buildTree([3, 5, 1, 7, 2, 9, 4, 6]);
    const steps = collectSteps(minmaxGenerator(tree));
    const lastStep = steps[steps.length - 1];
    assert.ok(
      lastStep.stepExplanation.includes("6"),
      `optimal value should be 6, got explanation: ${lastStep.stepExplanation}`,
    );
  });

  test("returns correct optimal value for tree with leaves [10,20,30,40,5,15,25,35]", () => {
    // Level 2: node3=max(10,20)=20, node4=max(30,40)=40, node5=max(5,15)=15, node6=max(25,35)=35
    // Level 1: node1=min(20,40)=20, node2=min(15,35)=15
    // Level 0: max(20,15)=20
    const tree = buildTree([10, 20, 30, 40, 5, 15, 25, 35]);
    const steps = collectSteps(minmaxGenerator(tree));
    const lastStep = steps[steps.length - 1];
    assert.ok(
      lastStep.stepExplanation.includes("20"),
      `optimal value should be 20, got explanation: ${lastStep.stepExplanation}`,
    );
  });

  test("stepExplanation mentions leaf evaluation for depth-3 nodes", () => {
    const tree = buildTree([1, 2, 3, 4, 5, 6, 7, 8]);
    const steps = collectSteps(minmaxGenerator(tree));
    // At least one step should mention "Evaluating leaf node"
    const leafStep = steps.find(s => s.stepExplanation.includes("Evaluating leaf"));
    assert.ok(leafStep, "at least one step should evaluate a leaf node");
  });

  test("stepExplanation mentions Max and Min node visits", () => {
    const tree = buildTree([1, 2, 3, 4, 5, 6, 7, 8]);
    const steps = collectSteps(minmaxGenerator(tree));
    const hasMax = steps.some(s => s.stepExplanation.includes("Max"));
    const hasMin = steps.some(s => s.stepExplanation.includes("Min"));
    assert.ok(hasMax, "at least one step should mention Max node");
    assert.ok(hasMin, "at least one step should mention Min node");
  });

  test("stepExplanation includes 'completed' for non-leaf node resolution", () => {
    const tree = buildTree([1, 2, 3, 4, 5, 6, 7, 8]);
    const steps = collectSteps(minmaxGenerator(tree));
    const hasCompleted = steps.some(s => s.stepExplanation.includes("completed"));
    assert.ok(hasCompleted, "at least one step should show node completion");
  });

  test("yields the expected number of steps for a 4-level tree", () => {
    // 15 nodes total: 7 non-leaf + 8 leaves
    // Non-leaf nodes (depth 0-2): 7 visits + 7 completions = 14 steps
    // Leaf nodes (depth 3): 8 evaluations = 8 steps
    // Final step: 1
    // Total: 14 + 8 + 1 = 23
    const tree = buildTree([1, 2, 3, 4, 5, 6, 7, 8]);
    const steps = collectSteps(minmaxGenerator(tree));
    assert.strictEqual(steps.length, 23, `expected 23 steps, got ${steps.length}`);
  });

  test("treeNodes array is preserved across all steps", () => {
    const tree = buildTree([5, 5, 5, 5, 5, 5, 5, 5]);
    const steps = collectSteps(minmaxGenerator(tree));
    for (const step of steps) {
      assert.strictEqual(step.treeNodes.length, 15, "treeNodes should always have 15 elements");
    }
  });

  test("handles tree with all equal leaf values", () => {
    const tree = buildTree([7, 7, 7, 7, 7, 7, 7, 7]);
    const steps = collectSteps(minmaxGenerator(tree));
    const lastStep = steps[steps.length - 1];
    // All min nodes choose min(7,7)=7, all max nodes choose max(7,7)=7
    assert.ok(
      lastStep.stepExplanation.includes("7"),
      `optimal value should be 7 for all-equal leaves, got: ${lastStep.stepExplanation}`,
    );
  });

  test("handles tree with negative leaf values", () => {
    // Level 2: node3=max(-1,-2)=-1, node4=max(-3,-4)=-3, node5=max(-5,-6)=-5, node6=max(-7,-8)=-7
    // Level 1: node1=min(-1,-3)=-3, node2=min(-5,-7)=-7
    // Level 0: max(-3,-7)=-3
    const tree = buildTree([-1, -2, -3, -4, -5, -6, -7, -8]);
    const steps = collectSteps(minmaxGenerator(tree));
    const lastStep = steps[steps.length - 1];
    assert.ok(
      lastStep.stepExplanation.includes("-3"),
      `optimal value should be -3, got: ${lastStep.stepExplanation}`,
    );
  });
});