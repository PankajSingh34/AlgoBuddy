"use client";

import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// Utility: call Claude via Anthropic API
// ─────────────────────────────────────────────
async function fetchHint({ algorithm, step, code, mode }) {
  const systemPrompt = `You are AlgoBuddy's AI tutor — concise, friendly, and pedagogically precise.
You help students understand Data Structures & Algorithms by explaining what is happening step by step.
Always respond in plain text (no markdown). Keep explanations under 120 words unless the user asks to "explain the full code".`;

  const userPrompt =
    mode === "code"
      ? `Explain this algorithm implementation clearly and concisely for a student:\n\n${code}`
      : mode === "hint"
      ? `I'm visualizing "${algorithm}". I'm currently on this step: "${step}". Give me a short, helpful hint about what is happening and why.`
      : `What is the time and space complexity of ${algorithm}? Give a brief, clear breakdown.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) throw new Error("API request failed");
  const data = await response.json();
  return data.content?.map((b) => b.text || "").join("") ?? "";
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function ModeButton({ active, onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
        active
          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
      }`}
    >
      <span>{icon}</span>
      {children}
    </button>
  );
}

function TypingText({ text }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 12);
    return () => clearInterval(id);
  }, [text]);

  return (
    <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
      {displayed}
      {!done && (
        <span className="inline-block w-1.5 h-3.5 bg-violet-400 ml-0.5 rounded-sm animate-pulse" />
      )}
    </p>
  );
}

function ComplexityBadge({ label, value, color }) {
  return (
    <div className={`rounded-lg px-3 py-2 ${color} flex flex-col items-center`}>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
        {label}
      </span>
      <span className="text-sm font-mono font-bold mt-0.5">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

/**
 * AIHintPanel — drop this next to any AlgoBuddy visualizer.
 *
 * Props:
 *   algorithm   {string}  e.g. "Bubble Sort"
 *   currentStep {string}  description of the current visualizer step
 *   code        {string}  the algorithm's source code (optional)
 *   isDark      {boolean} mirrors AlgoBuddy's dark mode state
 */
export default function AIHintPanel({
  algorithm = "Bubble Sort",
  currentStep = "Comparing index 2 and index 3",
  code = `function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}`,
  isDark = true,
}) {
  const [mode, setMode] = useState("hint"); // hint | code | complexity
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);
  const [asked, setAsked] = useState(false);
  const scrollRef = useRef(null);

  // Auto-ask on step change
  useEffect(() => {
    if (mode === "hint") handleAsk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [response]);

  async function handleAsk() {
    setLoading(true);
    setError("");
    setResponse("");
    setAsked(true);
    try {
      const text = await fetchHint({ algorithm, step: currentStep, code, mode });
      setResponse(text);
    } catch (e) {
      setError("Couldn't reach the AI tutor. Check your API key in .env.local.");
    } finally {
      setLoading(false);
    }
  }

  const panelBase = isDark
    ? "bg-[#0f1117] border-white/10 text-white"
    : "bg-white border-gray-200 text-gray-900";

  return (
    <div
      className={`relative flex flex-col rounded-2xl border shadow-2xl transition-all duration-300 ${panelBase} ${
        open ? "w-80" : "w-12"
      }`}
      style={{ minHeight: open ? 420 : 48, maxHeight: 580 }}
    >
      {/* ── Header ── */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? "border-white/10" : "border-gray-100"
        }`}
      >
        {open && (
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-bold text-sm tracking-tight">
              AI Tutor
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                isDark
                  ? "bg-violet-500/20 text-violet-300"
                  : "bg-violet-100 text-violet-700"
              }`}
            >
              BETA
            </span>
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`ml-auto p-1.5 rounded-lg transition hover:bg-white/10 text-gray-400 hover:text-white ${
            !open ? "mx-auto" : ""
          }`}
          title={open ? "Collapse" : "Open AI Tutor"}
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <>
          {/* ── Context banner ── */}
          <div
            className={`mx-3 mt-3 rounded-xl px-3 py-2 text-xs flex items-start gap-2 ${
              isDark ? "bg-violet-500/10 text-violet-300" : "bg-violet-50 text-violet-700"
            }`}
          >
            <span className="mt-0.5 shrink-0">▶</span>
            <div>
              <span className="font-bold">{algorithm}</span>
              <br />
              <span className="opacity-70 line-clamp-2">{currentStep}</span>
            </div>
          </div>

          {/* ── Mode selector ── */}
          <div className="flex gap-1.5 px-3 pt-3">
            <ModeButton
              active={mode === "hint"}
              onClick={() => setMode("hint")}
              icon="💡"
            >
              Hint
            </ModeButton>
            <ModeButton
              active={mode === "code"}
              onClick={() => setMode("code")}
              icon="📄"
            >
              Explain Code
            </ModeButton>
            <ModeButton
              active={mode === "complexity"}
              onClick={() => setMode("complexity")}
              icon="⏱"
            >
              Complexity
            </ModeButton>
          </div>

          {/* ── Response area ── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
            style={{ minHeight: 180 }}
          >
            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
                Thinking…
              </div>
            )}

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {response && !loading && (
              <div
                className={`rounded-xl p-3 ${
                  isDark ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <TypingText text={response} />
              </div>
            )}

            {!asked && !loading && (
              <p className="text-xs text-gray-500 text-center mt-6">
                Press <span className="text-violet-400 font-semibold">Ask AI</span> to
                get a hint for this step.
              </p>
            )}
          </div>

          {/* ── Action footer ── */}
          <div
            className={`px-3 pb-3 pt-1 border-t ${
              isDark ? "border-white/5" : "border-gray-100"
            }`}
          >
            <button
              onClick={handleAsk}
              disabled={loading}
              className="w-full py-2 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-lg shadow-violet-500/20 active:scale-95"
            >
              {loading ? "Thinking…" : mode === "hint" ? "Ask AI 💡" : mode === "code" ? "Explain Code 📄" : "Show Complexity ⏱"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}