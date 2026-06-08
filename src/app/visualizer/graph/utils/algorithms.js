/**
 * Reusable pure frame generators for graph algorithms.
 * Each returns an array of frame snapshots for animation.
 */

/**
 * BFS Frame Generator
 * @param {Object} adj - Adjacency list { nodeId: [neighborId, ...] }
 * @param {string} startNode - Starting node ID
 */
export const bfsFrames = (adj, startNode) => {
  const frames = [];
  if (!startNode || !adj[startNode]) return frames;

  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);

  // Initial frame
  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    queue: [...queue],
    currentNode: startNode,
    description: `Starting BFS from node ${startNode}`,
  });

  while (queue.length > 0) {
    const u = queue.shift();
    
    frames.push({
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      queue: [...queue],
      currentNode: u,
      description: `Exploring neighbors of node ${u}`,
    });

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      const neighborId = typeof v === 'object' ? v.node : v;
      
      if (!visited.has(neighborId)) {
        frames.push({
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, neighborId]),
          activeEdge: { from: u, to: neighborId },
          queue: [...queue],
          currentNode: u,
          description: `Found unvisited neighbor ${neighborId}, adding to queue`,
        });

        visited.add(neighborId);
        queue.push(neighborId);

        frames.push({
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u]),
          activeEdge: null,
          queue: [...queue],
          currentNode: u,
          description: `Node ${neighborId} is now in queue`,
        });
      }
    }
    
    frames.push({
      visitedNodes: new Set(visited),
      visitingNodes: new Set(),
      activeEdge: null,
      queue: [...queue],
      currentNode: u,
      description: `Finished exploring node ${u}`,
    });
  }

  return frames;
};

/**
 * DFS Frame Generator
 * @param {Object} adj - Adjacency list
 * @param {string} startNode - Starting node ID
 */
export const dfsFrames = (adj, startNode) => {
  const frames = [];
  if (!startNode || !adj[startNode]) return frames;

  const visited = new Set();
  const stack = [startNode];

  const runDFS = (u, p = null) => {
    visited.add(u);
    
    frames.push({
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: p ? { from: p, to: u } : null,
      stack: [...stack],
      currentNode: u,
      description: `Visiting node ${u}`,
    });

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      const neighborId = typeof v === 'object' ? v.node : v;
      if (!visited.has(neighborId)) {
        stack.push(neighborId);
        runDFS(neighborId, u);
        
        // Backtracking frame
        frames.push({
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u]),
          activeEdge: null,
          stack: [...stack],
          currentNode: u,
          description: `Backtracking to node ${u}`,
        });
      }
    }
    stack.pop();
  };

  runDFS(startNode);
  
  frames.push({
    visitedNodes: new Set(visited),
    visitingNodes: new Set(),
    activeEdge: null,
    stack: [...stack],
    currentNode: null,
    description: `DFS traversal complete`,
  });

  return frames;
};

/**
 * Dijkstra Frame Generator
 * @param {Object} adj - Weighted adjacency list { nodeId: [{ node: neighborId, weight: w }, ...] }
 * @param {string} startNode - Starting node ID
 */
export const dijkstraFrames = (adj, startNode) => {
  const frames = [];
  if (!startNode || !adj[startNode]) return frames;

  const distances = {};
  const visited = new Set();
  const pq = [{ node: startNode, dist: 0 }];
  
  Object.keys(adj).forEach(node => {
    distances[node] = Infinity;
  });
  distances[startNode] = 0;

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    distances: { ...distances },
    currentNode: startNode,
    description: `Initializing Dijkstra: start node ${startNode} distance set to 0`,
  });

  while (pq.length > 0) {
    // Simple PQ: sort and shift
    pq.sort((a, b) => a.dist - b.dist);
    const { node: u, dist: d } = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);

    frames.push({
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      distances: { ...distances },
      currentNode: u,
      description: `Processing node ${u} with current shortest distance ${d}`,
    });

    const neighbors = adj[u] || [];
    for (const edge of neighbors) {
      const v = edge.node;
      const weight = edge.weight;

      if (!visited.has(v)) {
        const newDist = distances[u] + weight;
        
        frames.push({
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, v]),
          activeEdge: { from: u, to: v },
          distances: { ...distances },
          currentNode: u,
          description: `Checking edge ${u} -> ${v} (weight: ${weight})`,
        });

        if (newDist < distances[v]) {
          distances[v] = newDist;
          pq.push({ node: v, dist: newDist });

          frames.push({
            visitedNodes: new Set(visited),
            visitingNodes: new Set([u, v]),
            activeEdge: { from: u, to: v },
            distances: { ...distances },
            currentNode: u,
            description: `Relaxed distance to ${v}: ${newDist}`,
          });
        }
      }
    }
  }

  frames.push({
    visitedNodes: new Set(visited),
    visitingNodes: new Set(),
    activeEdge: null,
    distances: { ...distances },
    currentNode: null,
    description: `Dijkstra's algorithm complete`,
  });

  return frames;
};

