import { useState, useCallback, useRef, useEffect } from 'react';

export default function useGraphHistory(initialNodes = [], initialEdges = [], maxHistory = 15) {
  const [nodes, setNodesState] = useState(initialNodes);
  const [edges, setEdgesState] = useState(initialEdges);
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: initialEdges }]);
  const [pointer, setPointer] = useState(0);

  const nodesRef = useRef(initialNodes);
  const edgesRef = useRef(initialEdges);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const updateGraph = useCallback((nodesUpdater, edgesUpdater, replaceHistory = false) => {
    let newNodes = typeof nodesUpdater === 'function' ? nodesUpdater(nodesRef.current) : nodesUpdater;
    let newEdges = typeof edgesUpdater === 'function' ? edgesUpdater(edgesRef.current) : edgesUpdater;

    if (newNodes === undefined) newNodes = nodesRef.current;
    if (newEdges === undefined) newEdges = edgesRef.current;

    setNodesState(newNodes);
    setEdgesState(newEdges);

    setHistory(prevHistory => {
      let newHistory = replaceHistory ? prevHistory.slice(0, pointer) : prevHistory.slice(0, pointer + 1);
      newHistory.push({ nodes: newNodes, edges: newEdges });
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      }
      return newHistory;
    });
    setPointer(prev => replaceHistory ? prev : Math.min(prev + 1, maxHistory - 1));
  }, [pointer, maxHistory]);

  const setNodes = useCallback((nodesUpdater, replaceHistory = false) => updateGraph(nodesUpdater, undefined, replaceHistory), [updateGraph]);
  const setEdges = useCallback((edgesUpdater, replaceHistory = false) => updateGraph(undefined, edgesUpdater, replaceHistory), [updateGraph]);

  const undo = useCallback(() => {
    if (pointer > 0) {
      const prevPointer = pointer - 1;
      setPointer(prevPointer);
      const state = history[prevPointer];
      setNodesState(state.nodes);
      setEdgesState(state.edges);
    }
  }, [pointer, history]);

  const redo = useCallback(() => {
    if (pointer < history.length - 1) {
      const nextPointer = pointer + 1;
      setPointer(nextPointer);
      const state = history[nextPointer];
      setNodesState(state.nodes);
      setEdgesState(state.edges);
    }
  }, [pointer, history]);

  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  const resetGraph = useCallback((newNodes, newEdges) => {
    setNodesState(newNodes);
    setEdgesState(newEdges);
    setHistory([{ nodes: newNodes, edges: newEdges }]);
    setPointer(0);
  }, []);

  return { nodes, setNodes, edges, setEdges, updateGraph, undo, redo, canUndo, canRedo, resetGraph };
}
