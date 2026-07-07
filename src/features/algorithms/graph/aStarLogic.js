/**
 * Pure generator logic for A* Search Algorithm
 */

export function* aStarGenerator(nodes, edges, startNode, goalNode) {
  if (!startNode || !goalNode) return;

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const adj = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.from].push({ node: e.to, weight: e.weight ?? 1 });
    if (!e.directed) adj[e.to].push({ node: e.from, weight: e.weight ?? 1 });
  });

  // Heuristic: Euclidean distance
  const h = (nodeId) => {
    const n1 = nodeMap.get(nodeId);
    const n2 = nodeMap.get(goalNode);
    if (!n1 || !n2) return 0;
    return Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
  };

  const openSet = new Set([startNode]);
  const visited = new Set();
  const cameFrom = {};
  
  const gScore = {};
  const fScore = {};
  nodes.forEach(n => {
    gScore[n.id] = Infinity;
    fScore[n.id] = Infinity;
  });
  
  gScore[startNode] = 0;
  fScore[startNode] = h(startNode);

  yield {
    openSet: new Set(openSet),
    visitingNodes: new Set(openSet),
    visited: new Set(visited),
    visitedNodes: new Set(visited),
    phase: "searching",
    distances: { ...gScore },
    currentNode: startNode,
    description: `Initializing A*: starting at ${nodeMap.get(startNode)?.label || startNode}`,
  };

  while (openSet.size > 0) {
    let current = null;
    let minF = Infinity;
    for (const nodeId of openSet) {
      if (fScore[nodeId] < minF) {
        minF = fScore[nodeId];
        current = nodeId;
      }
    }

    if (current === goalNode) {
      const path = [current];
      let curr = current;
      while (cameFrom[curr]) {
        curr = cameFrom[curr];
        path.unshift(curr);
      }
      yield {
        openSet: new Set(openSet),
        visitingNodes: new Set(openSet),
        visited: new Set(visited),
        visitedNodes: new Set(visited),
        phase: "found",
        aStarPath: path,
        mstEdges: path.map((n, i) => i < path.length - 1 ? { from: path[i], to: path[i+1] } : null).filter(Boolean),
        distances: { ...gScore },
        currentNode: current,
        description: `Goal reached! Shortest path found.`,
      };
      return;
    }

    openSet.delete(current);
    visited.add(current);

    yield {
      openSet: new Set(openSet),
      visitingNodes: new Set(openSet),
      visited: new Set(visited),
      visitedNodes: new Set(visited),
      phase: "searching",
      activeEdge: null,
      distances: { ...gScore },
      currentNode: current,
      description: `Evaluating node ${nodeMap.get(current)?.label || current} with f-score ${minF.toFixed(1)}`,
    };

    const neighbors = adj[current] || [];
    for (const edge of neighbors) {
      const neighbor = edge.node;
      if (visited.has(neighbor)) continue;

      const tentativeG = gScore[current] + edge.weight;

      yield {
        openSet: new Set(openSet),
        visitingNodes: new Set(openSet),
        visited: new Set(visited),
        visitedNodes: new Set(visited),
        phase: "searching",
        activeEdge: { from: current, to: neighbor },
        distances: { ...gScore },
        currentNode: current,
        description: `Checking edge to ${nodeMap.get(neighbor)?.label || neighbor}`,
      };

      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + h(neighbor);
        
        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }

        yield {
          openSet: new Set(openSet),
          visitingNodes: new Set(openSet),
          visited: new Set(visited),
          visitedNodes: new Set(visited),
          phase: "searching",
          activeEdge: { from: current, to: neighbor },
          distances: { ...gScore },
          currentNode: current,
          description: `Updated ${nodeMap.get(neighbor)?.label || neighbor}: g=${tentativeG.toFixed(1)}, f=${fScore[neighbor].toFixed(1)}`,
        };
      }
    }
  }

  yield {
    openSet: new Set(openSet),
    visitingNodes: new Set(openSet),
    visited: new Set(visited),
    visitedNodes: new Set(visited),
    phase: "not_found",
    distances: { ...gScore },
    currentNode: null,
    description: `Open set empty. Goal not reachable.`,
  };
}