/**
 * Floyd-Warshall Frame Generator
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All weighted edges
 */
export const floydWarshallFrames = (nodes, edges) => {
  const frames = [];
  const ids = nodes.map((node) => node.id);
  if (ids.length === 0) return frames;

  const labels = Object.fromEntries(nodes.map((node) => [node.id, node.label || node.id]));
  const dist = {};

  ids.forEach((from) => {
    dist[from] = {};
    ids.forEach((to) => {
      dist[from][to] = from === to ? 0 : Infinity;
    });
  });

  const cloneMatrix = () =>
    Object.fromEntries(ids.map((from) => [from, Object.fromEntries(ids.map((to) => [to, dist[from][to]]))]));

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    matrix: cloneMatrix(),
    matrixNodes: ids,
    description: "Initialize the distance matrix with 0 on the diagonal and infinity elsewhere.",
  });

  edges.forEach((edge) => {
    const weight = Number(edge.weight) || 0;
    if (!dist[edge.from] || !(edge.to in dist[edge.from])) return;
    dist[edge.from][edge.to] = Math.min(dist[edge.from][edge.to], weight);
    if (!edge.directed && dist[edge.to] && edge.from in dist[edge.to]) {
      dist[edge.to][edge.from] = Math.min(dist[edge.to][edge.from], weight);
    }

    frames.push({
      visitedNodes: new Set(),
      visitingNodes: new Set([edge.from, edge.to]),
      activeEdge: { from: edge.from, to: edge.to },
      matrix: cloneMatrix(),
      matrixNodes: ids,
      row: edge.from,
      col: edge.to,
      description: `Set direct distance ${labels[edge.from]} -> ${labels[edge.to]} to ${weight}.`,
    });
  });

  ids.forEach((k) => {
    frames.push({
      visitedNodes: new Set(),
      visitingNodes: new Set([k]),
      activeEdge: null,
      matrix: cloneMatrix(),
      matrixNodes: ids,
      intermediate: k,
      description: `Allow ${labels[k]} as an intermediate vertex.`,
    });

    ids.forEach((i) => {
      ids.forEach((j) => {
        const viaK =
          dist[i][k] === Infinity || dist[k][j] === Infinity
            ? Infinity
            : dist[i][k] + dist[k][j];
        const current = dist[i][j];
        const improves = viaK < current;

        frames.push({
          visitedNodes: new Set(),
          visitingNodes: new Set([i, k, j]),
          activeEdge: i !== k ? { from: i, to: k } : k !== j ? { from: k, to: j } : null,
          matrix: cloneMatrix(),
          matrixNodes: ids,
          intermediate: k,
          row: i,
          col: j,
          via: viaK,
          description: `Check ${labels[i]} -> ${labels[j]} through ${labels[k]}: ${formatDistance(current)} vs ${formatDistance(viaK)}.`,
        });

        if (improves) {
          dist[i][j] = viaK;
          frames.push({
            visitedNodes: new Set(),
            visitingNodes: new Set([i, k, j]),
            activeEdge: k !== j ? { from: k, to: j } : null,
            matrix: cloneMatrix(),
            matrixNodes: ids,
            intermediate: k,
            row: i,
            col: j,
            updatedCell: { row: i, col: j },
            description: `Update ${labels[i]} -> ${labels[j]} to ${viaK} using ${labels[k]}.`,
          });
        }
      });
    });
  });

  frames.push({
    visitedNodes: new Set(ids),
    visitingNodes: new Set(),
    activeEdge: null,
    matrix: cloneMatrix(),
    matrixNodes: ids,
    description: "Floyd-Warshall complete. The matrix now contains all-pairs shortest paths.",
  });

  return frames;
};

// === BELLMAN-FORD ADDED BELOW ===

