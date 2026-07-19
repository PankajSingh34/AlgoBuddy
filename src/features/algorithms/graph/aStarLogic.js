/**
 * Pure generator logic for A* Search Algorithm
 */

export function* aStarGenerator(nodeList, edgeList, startNode, goalNode) {
  if (!startNode || !goalNode || startNode === goalNode) return;

  // Build position map and weighted adjacency list (directed)
  const pos = {};
  nodeList.forEach((n) => { pos[n.id] = { x: n.x, y: n.y }; });

  const adj = {};
  nodeList.forEach((n) => { adj[n.id] = []; });
  edgeList.forEach((e) => {
    adj[e.from] = adj[e.from] || [];
    adj[e.from].push({ node: e.to, weight: Number(e.weight) || 1 });
  });

  const heuristic = (a, b) => {
    const pa = pos[a];
    const pb = pos[b];
    if (!pa || !pb) return 0;
    return Math.sqrt(Math.pow(pa.x - pb.x, 2) + Math.pow(pa.y - pb.y, 2));
  };

  const gScore = {};
  const fScore = {};
  const cameFrom = {};
  nodeList.forEach((n) => {
    gScore[n.id] = Infinity;
    fScore[n.id] = Infinity;
  });
  gScore[startNode] = 0;
  fScore[startNode] = heuristic(startNode, goalNode);

  const openSet = new Set([startNode]);
  const closedSet = new Set();

  const reconstructPath = (current) => {
    const path = [current];
    let c = current;
    while (cameFrom[c]) {
      c = cameFrom[c];
      path.unshift(c);
    }
    return path;
  };

  const cloneScores = () => ({
    gScore: { ...gScore },
    fScore: { ...fScore },
  });

  // State maps to distances in UI
  const buildDistances = () => {
    const d = {};
    for (const k in gScore) {
      d[k] = gScore[k] === Infinity ? Infinity : Number(gScore[k].toFixed(1));
    }
    return d;
  };

  yield {
    visitedNodes: new Set(closedSet),
    visitingNodes: new Set(openSet),
    currentNode: startNode,
    path: [],
    distances: buildDistances(),
    activeEdge: null,
    phase: "searching",
    goalNode,
    description: `A* initialized. Start: ${startNode}, Goal: ${goalNode}. g(${startNode})=0, f(${startNode})=${fScore[startNode].toFixed(1)}`,
    line: 5,
  };

  while (openSet.size > 0) {
    // Pick node with lowest fScore in open set
    let current = null;
    let lowestF = Infinity;
    for (const n of openSet) {
      if (fScore[n] < lowestF) {
        lowestF = fScore[n];
        current = n;
      }
    }

    if (current === goalNode) {
      const finalPath = reconstructPath(current);
      yield {
        visitedNodes: new Set(closedSet),
        visitingNodes: new Set(openSet),
        currentNode: current,
        path: finalPath,
        distances: buildDistances(),
        activeEdge: null,
        phase: "found",
        goalNode,
        result: finalPath,
        description: `Goal ${goalNode} reached! Path: ${finalPath.join(" → ")} (cost: ${gScore[goalNode].toFixed(1)})`,
        line: 8,
      };
      return;
    }

    openSet.delete(current);
    closedSet.add(current);

    yield {
      visitedNodes: new Set(closedSet),
      visitingNodes: new Set(openSet),
      currentNode: current,
      path: reconstructPath(current),
      distances: buildDistances(),
      activeEdge: null,
      phase: "searching",
      goalNode,
      description: `Expanding node ${current} (f=${fScore[current].toFixed(1)})`,
      line: 7,
    };

    const neighbors = adj[current] || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = gScore[current] + weight;

      yield {
        visitedNodes: new Set(closedSet),
        visitingNodes: new Set(openSet),
        currentNode: current,
        path: reconstructPath(current),
        distances: buildDistances(),
        activeEdge: { from: current, to: neighbor },
        phase: "searching",
        goalNode,
        description: `Checking edge ${current} → ${neighbor} (weight: ${weight}, tentative g: ${tentativeG.toFixed(1)})`,
        line: 9,
      };

      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, goalNode);
        openSet.add(neighbor);

        yield {
          visitedNodes: new Set(closedSet),
          visitingNodes: new Set(openSet),
          currentNode: current,
          path: reconstructPath(current),
          distances: buildDistances(),
          activeEdge: { from: current, to: neighbor },
          phase: "searching",
          goalNode,
          description: `Updated ${neighbor}: g=${gScore[neighbor].toFixed(1)}, h=${heuristic(neighbor, goalNode).toFixed(1)}, f=${fScore[neighbor].toFixed(1)}`,
          line: 11,
        };
      }
    }
  }

  // No path found
  yield {
    visitedNodes: new Set(closedSet),
    visitingNodes: new Set(),
    currentNode: null,
    path: [],
    distances: buildDistances(),
    activeEdge: null,
    phase: "no_path",
    goalNode,
    description: `No path exists from ${startNode} to ${goalNode}.`,
    line: 6,
  };
}
