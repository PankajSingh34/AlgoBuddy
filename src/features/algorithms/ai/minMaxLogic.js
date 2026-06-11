export function generateMinMaxSteps(leafValues) {
  const steps = [];
  const nodes = new Array(15).fill(null).map((_, i) => ({
    val: i >= 7 ? leafValues[i - 7] : "?",
    id: i,
  }));
  
  const currentNodeClass = {};

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    classes: { ...currentNodeClass },
    explanation: "Starting Min Max Algorithm...",
  });

  const evaluate = (nodeIndex, depth, isMax) => {
    if (depth === 3) {
      currentNodeClass[nodeIndex] = "bg-green-500 text-white border-green-700";
      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        classes: { ...currentNodeClass },
        explanation: `Evaluating leaf node at distance ${nodeIndex - 7}, value: ${nodes[nodeIndex].val}`,
      });
      return nodes[nodeIndex].val;
    }

    currentNodeClass[nodeIndex] = "bg-yellow-300 text-black border-yellow-500";
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      classes: { ...currentNodeClass },
      explanation: `Visiting ${isMax ? "Max" : "Min"} node.`,
    });

    const leftChild = 2 * nodeIndex + 1;
    const rightChild = 2 * nodeIndex + 2;

    const leftVal = evaluate(leftChild, depth + 1, !isMax);
    const rightVal = evaluate(rightChild, depth + 1, !isMax);

    const bestVal = isMax ? Math.max(leftVal, rightVal) : Math.min(leftVal, rightVal);

    nodes[nodeIndex].val = bestVal;

    currentNodeClass[leftChild] = "bg-gray-300 text-black border-gray-400";
    currentNodeClass[rightChild] = "bg-gray-300 text-black border-gray-400";
    currentNodeClass[nodeIndex] = "bg-blue-500 text-white border-blue-700";

    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      classes: { ...currentNodeClass },
      explanation: `${isMax ? "Max" : "Min"} node completed. Chose ${bestVal} from (${leftVal}, ${rightVal}).`,
    });

    return bestVal;
  };

  const rootVal = evaluate(0, 0, true);

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    classes: { ...currentNodeClass },
    explanation: `Algorithm finished. Optimal value is ${rootVal}.`,
  });

  return steps;
}