export const bellmanFordFrames = (nodes, edges, startNode) => {
  const frames = [];
  if (!startNode || nodes.length === 0) return frames;

  const nodeIds = nodes.map((n) => n.id);
  const distances = {};
  nodeIds.forEach((id) => { distances[id] = id === startNode ? 0 : Infinity; });

  const fmt = (v) => (v === Infinity ? "221e" : v);

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    distances: { ...distances },
    updatedNode: null,
    phase: "relaxing",
    negativeCycle: false,
    description: `Initialize: distance to ${startNode} = 0, all others = 221e`,
  });

  const V = nodeIds.length;

  for (let pass = 1; pass <= V - 1; pass++) {
    let anyUpdate = false;
    for (const edge of edges) {
      const { from, to, weight } = edge;
      const w = Number(weight) || 0;
      frames.push({
        visitedNodes: new Set(),
        visitingNodes: new Set([from, to]),
        activeEdge: { from, to },
        distances: { ...distances },
        updatedNode: null,
        phase: "relaxing",
        negativeCycle: false,
        description: `Pass ${pass}: checking edge ${from} 2192 ${to} (weight: ${w})`,
      });
      if (distances[from] !== Infinity && distances[from] + w < distances[to]) {
        distances[to] = distances[from] + w;
        anyUpdate = true;
        frames.push({
          visitedNodes: new Set(),
          visitingNodes: new Set([from, to]),
          activeEdge: { from, to },
          distances: { ...distances },
          updatedNode: to,
          phase: "relaxing",
          negativeCycle: false,
          description: `Relaxed! dist[${to}] updated to ${distances[to]} via ${from}`,
        });
      }
    }
    if (!anyUpdate) {
      frames.push({ visitedNodes: new Set(nodeIds), visitingNodes: new Set(), activeEdge: null, distances: { ...distances }, updatedNode: null, phase: "done", negativeCycle: false, description: `Early termination after pass ${pass} 2014 shortest paths found.` });
      return frames;
    }
  }

  let negativeCycle = false;
  for (const edge of edges) {
    const { from, to, weight } = edge;
    const w = Number(weight) || 0;
    frames.push({ visitedNodes: new Set(), visitingNodes: new Set([from, to]), activeEdge: { from, to }, distances: { ...distances }, updatedNode: null, phase: "detecting", negativeCycle: false, description: `Negative cycle check: edge ${from} 2192 ${to}` });
    if (distances[from] !== Infinity && distances[from] + w < distances[to]) {
      negativeCycle = true;
      frames.push({ visitedNodes: new Set(), visitingNodes: new Set([from, to]), activeEdge: { from, to }, distances: { ...distances }, updatedNode: to, phase: "detecting", negativeCycle: true, description: `26a0Fe0f Negative cycle detected! Edge ${from} 2192 ${to} still improves distance.` });
      break;
    }
  }

  frames.push({ visitedNodes: new Set(nodeIds), visitingNodes: new Set(), activeEdge: null, distances: { ...distances }, updatedNode: null, phase: "done", negativeCycle, description: negativeCycle ? "26a0Fe0f Bellman-Ford complete 2014 Negative cycle detected!" : "2705 Bellman-Ford complete 2014 Shortest paths found." });
  return frames;
};

const formatDistance = (value) => (value === Infinity ? "Infinity" : value);

/**
 * A* Search Frame Generator
 * @param {Array} nodeList   - Array of { id, x, y } node objects
 * @param {Array} edgeList   - Array of { from, to, weight } edge objects
 * @param {string} startNode - Starting node ID
 * @param {string} goalNode  - Goal node ID
 */
