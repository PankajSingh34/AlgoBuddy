/**
 * Adjacency Matrix Generator
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All edges
 */
export function* adjacencyMatrixGenerator(nodes, edges) {
  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Initializing Adjacency Matrix: creating V x V grid.",
  };

  for (const row of nodes) {
    yield {
      visitedNodes: new Set(),
      visitingNodes: new Set([row.id]),
      activeEdge: null,
      description: `Checking connections for Node ${row.label || row.id} (Row ${row.label || row.id}).`,
    };

    for (const col of nodes) {
      const edge = edges.find(e => 
        (e.from === row.id && e.to === col.id) || 
        (!e.directed && ((e.from === row.id && e.to === col.id) || (e.from === col.id && e.to === row.id)))
      );

      yield {
        visitedNodes: new Set(),
        visitingNodes: new Set([row.id, col.id]),
        activeEdge: edge ? { from: edge.from, to: edge.to } : null,
        description: `Checking connection between ${row.label || row.id} and ${col.label || col.id}: ${edge ? "Edge found" : "No edge"}.`,
      };
    }
  }

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Adjacency Matrix construction complete.",
  };
}
