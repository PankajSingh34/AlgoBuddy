/**
 * Pure generator logic for Dijkstra's Algorithm
 */

export function* dijkstraGenerator(adj, startNode, targetNode = null) {
  if (!startNode || !adj[startNode]) return;

  const distances = {};
  const visited = new Set();
  const pq = [{ node: startNode, dist: 0 }];
  
  Object.keys(adj).forEach(node => {
    distances[node] = Infinity;
  });
  distances[startNode] = 0;

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    distances: { ...distances },
    pq: [...pq],
    currentNode: startNode,
    description: `Initializing Dijkstra: start node ${startNode} distance set to 0`,
    line: 3,
  };

  while (pq.length > 0) {
    // Simple PQ: sort and shift
    pq.sort((a, b) => a.dist - b.dist);
    const { node: u, dist: d } = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);

    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      distances: { ...distances },
      pq: [...pq],
      currentNode: u,
      description: `Processing node ${u} with current shortest distance ${d}`,
      line: 6,
    };

    if (targetNode && String(u) === String(targetNode)) {
      yield {
        visitedNodes: new Set(visited),
        visitingNodes: new Set(),
        activeEdge: null,
        distances: { ...distances },
        pq: [...pq],
        currentNode: u,
        description: `Target node ${u} reached! Shortest path distance is ${d}.`,
        line: 6,
      };
      return; // Early exit
    }

    const neighbors = adj[u] || [];
    for (const edge of neighbors) {
      const v = edge.node;
      const weight = Number(edge.weight);

      if (!visited.has(v)) {
        const newDist = distances[u] + weight;
        
        yield {
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, v]),
          activeEdge: { from: u, to: v },
          distances: { ...distances },
          pq: [...pq],
          currentNode: u,
          description: `Checking edge ${u} -> ${v} (weight: ${weight})`,
          line: 8,
        };

        if (newDist < distances[v]) {
          distances[v] = newDist;
          pq.push({ node: v, dist: newDist });

          yield {
            visitedNodes: new Set(visited),
            visitingNodes: new Set([u, v]),
            activeEdge: { from: u, to: v },
            distances: { ...distances },
            pq: [...pq],
            currentNode: u,
            description: `Relaxed distance to ${v}: ${newDist}`,
            line: 10,
          };
        }
      }
    }
  }

  yield {
    visitedNodes: new Set(visited),
    visitingNodes: new Set(),
    activeEdge: null,
    distances: { ...distances },
    pq: [],
    currentNode: null,
    description: (targetNode && !visited.has(targetNode))
      ? `Target node ${targetNode} is unreachable.`
      : `Dijkstra's algorithm complete`,
    line: 5,
  };
}
