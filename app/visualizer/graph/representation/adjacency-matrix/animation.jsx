"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const AdjMatrixAnimation = () => {
  const [numVertices, setNumVertices] = useState(4);
  const [matrix, setMatrix] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);
  const [directed, setDirected] = useState(false);
  const cellRefs = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    initializeMatrix(4);
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const initializeMatrix = (n) => {
    const newMatrix = Array.from({ length: n }, () => Array(n).fill(0));
    setMatrix(newMatrix);
    setSelectedCell(null);
    setMessage(`Created ${n} × ${n} adjacency matrix`);
    cellRefs.current = [];
  };

  const handleVerticesChange = (e) => {
    const val = parseInt(e.target.value);
    if (val >= 2 && val <= 6) {
      setNumVertices(val);
      initializeMatrix(val);
    }
  };

  const handleCellClick = (row, col) => {
    if (isAnimating) return;
    const newMatrix = matrix.map((r) => [...r]);
    newMatrix[row][col] = newMatrix[row][col] === 0 ? 1 : 0;
    if (!directed && row !== col) {
      newMatrix[col][row] = newMatrix[row][col];
    }
    setMatrix(newMatrix);
    setSelectedCell({ row, col });
    setMessage(
      newMatrix[row][col] === 1
        ? `Edge added: ${row} → ${col}`
        : `Edge removed: ${row} → ${col}`
    );

    const cellIndex = row * numVertices + col;
    const cell = cellRefs.current[cellIndex];
    if (cell) {
      gsap.to(cell, {
        scale: 1.1,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleReset = () => {
    setIsAnimating(false);
    setMessage("");
    setSelectedCell(null);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    initializeMatrix(numVertices);
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);
    setMessage("Highlighting all edges in the matrix...");

    let delay = 0;
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (matrix[i][j] === 1) {
          const cellIndex = i * numVertices + j;
          const cell = cellRefs.current[cellIndex];
          if (cell) {
            animationRef.current = setTimeout(() => {
              gsap.to(cell, {
                backgroundColor: "#22C55E",
                scale: 1.05,
                duration: 0.3,
                onComplete: () => {
                  gsap.to(cell, {
                    backgroundColor: "#3B82F6",
                    scale: 1,
                    duration: 0.3,
                  });
                },
              });
            }, delay);
            delay += 200;
          }
        }
      }
    }

    animationRef.current = setTimeout(() => {
      setIsAnimating(false);
      setMessage("Matrix visualization complete. Green cells = edges (1), white = no edge (0)");
    }, delay + 500);
  };

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Click cells in the matrix to toggle edges (0 → 1). Watch the adjacency matrix update instantly.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="numVertices">
              Number of Vertices
            </label>
            <input
              type="number"
              id="numVertices"
              value={numVertices}
              onChange={handleVerticesChange}
              min={2}
              max={6}
              className="w-32 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300"
              disabled={isAnimating}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 dark:text-gray-300" htmlFor="directed">
              Directed
            </label>
            <input
              type="checkbox"
              id="directed"
              checked={directed}
              onChange={(e) => {
                setDirected(e.target.checked);
                handleReset();
              }}
              disabled={isAnimating}
              className="w-5 h-5"
            />
          </div>
          <div className="flex gap-2">
            <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
            <ResetButton onReset={handleReset} isAnimating={isAnimating} />
          </div>
        </div>
      </form>

      {message && (
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {matrix.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            {numVertices} × {numVertices} Adjacency Matrix {directed ? "(Directed)" : "(Undirected)"}
          </h2>

          <div className="overflow-x-auto">
            <table className="mx-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-gray-600 dark:text-gray-400"></th>
                  {Array.from({ length: numVertices }, (_, i) => (
                    <th key={i} className="px-3 py-2 text-blue-600 dark:text-blue-400 font-bold">
                      {i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-blue-600 dark:text-blue-400 font-bold text-center">
                      {i}
                    </td>
                    {row.map((cell, j) => {
                      const cellIndex = i * numVertices + j;
                      return (
                        <td key={j} className="px-1 py-1">
                          <div
                            ref={(el) => (cellRefs.current[cellIndex] = el)}
                            onClick={() => handleCellClick(i, j)}
                            className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 cursor-pointer transition-colors text-lg font-bold ${
                              matrix[i][j] === 1
                                ? "bg-green-500 dark:bg-green-600 border-green-700 text-white"
                                : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            } ${cell === 0 && j === 0 ? "hover:bg-gray-100 dark:hover:bg-gray-700" : ""}`}
                          >
                            {cell}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Edge exists (1)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">No edge (0)</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdjMatrixAnimation;