export const aStarFrames = (nodeList, edgeList, startNode, goalNode) => {
  const frames = [];
  if (!startNode || !goalNode || startNode === goalNode) return frames;

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

  frames.push({
    visited: new Set(closedSet),
    openSet: new Set(openSet),
    current: startNode,
    path: [],
    ...cloneScores(),
    activeEdge: null,
    phase: "searching",
    goalNode,
    description: `A* initialized. Start: ${startNode}, Goal: ${goalNode}. g(${startNode})=0, f(${startNode})=${fScore[startNode].toFixed(1)}`,
  });

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
      frames.push({
        visited: new Set(closedSet),
        openSet: new Set(openSet),
        current,
        path: finalPath,
        ...cloneScores(),
        activeEdge: null,
        phase: "found",
        goalNode,
        description: `Goal ${goalNode} reached! Path: ${finalPath.join(" → ")} (cost: ${gScore[goalNode].toFixed(1)})`,
      });
      return frames;
    }

    openSet.delete(current);
    closedSet.add(current);

    frames.push({
      visited: new Set(closedSet),
      openSet: new Set(openSet),
      current,
      path: reconstructPath(current),
      ...cloneScores(),
      activeEdge: null,
      phase: "searching",
      goalNode,
      description: `Expanding node ${current} (f=${fScore[current].toFixed(1)})`,
    });

    const neighbors = adj[current] || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = gScore[current] + weight;

      frames.push({
        visited: new Set(closedSet),
        openSet: new Set(openSet),
        current,
        path: reconstructPath(current),
        ...cloneScores(),
        activeEdge: { from: current, to: neighbor },
        phase: "searching",
        goalNode,
        description: `Checking edge ${current} → ${neighbor} (weight: ${weight}, tentative g: ${tentativeG.toFixed(1)})`,
      });

      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, goalNode);
        openSet.add(neighbor);

        frames.push({
          visited: new Set(closedSet),
          openSet: new Set(openSet),
          current,
          path: reconstructPath(current),
          ...cloneScores(),
          activeEdge: { from: current, to: neighbor },
          phase: "searching",
          goalNode,
          description: `Updated ${neighbor}: g=${gScore[neighbor].toFixed(1)}, h=${heuristic(neighbor, goalNode).toFixed(1)}, f=${fScore[neighbor].toFixed(1)}`,
        });
      }
    }
  }

  // No path found
  frames.push({
    visited: new Set(closedSet),
    openSet: new Set(),
    current: null,
    path: [],
    ...cloneScores(),
    activeEdge: null,
    phase: "no_path",
    goalNode,
    description: `No path exists from ${startNode} to ${goalNode}.`,
  });

  return frames;
};

/**
 * Prim's Frame Generator
 * @param {Object} adj - Weighted adjacency list
 * @param {string} startNode - Starting node ID
 */
export const primFrames = (adj, startNode) => {
  const frames = [];
  if (!startNode || !adj[startNode]) return frames;

  const visited = new Set();
  const mstEdges = [];
  const pq = [{ node: startNode, weight: 0, from: null }];

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    mstEdges: [],
    description: `Starting Prim's algorithm from node ${startNode}`,
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.weight - b.weight);
    const { node: u, weight: w, from: p } = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);
    if (p !== null) mstEdges.push({ from: p, to: u });

    frames.push({
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: p ? { from: p, to: u } : null,
      mstEdges: [...mstEdges],
      description: `Adding node ${u} to MST${p ? ` via edge from ${p}` : ""}`,
    });

    const neighbors = adj[u] || [];
    for (const edge of neighbors) {
      const v = edge.node;
      if (!visited.has(v)) {
        pq.push({ node: v, weight: edge.weight, from: u });
        frames.push({
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, v]),
          activeEdge: { from: u, to: v },
          mstEdges: [...mstEdges],
          description: `Considering edge ${u} -> ${v} with weight ${edge.weight}`,
        });
      }
    }
  }

  frames.push({
    visitedNodes: new Set(visited),
    visitingNodes: new Set(),
    activeEdge: null,
    mstEdges: [...mstEdges],
    description: `Prim's algorithm complete. MST constructed.`,
  });

  return frames;
};

/**
 * Kruskal's Frame Generator
 * @param {Array} nodes - All node IDs
 * @param {Array} edges - All edges { from, to, weight }
 */
export const kruskalFrames = (nodes, edges) => {
  const frames = [];
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const parent = {};
  nodes.forEach(n => parent[n] = n);

  const find = (i) => {
    if (parent[i] === i) return i;
    return find(parent[i]);
  };

  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  };

  const mstEdges = [];

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    mstEdges: [],
    description: "Starting Kruskal's algorithm. Edges sorted by weight.",
  });

  for (const edge of sortedEdges) {
    frames.push({
      visitedNodes: new Set(),
      visitingNodes: new Set([edge.from, edge.to]),
      activeEdge: { from: edge.from, to: edge.to },
      mstEdges: [...mstEdges],
      description: `Checking smallest remaining edge: ${edge.from} - ${edge.to} (weight: ${edge.weight})`,
    });

    if (find(edge.from) !== find(edge.to)) {
      union(edge.from, edge.to);
      mstEdges.push({ from: edge.from, to: edge.to });
      frames.push({
        visitedNodes: new Set(),
        visitingNodes: new Set([edge.from, edge.to]),
        activeEdge: { from: edge.from, to: edge.to },
        mstEdges: [...mstEdges],
        description: `Edge ${edge.from} - ${edge.to} doesn't form a cycle. Adding to MST.`,
      });
    } else {
      frames.push({
        visitedNodes: new Set(),
        visitingNodes: new Set([edge.from, edge.to]),
        activeEdge: { from: edge.from, to: edge.to },
        mstEdges: [...mstEdges],
        description: `Edge ${edge.from} - ${edge.to} forms a cycle. Skipping.`,
      });
    }
  }

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    mstEdges: [...mstEdges],
    description: "Kruskal's algorithm complete. MST constructed.",
  });

  return frames;
};

