export function generateMCTSSteps(simSize, exploreC, maxIterations = 50) {
  const steps = [];

  const randOutcome = () => (Math.random() < 0.5 ? 1 : 0);

  const uct = (node, parentVisits, c) => {
    if (node.visits === 0) return Infinity;
    const exploitation = node.wins / node.visits;
    const exploration = c * Math.sqrt(Math.log(parentVisits) / node.visits);
    return exploitation + exploration;
  };

  const select = (nodes, c) => {
    let path = [0];
    let cur = nodes[0];
    while (cur.children && cur.children.length > 0) {
      const parentVisits = cur.visits || 1;
      const childNodes = cur.children.map((id) => nodes[id]);
      let best = childNodes[0];
      for (const ch of childNodes) {
        if (uct(ch, parentVisits, c) > uct(best, parentVisits, c)) {
          best = ch;
        }
      }
      path.push(best.id);
      cur = best;
    }
    return path;
  };

  // Basic tree structure
  const makeInitialTree = () => {
    return new Array(15).fill(null).map((_, i) => ({
      id: i,
      visits: 0,
      wins: 0,
      children: i <= 6 ? [2 * i + 1, 2 * i + 2] : [],
    }));
  };

  let tree = makeInitialTree();
  let stepCount = 0;

  // Add initial state
  steps.push({
    tree: JSON.parse(JSON.stringify(tree)),
    highlightPath: [],
    stepCount,
    stepExplanation: "MCTS starting...",
  });

  for (let iter = 0; iter < maxIterations; iter++) {
    const nodes = tree.map((n) => ({ ...n }));
    stepCount++;
    let lastPath = [];

    for (let s = 0; s < simSize; s++) {
      const path = select(nodes, exploreC);
      const outcome = randOutcome();
      // Backpropagate
      for (const id of path) {
        nodes[id].visits += 1;
        nodes[id].wins += outcome;
      }
      lastPath = path;
    }

    tree = nodes;

    steps.push({
      tree: JSON.parse(JSON.stringify(tree)),
      highlightPath: lastPath,
      stepCount,
      stepExplanation: \`Iteration #\${stepCount}: Performed \${simSize} simulations. The last path selected via UCT was: \${lastPath.join(" → ")}.\`,
    });
  }

  return steps;
}
