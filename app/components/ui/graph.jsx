"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const CASES = [
  {
    key: "best",
    label: "Best Case",
    notation: "O(1)",
    color: "#22c55e",
    dash: "8 4",
    description: "Target found at index 0. Only 1 comparison needed, always.",
  },
  {
    key: "average",
    label: "Average Case",
    notation: "O(n/2)",
    color: "#f59e0b",
    dash: "5 3",
    description: "Target found near the middle on average.",
  },
  {
    key: "worst",
    label: "Worst Case",
    notation: "O(n)",
    color: "#ef4444",
    dash: null,
    description: "Target at last index or not present. Checks every element.",
  },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-3 min-w-[200px]">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
        n = {label}
      </p>
      {CASES.map(({ key, label: caseLabel, notation, color, description }) => {
        const entry = payload.find((p) => p.dataKey === key);
        if (!entry || entry.value == null) return null;
        return (
          <div key={key} className="mb-2 last:mb-0">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="font-semibold text-sm" style={{ color }}>
                {caseLabel}{" "}
                <span className="font-mono text-xs opacity-80">{notation}</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-[18px]">
              {Number(entry.value).toFixed(0)} comparison
              {Number(entry.value) !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 ml-[18px] italic">
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function LegendToggle({ caseInfo, active, onToggle }) {
  const { label, notation, color, dash } = caseInfo;
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-all duration-200"
      style={{
        color,
        borderColor: active ? color : "transparent",
        background: active ? `${color}15` : "transparent",
        opacity: active ? 1 : 0.4,
        filter: active ? "none" : "grayscale(1)",
      }}
    >
      <svg width="24" height="10" aria-hidden="true" className="flex-shrink-0">
        <line
          x1="0" y1="5" x2="24" y2="5"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={dash ?? "none"}
        />
        <circle cx="12" cy="5" r="3" fill={color} />
      </svg>
      <span>
        <span className="block text-xs font-bold leading-none">{label}</span>
        <span className="block font-mono text-[11px] opacity-70 leading-none mt-0.5">
          {notation}
        </span>
      </span>
    </button>
  );
}

// Always use canonical formulas — never trust call-site prop functions
const CANONICAL = {
  best:    ()  => 1,
  average: (n) => Math.ceil(n / 2),
  worst:   (n) => n,
};

const ComplexityGraph = ({
  maxN = 20,
  title = "Time Complexity Analysis",
  bestCase,    // accepted for backward-compat but ignored
  averageCase, // accepted for backward-compat but ignored
  worstCase,   // accepted for backward-compat but ignored
  showBest    = true,
  showAverage = true,
  showWorst   = true,
}) => {
  const [visible, setVisible] = useState({ best: true, average: true, worst: true });
  const toggle = (key) => setVisible((v) => ({ ...v, [key]: !v[key] }));

  const data = Array.from({ length: maxN }, (_, i) => {
    const n = i + 1;
    return {
      n,
      ...(showBest    && { best:    CANONICAL.best(n)    }),
      ...(showAverage && { average: CANONICAL.average(n) }),
      ...(showWorst   && { worst:   CANONICAL.worst(n)   }),
    };
  });

  // ── Y-axis domain ────────────────────────────────────────────────────────
  // yFloor is 10% of yMax below zero.
  // At maxN=25 → yMax=27, yFloor=-3, total range=30.
  // This puts O(1) at y=1 → (1+3)/30 = 13% chart height (clearly visible).
  // Average at n=25 → 53% height. Worst → 93% height.
  // tickFormatter hides the negative floor tick so users never see it.
  const yMax   = maxN + 2;
  const yFloor = -Math.ceil(yMax * 0.1);
  const yDomain = [yFloor, yMax];

  return (
    <section
      aria-labelledby="complexity-title"
      className="w-full p-5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <h2
        id="complexity-title"
        className="text-lg font-black text-gray-800 dark:text-gray-100 mb-1 tracking-tight"
      >
        {title}
      </h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Comparisons vs. input size (n) · click a label to toggle
      </p>

      {/* Legend toggles */}
      <div
        role="group"
        aria-label="Toggle complexity curves"
        className="flex flex-wrap gap-2 mb-4"
      >
        {CASES.map((c) => {
          const shown =
            c.key === "best" ? showBest
            : c.key === "average" ? showAverage
            : showWorst;
          if (!shown) return null;
          return (
            <LegendToggle
              key={c.key}
              caseInfo={c}
              active={visible[c.key]}
              onToggle={() => toggle(c.key)}
            />
          );
        })}
      </div>

      {/* O(1) explainer banner */}
      {showBest && visible.best && (
        <div
          role="note"
          className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 mb-4 text-xs text-green-400"
        >
          <span aria-hidden="true" className="mt-0.5">💡</span>
          <span>
            <strong>Why is O(1) a flat line?</strong> Best case means the target
            is always at index 0 — only <strong>1 comparison</strong> is ever
            made, regardless of how large n grows.
          </span>
        </div>
      )}

      {/* Chart */}
      <div className="w-full h-72" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          {/* right: 16 — label is now inside the chart, no edge bleed needed */}
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 24, left: 4 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              strokeOpacity={0.15}
              vertical={false}
            />

            <XAxis
              dataKey="n"
              axisLine={{ stroke: "#6b7280", strokeWidth: 0.5 }}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              label={{
                value: "Input Size (n)",
                position: "insideBottom",
                offset: -12,
                fill: "#6b7280",
                fontSize: 12,
              }}
            />

            <YAxis
              domain={yDomain}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 0 && Number.isInteger(v) ? v : "")}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              width={40}
              label={{
                value: "Comparisons",
                angle: -90,
                position: "insideLeft",
                offset: 12,
                fill: "#6b7280",
                fontSize: 12,
                dy: 50,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#6b7280", strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            {/* Annotated reference band at y=1 — inside chart, never clipped */}
            {showBest && visible.best && (
              <ReferenceLine
                y={1}
                stroke="#22c55e"
                strokeOpacity={0.3}
                strokeDasharray="3 3"
                label={{
                  value: "O(1) = 1",
                  position: "insideTopLeft",
                  fill: "#22c55e",
                  fontSize: 10,
                  opacity: 0.85,
                }}
              />
            )}

            {showBest && visible.best && (
              <Line
                type="monotone"
                dataKey="best"
                stroke="#22c55e"
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 5, fill: "#22c55e", strokeWidth: 0 }}
                name="Best Case O(1)"
                animationDuration={900}
                animationEasing="ease-out"
              />
            )}

            {showAverage && visible.average && (
              <Line
                type="monotone"
                dataKey="average"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="5 3"
                dot={false}
                activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }}
                name="Average Case O(n/2)"
                animationDuration={900}
                animationEasing="ease-out"
                animationBegin={200}
              />
            )}

            {showWorst && visible.worst && (
              <Line
                type="monotone"
                dataKey="worst"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: "#ef4444", strokeWidth: 0 }}
                name="Worst Case O(n)"
                animationDuration={900}
                animationEasing="ease-out"
                animationBegin={400}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <table
        className="w-full mt-4 text-xs border-collapse"
        aria-label="Complexity summary"
      >
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {["Case", "Notation", `At n=${maxN}`, "Scenario"].map((h) => (
              <th
                key={h}
                className="text-left py-1.5 px-2 text-gray-400 font-semibold uppercase tracking-wider text-[11px]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            {
              key: "best",
              show: showBest,
              label: "Best Case",
              notation: "O(1)",
              color: "#22c55e",
              value: 1,
              scenario: "Target at index 0. Only 1 comparison, always.",
            },
            {
              key: "average",
              show: showAverage,
              label: "Average Case",
              notation: "O(n/2)",
              color: "#f59e0b",
              value: Math.ceil(maxN / 2),
              scenario: "Target near the middle on average.",
            },
            {
              key: "worst",
              show: showWorst,
              label: "Worst Case",
              notation: "O(n)",
              color: "#ef4444",
              value: maxN,
              scenario: "Target at last index or not present.",
            },
          ]
            .filter((r) => r.show)
            .map(({ key, label, notation, color, value, scenario }) => (
              <tr key={key} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-2 font-bold" style={{ color }}>{label}</td>
                <td className="py-2 px-2 font-mono font-semibold" style={{ color }}>{notation}</td>
                <td className="py-2 px-2 text-gray-600 dark:text-gray-300">{value}</td>
                <td className="py-2 px-2 text-gray-400 dark:text-gray-500">{scenario}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default ComplexityGraph;