export function generateAlphaBetaSteps(leafValues) {
  const steps = [];
  const nodes = new Array(15).fill(null).map((_, i) => ({
    val: i >= 7 ? leafValues[i - 7] : "?",
    id: i,
    alpha: -Infinity,
    beta: Infinity,
  }));
  
  const currentNodeClass = {};
  const prunedNodes = {};

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    classes: { ...currentNodeClass },
    pruned: { ...prunedNodes },
    explanation: "Starting Alpha-Beta Pruning...",
  });

  const evaluate = (nodeIndex, depth, alpha, beta, isMax) => {
    if (depth === 3) {
      currentNodeClass[nodeIndex] = "bg-green-500 text-white border-green-700";
      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        classes: { ...currentNodeClass },
        pruned: { ...prunedNodes },
        explanation: `Evaluating leaf node: ${nodes[nodeIndex].val}`,
      });
      return nodes[nodeIndex].val;
    }

    currentNodeClass[nodeIndex] = "bg-yellow-300 text-black border-yellow-500 scale-110";
    nodes[nodeIndex].alpha = alpha;
    nodes[nodeIndex].beta = beta;

    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      classes: { ...currentNodeClass },
      pruned: { ...prunedNodes },
      explanation: `Visiting ${isMax ? "Max" : "Min"} node. α=${alpha === -Infinity ? "-∞" : alpha}, β=${beta === Infinity ? "∞" : beta}`,
    });

    const leftChild = 2 * nodeIndex + 1;
    const rightChild = 2 * nodeIndex + 2;

    let bestVal = isMax ? -Infinity : Infinity;

    // Left Child
    const leftVal = evaluate(leftChild, depth + 1, alpha, beta, !isMax);
    if (isMax) {
      bestVal = Math.max(bestVal, leftVal);
      alpha = Math.max(alpha, bestVal);
    } else {
      bestVal = Math.min(bestVal, leftVal);
      beta = Math.min(beta, bestVal);
    }
    
    nodes[nodeIndex].val = bestVal;
    nodes[nodeIndex].alpha = alpha;
    nodes[nodeIndex].beta = beta;

    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      classes: { ...currentNodeClass },
      pruned: { ...prunedNodes },
      explanation: `Back at ${isMax ? "Max" : "Min"} node. Updated ${isMax ? "α" : "β"} to ${isMax ? alpha : beta}. Check α=${alpha === -Infinity ? "-∞" : alpha} ≥ β=${beta === Infinity ? "∞" : beta}?`,
    });

    // Pruning check
    if (beta <= alpha) {
      prunedNodes[rightChild] = true;
      const markPruned = (idx) => {
        if (idx > 14) return;
        prunedNodes[idx] = true;
        markPruned(2 * idx + 1);
        markPruned(2 * idx + 2);
      };
      markPruned(rightChild);
      
      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        classes: { ...currentNodeClass },
        pruned: { ...prunedNodes },
        explanation: `PRUNED! Since ${isMax ? "β (" + beta + ") <= α (" + alpha + ")" : "α (" + alpha + ") >= β (" + beta + ")"}. Ignoring right child.`,
      });
    } else {
      // Right Child
      const rightVal = evaluate(rightChild, depth + 1, alpha, beta, !isMax);
      if (isMax) {
        bestVal = Math.max(bestVal, rightVal);
        alpha = Math.max(alpha, bestVal);
      } else {
        bestVal = Math.min(bestVal, rightVal);
        beta = Math.min(beta, bestVal);
      }
      nodes[nodeIndex].val = bestVal;
      nodes[nodeIndex].alpha = alpha;
      nodes[nodeIndex].beta = beta;
    }

    currentNodeClass[nodeIndex] = "bg-blue-500 text-white border-blue-700 scale-100";
    
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      classes: { ...currentNodeClass },
      pruned: { ...prunedNodes },
      explanation: `Node ${nodeIndex} completed. Value: ${bestVal}`,
    });

    return bestVal;
  };

  const rootVal = evaluate(0, 0, -Infinity, Infinity, true);

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    classes: { ...currentNodeClass },
    pruned: { ...prunedNodes },
    explanation: `Algorithm finished. Optimal value: ${rootVal}`,
  });

  return steps;
}
