"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, PenLine, Target, ShieldAlert, Trash2 } from "lucide-react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

const pointKey = (row, col) => `${row},${col}`;
const parsePointKey = (key) => {
  const [row, col] = key.split(",").map(Number);
  return { row, col };
};
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const clampPoint = (point, size) => ({ row: clamp(point.row, 0, size - 1), col: clamp(point.col, 0, size - 1) });

const heuristicDistance = (a, b, heuristic) => {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  if (heuristic === "euclidean") return Math.sqrt(dr * dr + dc * dc);
  if (heuristic === "chebyshev") return Math.max(dr, dc);
  return dr + dc;
};

const reconstructPath = (cameFrom, currentKey) => {
  const path = [currentKey];
  let cursor = currentKey;
  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor);
    path.push(cursor);
  }
  return path.reverse();
};

const getNeighbors = (row, col, size) => {
  const neighbors = [];
  if (row > 0) neighbors.push({ row: row - 1, col });
  if (row < size - 1) neighbors.push({ row: row + 1, col });
  if (col > 0) neighbors.push({ row, col: col - 1 });
  if (col < size - 1) neighbors.push({ row, col: col + 1 });
  return neighbors;
};

const AStarAnimation = () => {
  const initialSize = loadFromStorage("astar-grid-size", 10);
  const [gridSize, setGridSize] = useState(initialSize);
  const [heuristic, setHeuristic] = useState(() => loadFromStorage("astar-heuristic", "manhattan"));
  const [editMode, setEditMode] = useState("wall");
  const [start, setStart] = useState({ row: 0, col: 0 });
  const [goal, setGoal] = useState({ row: initialSize - 1, col: initialSize - 1 });
  const [walls, setWalls] = useState(() => new Set());
  const [currentFrame, setCurrentFrame] = useState(null);
  const [message, setMessage] = useState("Build a maze, choose a heuristic, and press Go.");
  const [stepExplanation, setStepExplanation] = useState("Choose wall, start, or goal editing mode before running the search.");
  const [isAnimating, setIsAnimating] = useState(false);
  const [status, setStatus] = useState("idle");

  const animationRef = useRef(null);
  const framesRef = useRef([]);
  const frameIndexRef = useRef(0);

  const {
    isPaused,
    isPausedRef,
    speed,
    speedRef,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
  } = usePlayback(() => loadFromStorage("astar-speed", 1));

  useEffect(() => saveToStorage("astar-grid-size", gridSize), [gridSize]);
  useEffect(() => saveToStorage("astar-heuristic", heuristic), [heuristic]);
  useEffect(() => saveToStorage("astar-speed", speed), [speed]);

  useEffect(() => {
    setStart((current) => clampPoint(current, gridSize));
    setGoal((current) => {
      const clamped = clampPoint(current, gridSize);
      if (clamped.row === 0 && clamped.col === 0 && gridSize > 1) {
        return { row: gridSize - 1, col: gridSize - 1 };
      }
      return clamped;
    });
    setWalls((current) => {
      const next = new Set();
      current.forEach((cell) => {
        const { row, col } = parsePointKey(cell);
        if (row < gridSize && col < gridSize) next.add(cell);
      });
      return next;
    });
  }, [gridSize]);

  const resetBoard = useCallback(() => {
    clearTimeout(animationRef.current);
    framesRef.current = [];
    frameIndexRef.current = 0;
    setCurrentFrame(null);
    setIsAnimating(false);
    setStatus("idle");
    setMessage("Board reset. Add walls or run a new search.");
    setStepExplanation("The board is clear and ready for a new route.");
    setStart({ row: 0, col: 0 });
    setGoal({ row: gridSize - 1, col: gridSize - 1 });
    setWalls(new Set());
  }, [gridSize]);

  useVisualizerReset(resetBoard);

  const buildFrames = useCallback(() => {
    const startKey = pointKey(start.row, start.col);
    const goalKey = pointKey(goal.row, goal.col);
    const wallSet = new Set([...walls].filter((cell) => cell !== startKey && cell !== goalKey));
    const openSet = new Set([startKey]);
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map([[startKey, 0]]);
    const fScore = new Map([[startKey, heuristicDistance(start, goal, heuristic)]]);
    const frames = [];

    const capture = (messageText, detailText, currentKey = null, path = [], goalReached = false) => {
      const currentPoint = currentKey ? parsePointKey(currentKey) : null;
      const currentG = currentKey ? gScore.get(currentKey) ?? 0 : 0;
      const currentH = currentPoint ? heuristicDistance(currentPoint, goal, heuristic) : 0;
      const currentF = currentKey ? fScore.get(currentKey) ?? currentG + currentH : 0;
      frames.push({
        message: messageText,
        detail: detailText,
        currentKey,
        open: [...openSet],
        closed: [...closedSet],
        path,
        g: currentG,
        h: currentH,
        f: currentF,
        goalReached,
      });
    };

    const pickNext = () => {
      let bestKey = null;
      for (const candidateKey of openSet) {
        if (!bestKey) {
          bestKey = candidateKey;
          continue;
        }

        const candidateF = fScore.get(candidateKey) ?? Infinity;
        const bestF = fScore.get(bestKey) ?? Infinity;
        if (candidateF !== bestF) {
          if (candidateF < bestF) bestKey = candidateKey;
          continue;
        }

        const candidatePoint = parsePointKey(candidateKey);
        const bestPoint = parsePointKey(bestKey);
        const candidateH = heuristicDistance(candidatePoint, goal, heuristic);
        const bestH = heuristicDistance(bestPoint, goal, heuristic);
        if (candidateH !== bestH) {
          if (candidateH < bestH) bestKey = candidateKey;
          continue;
        }

        const candidateG = gScore.get(candidateKey) ?? Infinity;
        const bestG = gScore.get(bestKey) ?? Infinity;
        if (candidateG !== bestG) {
          if (candidateG < bestG) bestKey = candidateKey;
          continue;
        }

        if (candidateKey < bestKey) bestKey = candidateKey;
      }
      return bestKey;
    };

    capture(
      "A* is ready. The frontier begins at the start node.",
      "The priority of each node is computed with f = g + h."
    );

    while (openSet.size > 0) {
      const currentKey = pickNext();
      const currentPoint = parsePointKey(currentKey);

      if (currentKey === goalKey) {
        const path = reconstructPath(cameFrom, currentKey);
        capture(
          "Goal reached. Reconstructing the shortest route.",
          "The goal node was removed from the open set with the best score.",
          currentKey,
          path,
          true
        );
        return { frames, found: true };
      }

      openSet.delete(currentKey);
      closedSet.add(currentKey);

      capture(
        `Expanding node (${currentPoint.row + 1}, ${currentPoint.col + 1}).`,
        `Selected node has g = ${gScore.get(currentKey) ?? 0}, h = ${heuristicDistance(currentPoint, goal, heuristic).toFixed(2)}, and f = ${(fScore.get(currentKey) ?? 0).toFixed(2)}.`,
        currentKey
      );

      for (const neighbor of getNeighbors(currentPoint.row, currentPoint.col, gridSize)) {
        const neighborKey = pointKey(neighbor.row, neighbor.col);
        if (wallSet.has(neighborKey) || closedSet.has(neighborKey)) continue;

        const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
        const knownG = gScore.get(neighborKey) ?? Infinity;
        if (tentativeG < knownG) {
          cameFrom.set(neighborKey, currentKey);
          gScore.set(neighborKey, tentativeG);
          const nextH = heuristicDistance(neighbor, goal, heuristic);
          fScore.set(neighborKey, tentativeG + nextH);
          openSet.add(neighborKey);
          capture(
            `Updated neighbor (${neighbor.row + 1}, ${neighbor.col + 1}).`,
            `New values: g = ${tentativeG}, h = ${nextH.toFixed(2)}, f = ${(tentativeG + nextH).toFixed(2)}.`,
            currentKey
          );
        }
      }
    }

    capture(
      "No path was found.",
      "The open set is empty, so the goal cannot be reached with the current walls."
    );

    return { frames, found: false };
  }, [goal, gridSize, heuristic, start, walls]);

  const runPlayback = useCallback(() => {
    if (isPausedRef.current) {
      animationRef.current = setTimeout(runPlayback, 120);
      return;
    }

    const frame = framesRef.current[frameIndexRef.current];
    if (!frame) {
      setIsAnimating(false);
      return;
    }

    frameIndexRef.current += 1;
    setCurrentFrame(frame);
    setMessage(frame.message);
    setStepExplanation(frame.detail);
    setStatus(frame.goalReached ? "success" : frame.message.startsWith("No path") ? "error" : "running");

    animationRef.current = setTimeout(runPlayback, Math.max(70, 1000 / Math.max(speedRef.current, 0.5)));
  }, [isPausedRef, speedRef]);

  useEffect(() => () => clearTimeout(animationRef.current), []);

  const handleGo = useCallback((event) => {
    event.preventDefault();
    if (isAnimating) return;

    clearTimeout(animationRef.current);
    const { frames, found } = buildFrames();
    framesRef.current = frames;
    frameIndexRef.current = 0;
    setCurrentFrame(null);
    setIsAnimating(true);
    setStatus("running");
    setMessage("Running A* Search...");
    setStepExplanation(found ? "The search will now animate from the first frame to the shortest path." : "The search will animate until it determines there is no valid path.");
    runPlayback();
  }, [buildFrames, isAnimating, runPlayback]);

  const handleReset = useCallback(() => {
    resetBoard();
    setMessage("Visualizer reset.");
  }, [resetBoard]);

  const handleCellClick = useCallback((row, col) => {
    if (isAnimating) return;

    const clickedKey = pointKey(row, col);
    const startKey = pointKey(start.row, start.col);
    const goalKey = pointKey(goal.row, goal.col);

    if (editMode === "wall") {
      if (clickedKey === startKey || clickedKey === goalKey) return;
      setWalls((current) => {
        const next = new Set(current);
        if (next.has(clickedKey)) next.delete(clickedKey);
        else next.add(clickedKey);
        return next;
      });
      return;
    }

    if (editMode === "start") {
      if (clickedKey === goalKey) return;
      setStart({ row, col });
      setWalls((current) => {
        const next = new Set(current);
        next.delete(clickedKey);
        return next;
      });
      return;
    }

    if (clickedKey === startKey) return;
    setGoal({ row, col });
    setWalls((current) => {
      const next = new Set(current);
      next.delete(clickedKey);
      return next;
    });
  }, [editMode, goal.col, goal.row, isAnimating, start.col, start.row]);

  const renderedFrame = currentFrame ?? {
    open: [pointKey(start.row, start.col)],
    closed: [],
    path: [],
    currentKey: pointKey(start.row, start.col),
    g: 0,
    h: heuristicDistance(start, goal, heuristic),
    f: heuristicDistance(start, goal, heuristic),
    goalReached: false,
  };

  const openSet = new Set(renderedFrame.open);
  const closedSet = new Set(renderedFrame.closed);
  const pathSet = new Set(renderedFrame.path);

  const statusClass =
    status === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : status === "error"
      ? "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200"
      : status === "running"
      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";

  const modeButtons = [
    { id: "wall", label: "Draw Walls", icon: PenLine, className: "bg-primary text-white border-primary" },
    { id: "start", label: "Move Start", icon: Target, className: "bg-emerald-600 text-white border-emerald-600" },
    { id: "goal", label: "Move Goal", icon: ShieldAlert, className: "bg-rose-600 text-white border-rose-600" },
  ];

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-sans">
        Explore how A* Search blends real path cost with a heuristic estimate to reach the goal efficiently.
      </p>

      <form onSubmit={handleGo} className="max-w-5xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-3 text-sm font-semibold uppercase tracking-wider" htmlFor="gridSize">
              Grid Size: <span className="text-primary font-mono">{gridSize}x{gridSize}</span>
            </label>
            <input
              type="range"
              id="gridSize"
              min="5"
              max="15"
              value={gridSize}
              onChange={(event) => setGridSize(parseInt(event.target.value, 10))}
              disabled={isAnimating}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
              <span>SMALL</span>
              <span>LARGE</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-3 text-sm font-semibold uppercase tracking-wider" htmlFor="heuristic">
              Heuristic: <span className="text-primary font-mono capitalize">{heuristic}</span>
            </label>
            <select
              id="heuristic"
              value={heuristic}
              onChange={(event) => setHeuristic(event.target.value)}
              disabled={isAnimating}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            >
              <option value="manhattan">Manhattan</option>
              <option value="euclidean">Euclidean</option>
              <option value="chebyshev">Chebyshev</option>
            </select>
            <div className="text-[10px] text-gray-400 mt-2 text-right">Choose how aggressively A* estimates the remaining distance</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="flex flex-wrap gap-2">
            {modeButtons.map((button) => {
              const Icon = button.icon;
              const active = editMode === button.id;
              return (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => setEditMode(button.id)}
                  disabled={isAnimating}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${active ? button.className : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"}`}
                >
                  <Icon size={16} />
                  {button.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setWalls(new Set())}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 transition-colors"
              disabled={isAnimating}
            >
              <Trash2 size={16} />
              Clear Walls
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-start xl:justify-end">
            <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
            <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            {isAnimating && (
              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-bold shadow-sm hover:bg-primary/90 transition-colors"
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                {isPaused ? "Play" : "Pause"}
              </button>
            )}
            {isAnimating && (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900">
                <button type="button" onClick={decreaseSpeed} className="font-black text-lg px-2" disabled={speed <= 0.5}>-</button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[72px] text-center">{speed}x</span>
                <button type="button" onClick={increaseSpeed} className="font-black text-lg px-2" disabled={speed >= 5}>+</button>
              </div>
            )}
          </div>
        </div>
      </form>

      {message && (
        <div className={`max-w-4xl mx-auto mb-8 p-4 rounded-lg ${statusClass} shadow-sm border border-current/10`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex flex-wrap items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-3 border-b border-[#a435f0]/20">
            <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
            <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">Step Explanation</span>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{isAnimating ? "Search in progress" : "Ready"}</span>
          </div>
          <div className="px-4 py-4">
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-mono">{stepExplanation}</p>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-950 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-[10px] text-gray-500 uppercase font-bold tracking-tight">
            <span><span className="text-blue-500">● Blue</span> = current node</span>
            <span><span className="text-sky-500">● Sky</span> = open set</span>
            <span><span className="text-slate-500">● Slate</span> = closed set</span>
            <span><span className="text-amber-500">● Amber</span> = shortest path</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-1">Visited</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{renderedFrame.closed.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-1">Frontier</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{renderedFrame.open.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-1">Current f</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{renderedFrame.f.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-1">Path Cost</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{renderedFrame.g}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md overflow-x-auto">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center uppercase tracking-[0.2em]">Grid Visualization</h2>
          <div className="mx-auto w-full max-w-4xl">
            <div className="grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
              {Array.from({ length: gridSize }).map((_, row) => {
                return Array.from({ length: gridSize }).map((__, col) => {
                  const cellKey = pointKey(row, col);
                  const isStart = start.row === row && start.col === col;
                  const isGoal = goal.row === row && goal.col === col;
                  const isWall = walls.has(cellKey);
                  const isPath = pathSet.has(cellKey);
                  const isOpen = openSet.has(cellKey);
                  const isClosed = closedSet.has(cellKey);
                  const isCurrent = renderedFrame.currentKey === cellKey;

                  let className = "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300";
                  if (isWall) className = "bg-slate-800 border-slate-900 text-slate-100";
                  else if (isPath) className = "bg-amber-300 border-amber-500 text-amber-900";
                  else if (isCurrent) className = "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-500/20 scale-[1.03]";
                  else if (isStart) className = "bg-emerald-500 border-emerald-700 text-white";
                  else if (isGoal) className = "bg-rose-500 border-rose-700 text-white";
                  else if (isOpen) className = "bg-sky-200 border-sky-400 text-sky-900";
                  else if (isClosed) className = "bg-slate-200 border-slate-400 text-slate-700 dark:bg-slate-700 dark:border-slate-500 dark:text-slate-100";

                  return (
                    <button
                      key={cellKey}
                      type="button"
                      onClick={() => handleCellClick(row, col)}
                      disabled={isAnimating}
                      className={`aspect-square rounded-lg border-2 transition-all duration-300 flex items-center justify-center font-bold text-[10px] sm:text-xs select-none ${className}`}
                      title={`Row ${row + 1}, Column ${col + 1}`}
                    >
                      {isStart ? "S" : isGoal ? "G" : isWall ? "" : isCurrent ? "●" : isPath ? "•" : ""}
                    </button>
                  );
                });
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AStarAnimation;
