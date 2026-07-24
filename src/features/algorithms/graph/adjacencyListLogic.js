/**
 * Adjacency List Generator
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All edges
 */
export function* adjacencyListGenerator(nodes, edges) {
  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Initializing Adjacency List: creating empty lists for each vertex.",
  };

  for (const node of nodes) {
    const neighbors = edges
      .filter(e => e.from === node.id || (!e.directed && e.to === node.id))
      .map(e => ({ to: e.from === node.id ? e.to : e.from, edge: e }));

    yield {
      visitedNodes: new Set(),
      visitingNodes: new Set([node.id]),
      activeEdge: null,
      description: `Building list for Node ${node.label || node.id}.`,
    };

    for (const { to, edge } of neighbors) {
      yield {
        visitedNodes: new Set(),
        visitingNodes: new Set([node.id, to]),
        activeEdge: { from: edge.from, to: edge.to },
        description: `Adding neighbor ${to} to Node ${node.label || node.id}'s list.`,
      };
    }
  }

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Adjacency List construction complete.",
  };
}