/**
 * Topological Sort Frame Generator (Kahn's Algorithm)
 * @param {Object} adj - Adjacency list
 * @param {Array} nodes - All node IDs
 */
export const topologicalSortFrames = (adj, nodes) => {
  const frames = [];
  const inDegree = {};
  nodes.forEach(n => inDegree[n] = 0);

  Object.values(adj).forEach(neighbors => {
    neighbors.forEach(v => {
      const vId = typeof v === 'object' ? v.node : v;
      inDegree[vId] = (inDegree[vId] || 0) + 1;
    });
  });

  const queue = nodes.filter(n => inDegree[n] === 0);
  const result = [];

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(queue),
    activeEdge: null,
    queue: [...queue],
    result: [],
    description: "Initializing Topological Sort: computing in-degrees.",
  });

  while (queue.length > 0) {
    const u = queue.shift();
    result.push(u);

    frames.push({
      visitedNodes: new Set(result),
      visitingNodes: new Set([u]),
      activeEdge: null,
      queue: [...queue],
      result: [...result],
      description: `Processing node ${u} (in-degree 0), adding to result.`,
    });

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      const vId = typeof v === 'object' ? v.node : v;
      inDegree[vId]--;
      
      frames.push({
        visitedNodes: new Set(result),
        visitingNodes: new Set([u, vId]),
        activeEdge: { from: u, to: vId },
        queue: [...queue],
        result: [...result],
        description: `Decreasing in-degree of neighbor ${vId}.`,
      });

      if (inDegree[vId] === 0) {
        queue.push(vId);
        frames.push({
          visitedNodes: new Set(result),
          visitingNodes: new Set([vId]),
          activeEdge: null,
          queue: [...queue],
          result: [...result],
          description: `Node ${vId} now has in-degree 0, adding to queue.`,
        });
      }
    }
  }

  frames.push({
    visitedNodes: new Set(result),
    visitingNodes: new Set(),
    activeEdge: null,
    queue: [...queue],
    result: [...result],
    description: result.length === nodes.length ? "Topological Sort complete." : "Graph has a cycle! Topological Sort not possible for all nodes.",
  });

  return frames;
};

/**
 * Adjacency List Frame Generator
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All edges
 */
export const adjacencyListFrames = (nodes, edges) => {
  const frames = [];
  
  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Initializing Adjacency List: creating empty lists for each vertex.",
  });

  nodes.forEach(node => {
    const neighbors = edges
      .filter(e => e.from === node.id || (!e.directed && e.to === node.id))
      .map(e => ({ to: e.from === node.id ? e.to : e.from, edge: e }));

    frames.push({
      visitedNodes: new Set(),
      visitingNodes: new Set([node.id]),
      activeEdge: null,
      description: `Building list for Node ${node.label}.`,
    });

    neighbors.forEach(({ to, edge }) => {
      frames.push({
        visitedNodes: new Set(),
        visitingNodes: new Set([node.id, to]),
        activeEdge: { from: edge.from, to: edge.to },
        description: `Adding neighbor ${to} to Node ${node.label}'s list.`,
      });
    });
  });

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Adjacency List construction complete.",
  });

  return frames;
};

/**
 * Adjacency Matrix Frame Generator
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All edges
 */
export const adjacencyMatrixFrames = (nodes, edges) => {
  const frames = [];
  
  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Initializing Adjacency Matrix: creating V x V grid.",
  });

  nodes.forEach(row => {
    frames.push({
      visitedNodes: new Set(),
      visitingNodes: new Set([row.id]),
      activeEdge: null,
      description: `Checking connections for Node ${row.label} (Row ${row.label}).`,
    });

    nodes.forEach(col => {
      const edge = edges.find(e => 
        (e.from === row.id && e.to === col.id) || 
        (!e.directed && ((e.from === row.id && e.to === col.id) || (e.from === col.id && e.to === row.id)))
      );

      frames.push({
        visitedNodes: new Set(),
        visitingNodes: new Set([row.id, col.id]),
        activeEdge: edge ? { from: edge.from, to: edge.to } : null,
        description: `Checking connection between ${row.label} and ${col.label}: ${edge ? "Edge found" : "No edge"}.`,
      });
    });
  });

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Adjacency Matrix construction complete.",
  });

  return frames;
};