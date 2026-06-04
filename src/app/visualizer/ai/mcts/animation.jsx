"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { saveToStorage, loadFromStorage } from "@/utils/storage";

// Basic tree structure for demonstration
const makeInitialTree = () => {
  return new Array(15).fill(null).map((_, i) => ({
    id: i,
    visits: 0,
    wins: 0,
    children: i <= 6 ? [2 * i + 1, 2 * i + 2] : [],
  }));
};

const randOutcome = () => (Math.random() < 0.5 ? 1 : 0);

const uct = (node, parentVisits, c = 1.4) => {
  if (node.visits === 0) return Infinity;
  const exploitation = node.wins / node.visits;
  const exploration = c * Math.sqrt(Math.log(parentVisits) / node.visits);
  return exploitation + exploration;
};

const MCTSAnim = () => {
  const [tree, setTree] = useState(() => makeInitialTree());
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [exploreC, setExploreC] = useState(() => loadFromStorage("mcts-explore-c", 1.4));
  const [simSize, setSimSize] = useState(() => loadFromStorage("mcts-sim-size", 10));
  const [highlightPath, setHighlightPath] = useState([]);
  const [stepExplanation, setStepExplanation] = useState("");
  const [stepCount, setStepCount] = useState(0);

  const {
    isPaused,
    isPausedRef,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
  } = usePlayback(() => loadFromStorage("mcts-speed", 1));

  const animationRef = useRef(null);
  const runningRef = useRef(false);

  useEffect(() => { saveToStorage("mcts-explore-c", exploreC); }, [exploreC]);
  useEffect(() => { saveToStorage("mcts-sim-size", simSize); }, [simSize]);
  useEffect(() => { saveToStorage("mcts-speed", speed); }, [speed]);

  const reset = useCallback(() => {
    runningRef.current = false;
    clearTimeout(animationRef.current);
    setIsAnimating(false);
    setTree(makeInitialTree());
    setMessage("");
    setMessageType("");
    setHighlightPath([]);
    setStepExplanation("");
    setStepCount(0);
  }, []);

  useVisualizerReset(reset);

  const select = useCallback((nodes) => {
    let path = [0];
    let cur = nodes[0];
    while (cur.children && cur.children.length > 0) {
      const parentVisits = cur.visits || 1;
      const childNodes = cur.children.map((id) => nodes[id]);
      let best = childNodes[0];
      for (const ch of childNodes) {
        if (uct(ch, parentVisits, exploreC) > uct(best, parentVisits, exploreC)) {
          best = ch;
        }
      }
      path.push(best.id);
      cur = best;
    }
    return path;
  }, [exploreC]);

  const runTick = useCallback(() => {
    const nodes = tree.map((n) => ({ ...n }));
    const count = stepCount + 1;
    let lastPath = [];
    
    for (let s = 0; s < simSize; s++) {
      const path = select(nodes);
      const outcome = randOutcome();
      // Backpropagate
      for (const id of path) {
        nodes[id].visits += 1;
        nodes[id].wins += outcome;
      }
      lastPath = path;
    }

    setTree(nodes);
    setHighlightPath(lastPath);
    setStepCount(count);
    setStepExplanation(
      `Iteration #${count}: Performed ${simSize} simulations. The last path selected via UCT was: ${lastPath.join(" → ")}.`
    );
  }, [tree, simSize, stepCount, select]);

  useEffect(() => {
    if (isAnimating && !isPaused) {
      const delay = 1000 / speedRef.current;
      animationRef.current = setTimeout(() => {
        runTick();
      }, delay);
    }
    return () => clearTimeout(animationRef.current);
  }, [isAnimating, isPaused, runTick, speedRef]);

  const handleGo = (e) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);
    runningRef.current = true;
    setMessage("Running MCTS simulations...");
    setMessageType("success");
    runTick();
  };

  const handleReset = () => {
    reset();
    setMessage("Visualizer reset.");
    setMessageType("warning");
  };


  const getPos = (index) => {
    let x = 0, y = 0;
    if (index === 0) { x = 400; y = 40; }
    else if (index >= 1 && index <= 2) { y = 120; x = 400 + (index - 1.5) * 400; }
    else if (index >= 3 && index <= 6) { y = 200; x = 400 + (index - 4.5) * 200; }
    else if (index >= 7 && index <= 14) { y = 280; x = 50 + (index - 7) * 100; }
    return { x, y };
  };

  const edges = [];
  for (let i = 0; i <= 6; i++) {
    const p1 = getPos(i);
    const p2_l = getPos(2 * i + 1);
    const p2_r = getPos(2 * i + 2);
    edges.push(<line key={`e${i}L`} x1={p1.x} y1={p1.y} x2={p2_l.x} y2={p2_l.y} stroke="#cbd5e1" strokeWidth="2" />);
    edges.push(<line key={`e${i}R`} x1={p1.x} y1={p1.y} x2={p2_r.x} y2={p2_r.y} stroke="#cbd5e1" strokeWidth="2" />);
  }

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-sans">
        Observe how Monte Carlo Tree Search explores a decision space through randomized playouts and statistical backpropagation.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-3 text-sm font-semibold uppercase tracking-wider" htmlFor="exploreC">
              Exploration Constant (C): <span className="text-primary font-mono">{exploreC}</span>
            </label>
            <input
              type="range"
              id="exploreC"
              min="0"
              max="3"
              step="0.1"
              value={exploreC}
              onChange={(e) => setExploreC(parseFloat(e.target.value))}
              disabled={isAnimating}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
              <span>EXPLOIT (0)</span>
              <span>EXPLORE (3.0)</span>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-3 text-sm font-semibold uppercase tracking-wider" htmlFor="simSize">
              Simulations Per Step: <span className="text-primary font-mono">{simSize}</span>
            </label>
            <input
              type="range"
              id="simSize"
              min="1"
              max="100"
              value={simSize}
              onChange={(e) => setSimSize(parseInt(e.target.value))}
              disabled={isAnimating}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="text-[10px] text-gray-400 mt-2 text-right">Batch Playouts</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="flex gap-2">
            <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
            <ResetButton onReset={handleReset} isAnimating={isAnimating} />
          </div>

          {isAnimating && (
            <div className="flex flex-1 items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
              <button
                type="button"
                onClick={togglePlayPause}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm w-full sm:w-auto justify-center"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
                {isPaused ? "Play" : "Pause"}
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={decreaseSpeed}
                  className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  disabled={speed <= 0.5}
                >-</button>
                <span className="text-gray-700 dark:text-gray-300 font-medium min-w-[80px] text-center text-sm">
                  {speed}x speed
                </span>
                <button
                  type="button"
                  onClick={increaseSpeed}
                  className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  disabled={speed >= 5}
                >+</button>
              </div>
            </div>
          )}
        </div>
      </form>

      {message && (
        <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${messageClass} shadow-sm border border-current/10`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {(isAnimating || tree[0].visits > 0) && (
        <div className="max-w-4xl mx-auto space-y-6">
          {stepExplanation && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2 border-b border-[#a435f0]/20">
                <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
                <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
                  Step Explanation
                </span>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  Cycle #{stepCount}
                </span>
              </div>
              <div className="px-4 py-4">
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-mono">
                  {stepExplanation}
                </p>
              </div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-950 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                <span><span className="text-blue-500">● Blue</span> = selection path</span>
                <span><span className="text-gray-400">● Gray</span> = unvisited</span>
                <span>v = visits</span>
                <span>w = win rate %</span>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-10 text-center uppercase tracking-[0.2em]">
              Search Tree Visualization
            </h2>
            <div className="min-w-[800px] h-[360px] relative mx-auto">
              <svg className="absolute w-full h-full left-0 top-0 pointer-events-none opacity-30">{edges}</svg>
              {tree.map((node, i) => {
                const pos = getPos(i);
                const r = 32;
                const winRate = node.visits === 0 ? 0 : Math.round((node.wins / node.visits) * 100);
                const isHighlighted = highlightPath.includes(i);
                const bgClass = isHighlighted 
                  ? "bg-blue-600 border-blue-700 text-white translate-y-[-2px] shadow-lg shadow-blue-500/20" 
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300 shadow-sm";
                
                return (
                  <div 
                    key={i} 
                    className={`absolute flex flex-col items-center justify-center border-2 rounded-full transition-all duration-300 font-sans ${bgClass}`} 
                    style={{ width: `${2*r}px`, height: `${2*r}px`, left: `${pos.x - r}px`, top: `${pos.y - r}px`, zIndex: 10 }}
                  >
                    <span className="text-[9px] font-bold opacity-50 mb-0.5">ID: {i}</span>
                    <span className="text-xs font-black">{node.visits}v</span>
                    <div className="h-[1px] w-6 bg-current opacity-20 my-0.5" />
                    <span className="text-[10px] font-mono font-medium">{winRate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MCTSAnim;


