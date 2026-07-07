"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Segment Tree Logic ────────────────────────────────────────────────────────
function buildTree(arr, node, start, end, tree) {
  if (start === end) {
    tree[node] = { sum: arr[start], min: arr[start], max: arr[start] };
  } else {
    const mid = Math.floor((start + end) / 2);
    buildTree(arr, 2 * node, start, mid, tree);
    buildTree(arr, 2 * node + 1, mid + 1, end, tree);
    tree[node] = {
      sum: tree[2 * node].sum + tree[2 * node + 1].sum,
      min: Math.min(tree[2 * node].min, tree[2 * node + 1].min),
      max: Math.max(tree[2 * node].max, tree[2 * node + 1].max),
    };
  }
}

function queryTree(node, start, end, l, r, tree, visited) {
  if (r < start || end < l) {
    visited.push({ node, type: "out" });
    return null;
  }
  visited.push({ node, type: start >= l && end <= r ? "in" : "partial" });
  if (start >= l && end <= r) return;
  const mid = Math.floor((start + end) / 2);
  queryTree(2 * node, start, mid, l, r, tree, visited);
  queryTree(2 * node + 1, mid + 1, end, l, r, tree, visited);
}

function updateTree(arr, node, start, end, idx, val, tree, visited) {
  visited.push({ node, type: "update" });
  if (start === end) {
    arr[idx] = val;
    tree[node] = { sum: val, min: val, max: val };
    return;
  }
  const mid = Math.floor((start + end) / 2);
  if (idx <= mid) updateTree(arr, 2 * node, start, mid, idx, val, tree, visited);
  else updateTree(arr, 2 * node + 1, mid + 1, end, idx, val, tree, visited);
  tree[node] = {
    sum: tree[2 * node].sum + tree[2 * node + 1].sum,
    min: Math.min(tree[2 * node].min, tree[2 * node + 1].min),
    max: Math.max(tree[2 * node].max, tree[2 * node + 1].max),
  };
}

// ─── Layout: assign x/y positions to each node ────────────────────────────────
function getNodeLayout(n) {
  const positions = {};
  const nodeRanges = {};

  function assign(node, start, end, depth, left, right) {
    const x = (left + right) / 2;
    const y = depth * 90 + 50;
    positions[node] = { x, y };
    nodeRanges[node] = { start, end };
    if (start !== end) {
      const mid = Math.floor((start + end) / 2);
      assign(2 * node, start, mid, depth + 1, left, (left + right) / 2);
      assign(2 * node + 1, mid + 1, end, depth + 1, (left + right) / 2, right);
    }
  }
  assign(1, 0, n - 1, 0, 0, 800);
  return { positions, nodeRanges };
}

