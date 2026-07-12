/**
 * Reusable pure frame generators for graph algorithms.
 * Note: BFS, DFS, Dijkstra, Bellman-Ford, and Floyd-Warshall have been migrated to src/features/algorithms/graph/
 */

const formatDistance = (value) => (value === Infinity ? "Infinity" : value);



/**
 * Note: Prim, Kruskal, Topological Sort, Kosaraju, and Tarjan algorithms
 * have been migrated to src/features/algorithms/graph/
 */

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