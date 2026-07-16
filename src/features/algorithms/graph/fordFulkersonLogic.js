/**
 * Pure generator logic for Ford-Fulkerson Algorithm (Edmonds-Karp using BFS)
 */

export function* fordFulkersonGenerator(nodes, edges, sourceNode, sinkNode) {
  if (!sourceNode || !sinkNode) return;

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const capacity = {};
  const flow = {};
  const adj = {};

  nodes.forEach(n => {
    capacity[n.id] = {};
    flow[n.id] = {};
    adj[n.id] = [];
    nodes.forEach(m => {
      capacity[n.id][m.id] = 0;
      flow[n.id][m.id] = 0;
    });
  });

  edges.forEach(e => {
    // Treat the graph as a directed flow network
    capacity[e.from][e.to] += (e.weight || 1);
    
    // Add forward and reverse edges to adjacency list for residual graph
    if (!adj[e.from].includes(e.to)) adj[e.from].push(e.to);
    if (!adj[e.to].includes(e.from)) adj[e.to].push(e.from);
  });

  let maxFlow = 0;
  let pathsFound = 0;

  yield {
    visitedNodes: new Set(),
    activePath: null,
    flowData: { flow: JSON.parse(JSON.stringify(flow)), capacity: JSON.parse(JSON.stringify(capacity)) },
    maxFlow,
    description: `Initializing Ford-Fulkerson (Edmonds-Karp). Source: ${nodeMap.get(sourceNode)?.label || sourceNode}, Sink: ${nodeMap.get(sinkNode)?.label || sinkNode}`,
      line: 0,
  };

  while (true) {
    // BFS to find an augmenting path
    const parent = {};
    const visited = new Set([sourceNode]);
    const queue = [sourceNode];
    
    let pathFound = false;

    while (queue.length > 0 && !pathFound) {
      const u = queue.shift();

      for (const v of adj[u]) {
        const residualCapacity = capacity[u][v] - flow[u][v];
        if (!visited.has(v) && residualCapacity > 0) {
          parent[v] = u;
          visited.add(v);
          queue.push(v);

          if (v === sinkNode) {
            pathFound = true;
            break;
          }
        }
      }
    }

    if (!pathFound) {
      break;
    }

    // Path found, trace it back
    let path = [];
    let curr = sinkNode;
    let minCapacity = Infinity;

    while (curr !== sourceNode) {
      const p = parent[curr];
      path.unshift({ from: p, to: curr });
      minCapacity = Math.min(minCapacity, capacity[p][curr] - flow[p][curr]);
      curr = p;
    }

    yield {
      visitedNodes: visited,
      activePath: path,
      flowData: { flow: JSON.parse(JSON.stringify(flow)), capacity: JSON.parse(JSON.stringify(capacity)) },
      maxFlow,
      description: `Found augmenting path with bottleneck capacity: ${minCapacity}`,
      line: 0,
    };

    // Augment flow
    for (const edge of path) {
      flow[edge.from][edge.to] += minCapacity;
      flow[edge.to][edge.from] -= minCapacity; // Residual flow
    }

    maxFlow += minCapacity;
    pathsFound++;

    yield {
      visitedNodes: new Set(),
      activePath: path,
      flowData: { flow: JSON.parse(JSON.stringify(flow)), capacity: JSON.parse(JSON.stringify(capacity)) },
      maxFlow,
      description: `Augmented flow by ${minCapacity}. Current max flow is ${maxFlow}.`,
      line: 0,
    };
  }

  yield {
    visitedNodes: new Set(),
    activePath: null,
    flowData: { flow, capacity },
    maxFlow,
    description: `No more augmenting paths. Algorithm complete. Maximum Flow = ${maxFlow} across ${pathsFound} paths.`,
      line: 0,
  };
}
