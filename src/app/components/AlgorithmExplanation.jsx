"use client";

import React from "react";
import { BookOpen, Clock, Database } from "lucide-react";

export default function AlgorithmExplanation({ explanation }) {
  return (
    <div className="w-full mt-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-lg shadow-black/20">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-[#c084fc]" size={22} />
        <h2 className="text-lg font-bold text-white">
          Step-by-Step Explanation
        </h2>
      </div>

      {/* Current Step Explanation */}
      <div className="bg-slate-950/60 border border-slate-700 rounded-xl p-4 mb-4">
        <h3 className="text-sm font-bold text-[#c084fc] mb-2">
          Current Operation
        </h3>
        <p className="text-slate-300 text-sm">
          {explanation ||
            "The algorithm is analyzing the current step and explaining the operation being performed."}
        </p>
      </div>

      {/* Data Structure State */}
      <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl mb-3">
        <Database className="text-blue-400 mt-1" size={18} />
        <div>
          <h4 className="text-sm font-semibold text-white">
            Data Structure State
          </h4>
          <p className="text-xs text-slate-400">
            Shows how elements, nodes, or values are changing during execution.
          </p>
        </div>
      </div>

      {/* Complexity Information */}
      <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl">
        <Clock className="text-green-400 mt-1" size={18} />
        <div>
          <h4 className="text-sm font-semibold text-white">
            Complexity Insight
          </h4>
          <p className="text-xs text-slate-400">
            The number of comparisons and operations contributes to the overall
            time and space complexity of the algorithm.
          </p>
        </div>
      </div>
    </div>
  );
}