// ─── Node Component ────────────────────────────────────────────────────────────
function TreeNode({ x, y, tree, nodeId, highlightMap, queryMode }) {
  const data = tree[nodeId];
  if (!data) return null;

  const hl = highlightMap[nodeId];
  let fill = "#1e293b";
  let stroke = "#334155";
  let textCol = "#94a3b8";

  if (hl === "in") { fill = "#16a34a"; stroke = "#22c55e"; textCol = "#fff"; }
  else if (hl === "partial") { fill = "#b45309"; stroke = "#f59e0b"; textCol = "#fff"; }
  else if (hl === "out") { fill = "#1e293b"; stroke = "#ef4444"; textCol = "#ef4444"; }
  else if (hl === "update") { fill = "#1e40af"; stroke = "#3b82f6"; textCol = "#fff"; }

  const val = queryMode === "sum" ? data.sum
    : queryMode === "min" ? data.min
    : data.max;

  return (
    <g>
      <circle cx={x} cy={y} r={26} fill={fill} stroke={stroke} strokeWidth={2}
        style={{ transition: "fill 0.3s, stroke 0.3s" }} />
      <text x={x} y={y - 6} textAnchor="middle" fontSize={11}
        fill={textCol} fontFamily="monospace" style={{ transition: "fill 0.3s" }}>
        {val}
      </text>
      <text x={x} y={y + 8} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="monospace">
        [{nodeId}]
      </text>
    </g>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SegmentTreeVisualizer() {
  const [inputVal, setInputVal] = useState("2, 4, 1, 7, 3, 6");
  const [arr, setArr] = useState([2, 4, 1, 7, 3, 6]);
  const [tree, setTree] = useState({});
  const [positions, setPositions] = useState({});
  const [nodeRanges, setNodeRanges] = useState({});
  const [highlightMap, setHighlightMap] = useState({});
  const [queryMode, setQueryMode] = useState("sum");
  const [queryL, setQueryL] = useState(1);
  const [queryR, setQueryR] = useState(4);
  const [updateIdx, setUpdateIdx] = useState(2);
  const [updateVal, setUpdateVal] = useState(9);
  const [result, setResult] = useState(null);
  const [resultLabel, setResultLabel] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("query"); // "query" | "update"
  const [buildError, setBuildError] = useState("");
  const intervalRef = useRef(null);

  // Build tree from array
  const handleBuild = useCallback(() => {
    const parsed = inputVal.split(",").map((v) => parseInt(v.trim(), 10));
    if (parsed.some(isNaN) || parsed.length < 1 || parsed.length > 10) {
      setBuildError("Enter 1–10 comma-separated integers.");
      return;
    }
    setBuildError("");
    const newTree = {};
    buildTree([...parsed], 1, 0, parsed.length - 1, newTree);
    const { positions: pos, nodeRanges: nr } = getNodeLayout(parsed.length);
    setArr([...parsed]);
    setTree(newTree);
    setPositions(pos);
    setNodeRanges(nr);
    setHighlightMap({});
    setResult(null);
    setSteps([]);
    setCurrentStep(-1);
    setPlaying(false);
  }, [inputVal]);

  useEffect(() => { handleBuild(); }, []); // eslint-disable-line

  // Animate steps
  useEffect(() => {
    if (!playing) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev + 1 >= steps.length) { setPlaying(false); return prev; }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(intervalRef.current);
  }, [playing, steps]);

  // Sync highlight when step changes
  useEffect(() => {
    if (currentStep < 0 || steps.length === 0) return;
    const map = {};
    for (let i = 0; i <= currentStep; i++) {
      const s = steps[i];
      map[s.node] = s.type;
    }
    setHighlightMap(map);
    // Show result on last step
    if (currentStep === steps.length - 1 && result !== null) {
      // already set
    }
  }, [currentStep, steps, result]);

  const runQuery = () => {
    if (!Object.keys(tree).length) return;
    const l = parseInt(queryL, 10);
    const r = parseInt(queryR, 10);
    if (isNaN(l) || isNaN(r) || l < 0 || r >= arr.length || l > r) return;

    const visited = [];
    queryTree(1, 0, arr.length - 1, l, r, tree, visited);
    setSteps(visited);
    setCurrentStep(-1);
    setHighlightMap({});
    setPlaying(false);

    // Compute result
    const sub = arr.slice(l, r + 1);
    let res;
    if (queryMode === "sum") res = sub.reduce((a, b) => a + b, 0);
    else if (queryMode === "min") res = Math.min(...sub);
    else res = Math.max(...sub);
    setResult(res);
    setResultLabel(`${queryMode.toUpperCase()}(${l}, ${r}) = ${res}`);
  };

  const runUpdate = () => {
    if (!Object.keys(tree).length) return;
    const idx = parseInt(updateIdx, 10);
    const val = parseInt(updateVal, 10);
    if (isNaN(idx) || isNaN(val) || idx < 0 || idx >= arr.length) return;

    const newArr = [...arr];
    const newTree = { ...tree };
    const visited = [];
    updateTree(newArr, 1, 0, newArr.length - 1, idx, val, newTree, visited);
    setArr(newArr);
    setTree(newTree);
    setSteps(visited);
    setCurrentStep(-1);
    setHighlightMap({});
    setResult(val);
    setResultLabel(`arr[${idx}] updated to ${val}`);
    setPlaying(false);
  };

  const handlePlay = () => {
    if (steps.length === 0) return;
    if (currentStep >= steps.length - 1) setCurrentStep(-1);
    setPlaying(true);
  };

  const handleStep = () => {
    setPlaying(false);
    setCurrentStep((p) => Math.min(p + 1, steps.length - 1));
  };

  const handlePause = () => setPlaying(false);
  const handleReset = () => { setHighlightMap({}); setCurrentStep(-1); setPlaying(false); };

  // SVG edges
  const edges = [];
  Object.entries(positions).forEach(([id, { x, y }]) => {
    const nodeId = parseInt(id);
    const parentId = Math.floor(nodeId / 2);
    if (parentId >= 1 && positions[parentId]) {
      const { x: px, y: py } = positions[parentId];
      edges.push(
        <line key={`e${nodeId}`} x1={px} y1={py + 26} x2={x} y2={y - 26}
          stroke="#334155" strokeWidth={1.5} />
      );
    }
  });

  const svgHeight = arr.length > 1 ? Math.ceil(Math.log2(arr.length) + 1) * 90 + 80 : 140;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Segment Tree Visualizer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Build · Query · Update — O(N) build, O(log N) query & update
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-0 h-full">
        {/* ── Left Panel ── */}
        <div className="w-full lg:w-72 border-r border-slate-800 p-5 flex flex-col gap-5 shrink-0">

          {/* Build */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              1. Build Tree
            </h2>
            <label className="text-xs text-slate-400 mb-1 block">Array (1–10 integers)</label>
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 2, 4, 1, 7, 3, 6"
            />
            {buildError && <p className="text-xs text-red-400 mt-1">{buildError}</p>}
            <button
              onClick={handleBuild}
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-md transition-colors"
            >
              Build
            </button>
          </section>

          <hr className="border-slate-800" />

          {/* Query Mode */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              2. Query / Update
            </h2>
            <div className="flex rounded-md overflow-hidden border border-slate-700 mb-4">
              {["query", "update"].map((tab) => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs py-2 font-medium transition-colors ${activeTab === tab ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`}>
                  {tab === "query" ? "Range Query" : "Point Update"}
                </button>
              ))}
            </div>

            {activeTab === "query" ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  {["sum", "min", "max"].map((m) => (
                    <button key={m}
                      onClick={() => setQueryMode(m)}
                      className={`flex-1 text-xs py-1.5 rounded-md border font-medium transition-colors ${queryMode === m ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-700 text-slate-400 hover:text-white bg-slate-900"}`}>
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">L (0-based)</label>
                    <input type="number" min={0} max={arr.length - 1}
                      value={queryL} onChange={(e) => setQueryL(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">R (0-based)</label>
                    <input type="number" min={0} max={arr.length - 1}
                      value={queryR} onChange={(e) => setQueryR(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                  </div>
                </div>
                <button onClick={runQuery}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium py-2 rounded-md transition-colors">
                  Run Query
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">Index</label>
                    <input type="number" min={0} max={arr.length - 1}
                      value={updateIdx} onChange={(e) => setUpdateIdx(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">New Value</label>
                    <input type="number"
                      value={updateVal} onChange={(e) => setUpdateVal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                  </div>
                </div>
                <button onClick={runUpdate}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-md transition-colors">
                  Run Update
                </button>
              </div>
            )}
          </section>

          <hr className="border-slate-800" />

          {/* Playback controls */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              3. Animate Steps
            </h2>
            <div className="flex gap-2">
              <button onClick={handlePlay} disabled={steps.length === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md transition-colors font-medium">
                ▶ Play
              </button>
              <button onClick={handlePause} disabled={!playing}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md transition-colors font-medium">
                ⏸ Pause
              </button>
              <button onClick={handleStep} disabled={steps.length === 0 || currentStep >= steps.length - 1}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md transition-colors font-medium">
                ⏭ Step
              </button>
            </div>
            <button onClick={handleReset}
              className="mt-2 w-full border border-slate-700 text-slate-400 hover:text-white text-xs py-2 rounded-md transition-colors">
              Reset Highlight
            </button>
            {steps.length > 0 && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                Step {Math.max(currentStep + 1, 0)} / {steps.length}
              </p>
            )}
          </section>

          <hr className="border-slate-800" />

          {/* Result */}
          {result !== null && (
            <section className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Result</p>
              <p className="text-base font-mono font-bold text-white">{resultLabel}</p>
            </section>
          )}

          {/* Legend */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Legend</h2>
            <div className="flex flex-col gap-1.5">
              {[
                { color: "#16a34a", label: "Fully in range" },
                { color: "#b45309", label: "Partially in range" },
                { color: "#ef4444", label: "Out of range" },
                { color: "#1e40af", label: "Update path" },
                { color: "#1e293b", label: "Unvisited" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block border border-slate-600"
                    style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right Panel: SVG Tree ── */}
        <div className="flex-1 overflow-auto p-4">
          {/* Array display */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Input Array</p>
            <div className="flex gap-1 flex-wrap">
              {arr.map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center text-sm font-mono font-bold text-white">
                    {v}
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5">{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tree SVG */}
          {Object.keys(positions).length > 0 && (
            <div className="overflow-x-auto">
              <svg width={820} height={svgHeight} className="block">
                {/* Edges */}
                {edges}
                {/* Nodes */}
                {Object.entries(positions).map(([id, { x, y }]) => {
                  const nodeId = parseInt(id);
                  return (
                    <g key={nodeId}>
                      {/* Range label */}
                      {nodeRanges[nodeId] && (
                        <text x={x} y={y + 40} textAnchor="middle" fontSize={9}
                          fill="#475569" fontFamily="monospace">
                          [{nodeRanges[nodeId].start},{nodeRanges[nodeId].end}]
                        </text>
                      )}
                      <TreeNode
                        x={x} y={y}
                        tree={tree}
                        nodeId={nodeId}
                        highlightMap={highlightMap}
                        queryMode={queryMode}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Complexity info */}
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-lg">
            {[
              { label: "Build", val: "O(N)" },
              { label: "Query", val: "O(log N)" },
              { label: "Update", val: "O(log N)" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-mono font-bold text-indigo-400 mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
