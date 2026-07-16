/**
 * Pure generator logic for Kosaraju's Algorithm (Strongly Connected Components)
 */

export function* kosarajuGenerator(adj, nodes) {
  const nodeIds = nodes.map(n => n.id);
  if (nodeIds.length === 0) return;

  const stack = [];
  const visited = new Set();
  
  // Phase 1: Standard DFS to fill the stack based on finishing times
  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    stack: [...stack],
    sccs: [],
    phase: "Pass 1: DFS",
    description: "Phase 1: Run DFS to compute finishing times.",
      line: 0,
  };

  function* dfs1(u) {
    visited.add(u);
    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      stack: [...stack],
      sccs: [],
      phase: "Pass 1: DFS",
      description: `Visiting node ${u}`,
      line: 0,
    };

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      const neighborId = typeof v === 'object' ? v.node : v;
      if (!visited.has(neighborId)) {
        yield {
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, neighborId]),
          activeEdge: { from: u, to: neighborId },
          stack: [...stack],
          sccs: [],
          phase: "Pass 1: DFS",
          description: `Traversing edge ${u} → ${neighborId}`,
      line: 0,
        };
        yield* dfs1(neighborId);
      }
    }
    stack.push(u);
    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      stack: [...stack],
      sccs: [],
      phase: "Pass 1: DFS",
      description: `Finished ${u}, pushing to stack`,
      line: 0,
    };
  }

  for (const id of nodeIds) {
    if (!visited.has(id)) {
      yield* dfs1(id);
    }
  }

  // Phase 2: Transpose the graph
  const revAdj = {};
  nodeIds.forEach(id => { revAdj[id] = []; });
  
  for (const u in adj) {
    for (const v of adj[u]) {
      const vId = typeof v === 'object' ? v.node : v;
      revAdj[vId].push(u); // Reversing edge direction
    }
  }

  yield {
    visitedNodes: new Set(), // clear visited for phase 2
    visitingNodes: new Set(),
    activeEdge: null,
    stack: [...stack],
    sccs: [],
    phase: "Pass 2: Transpose Graph",
    description: "Graph edges transposed. Now popping from stack for Phase 2 DFS.",
      line: 0,
  };

  visited.clear();
  const sccs = [];

  function* dfs2(u, currentScc) {
    visited.add(u);
    currentScc.push(u);
    
    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      stack: [...stack],
      sccs: [...sccs, [...currentScc]],
      phase: "Pass 2: SCC DFS",
      description: `Visiting ${u} in reversed graph, adding to current SCC`,
      line: 0,
    };

    const neighbors = revAdj[u] || [];
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        yield {
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, neighborId]),
          activeEdge: { from: u, to: neighborId }, // active edge reversed intuitively
          stack: [...stack],
          sccs: [...sccs, [...currentScc]],
          phase: "Pass 2: SCC DFS",
          description: `Traversing reversed edge ${u} → ${neighborId}`,
      line: 0,
        };
        yield* dfs2(neighborId, currentScc);
      }
    }
  }

  while (stack.length > 0) {
    const u = stack.pop();
    
    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      stack: [...stack],
      sccs: [...sccs],
      phase: "Pass 2: Pop Stack",
      description: `Popped ${u} from stack`,
      line: 0,
    };

    if (!visited.has(u)) {
      const currentScc = [];
      yield* dfs2(u, currentScc);
      sccs.push(currentScc);
      
      yield {
        visitedNodes: new Set(visited),
        visitingNodes: new Set(),
        activeEdge: null,
        stack: [...stack],
        sccs: [...sccs],
        phase: "Pass 2: SCC Found",
        description: `Found SCC: [${currentScc.join(', ')}]`,
      line: 0,
      };
    }
  }

  yield {
    visitedNodes: new Set(visited),
    visitingNodes: new Set(),
    activeEdge: null,
    stack: [],
    sccs: [...sccs],
    phase: "Done",
    description: `Kosaraju's algorithm complete. Found ${sccs.length} SCCs.`,
      line: 0,
  };
}
