export function* unionFindGenerator(nodes) {
  const parent = {};

  nodes.forEach((node) => {
    parent[node.id] = node.id;
  });

yield {
  nodes: nodes,
  edges: [],
  parent: { ...parent },
  message: "Initial state",
};
  const find = (x) => {
    if (parent[x] === x) return x;
    return find(parent[x]);
  };

  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);

    if (rootA !== rootB) {
      parent[rootA] = rootB;

      return {
        parent: { ...parent },
        message: `Union ${a} and ${b}`,
      };
    }

    return null;
  };

  const ids = nodes.map((n) => n.id);

  for (let i = 0; i < ids.length - 1; i++) {
    const frame = union(ids[i], ids[i + 1]);

    if (frame) {
      yield frame;
    }
  }
}