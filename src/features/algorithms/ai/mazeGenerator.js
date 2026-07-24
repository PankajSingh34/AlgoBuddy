export function generateRecursiveBacktrackerMaze(gridSize, start, goal) {
  const walls = new Set();
  
  // Initialize grid with all walls
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      walls.add(`${r},${c}`);
    }
  }

  // Directions for moving 2 steps (to leave a wall between paths)
  const dirs = [
    { dr: -2, dc: 0 }, // Up
    { dr: 2, dc: 0 },  // Down
    { dr: 0, dc: -2 }, // Left
    { dr: 0, dc: 2 }   // Right
  ];

  const inBounds = (r, c) => r >= 0 && r < gridSize && c >= 0 && c < gridSize;

  const carvePath = (r, c) => {
    walls.delete(`${r},${c}`);
    
    // Shuffle directions for randomness
    const shuffledDirs = [...dirs].sort(() => Math.random() - 0.5);

    for (const { dr, dc } of shuffledDirs) {
      const nr = r + dr;
      const nc = c + dc;
      
      // If the target cell is valid and still a wall, carve a path
      if (inBounds(nr, nc) && walls.has(`${nr},${nc}`)) {
        // Carve the cell in between
        walls.delete(`${r + dr / 2},${c + dc / 2}`);
        // Recursively carve the next cell
        carvePath(nr, nc);
      }
    }
  };

  // Start carving from a random even coordinate
  let startR = Math.floor(Math.random() * (gridSize / 2)) * 2;
  let startC = Math.floor(Math.random() * (gridSize / 2)) * 2;
  
  if (startR >= gridSize) startR = 0;
  if (startC >= gridSize) startC = 0;

  carvePath(startR, startC);

  // Ensure the actual `start` and `goal` cells provided by the user are always empty
  // and connected to the adjacent path if they were stuck behind walls.
  const connectNode = (r, c) => {
    walls.delete(`${r},${c}`);
    // Check if it's trapped (all 4 neighbors are walls or out of bounds)
    const neighbors = [
      { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
    ];
    
    const isTrapped = neighbors.every(({ dr, dc }) => {
      const nr = r + dr, nc = c + dc;
      return !inBounds(nr, nc) || walls.has(`${nr},${nc}`);
    });

    if (isTrapped) {
      // Carve a path to the first valid neighbor
      for (const { dr, dc } of neighbors) {
        let nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc)) {
           walls.delete(`${nr},${nc}`);
           break;
        }
      }
    }
  };

  connectNode(start.row, start.col);
  connectNode(goal.row, goal.col);

  return walls;
}
