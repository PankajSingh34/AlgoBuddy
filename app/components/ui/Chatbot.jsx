"use client";

/**
 * AlgoBuddy AI Chatbot — Frontend Component
 * Path: app/components/Chatbot/Chatbot.jsx
 *
 * Features:
 *  - Framer Motion floating widget anchored bottom-right
 *  - Unread message badge on trigger button
 *  - Welcome screen with rich suggestion chips (6 chips across 3 categories)
 *  - SSE streaming with live cursor
 *  - react-markdown + remark-gfm for full Markdown rendering
 *  - Syntax-highlighted code blocks with Copy button per block
 *  - Full conversational memory (message history sent per request)
 *  - Clean typed error UI (never raw stack traces)
 *  - Auto-resize textarea, keyboard shortcuts
 *  - AlgoBuddy purple brand theme
 *
 * Dependencies:
 *   npm install react-markdown remark-gfm framer-motion lucide-react @anthropic-ai/sdk
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronDown,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Suggestion Chips ─────────────────────────────────────────────────────────

const CHIP_CATEGORIES = [
  {
    label: "About AlgoBuddy",
    color: "purple",
    chips: [
      {
        id: "c1",
        emoji: "💡",
        label: "What is AlgoBuddy?",
        query:
          "What is AlgoBuddy? Explain it in simple terms so even a non-technical person understands.",
      },
      {
        id: "c2",
        emoji: "🚀",
        label: "How can this help me?",
        query:
          "How can AlgoBuddy help me as a student? What features should I start with?",
      },
    ],
  },
  {
    label: "Platform Features",
    color: "indigo",
    chips: [
      {
        id: "c3",
        emoji: "🎨",
        label: "What can I visualize?",
        query:
          "What algorithms and data structures can I visualize on AlgoBuddy? Give me the complete list.",
      },
      {
        id: "c4",
        emoji: "🏋️",
        label: "Tell me about Practice Arena",
        query:
          "Explain the Practice Arena feature on AlgoBuddy. How does it help me improve my coding?",
      },
    ],
  },
  {
    label: "Learn DSA",
    color: "teal",
    chips: [
      {
        id: "c5",
        emoji: "💻",
        label: "Binary Search with analogy",
        query:
          "Explain Binary Search with a real-world analogy, a step-by-step code walkthrough in Python, a worked example, and time/space complexity.",
      },
      {
        id: "c6",
        emoji: "🗺️",
        label: "DSA Roadmap for beginners",
        query:
          "I'm a complete beginner. Give me a step-by-step DSA learning roadmap and tell me how AlgoBuddy can help at each stage.",
      },
    ],
  },
];

const ALL_CHIPS = CHIP_CATEGORIES.flatMap((cat) => cat.chips);

// ─── Welcome Message ──────────────────────────────────────────────────────────

const WELCOME_MESSAGE = {
  role: "assistant",
  id: "welcome",
  content: `## Hey there! 👋 I'm **AlgoBot**

Your personal guide to **AlgoBuddy** and all things **DSA**.

Here's what I can do for you:

- 🧭 **Explore AlgoBuddy** — understand every feature in plain English
- 🧠 **Learn any DSA topic** — from Arrays to Advanced Graph algorithms
- 💻 **Get code walkthroughs** — with examples, analogies & Big-O complexity
- 🗺️ **Plan your learning path** — personalized DSA roadmaps

Pick a quick-start below or type your own question!`,
};

// ─── Color helpers ────────────────────────────────────────────────────────────

const chipColors = {
  purple:
    "border-purple-500/40 bg-purple-900/20 text-purple-300 hover:bg-purple-800/40 hover:border-purple-400/60 hover:text-white",
  indigo:
    "border-indigo-500/40 bg-indigo-900/20 text-indigo-300 hover:bg-indigo-800/40 hover:border-indigo-400/60 hover:text-white",
  teal: "border-teal-500/40 bg-teal-900/20 text-teal-300 hover:bg-teal-800/40 hover:border-teal-400/60 hover:text-white",
};

// ─── Code Block with Copy ─────────────────────────────────────────────────────

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "code";
  const code = String(children).trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-600/50 bg-slate-950 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs font-mono text-slate-400 tracking-widest uppercase ml-1">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors duration-150 px-2 py-1 rounded-md hover:bg-slate-700/50"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-slate-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ─── Markdown Components ──────────────────────────────────────────────────────

const mdComponents = {
  code({ inline, className, children, ...props }) {
    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-slate-700/80 text-purple-300 font-mono text-[0.8em]"
          {...props}
        >
          {children}
        </code>
      );
    }
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  h2: ({ children }) => (
    <h2 className="text-[15px] font-bold text-white mt-4 mb-2 flex items-center gap-2 border-b border-purple-500/20 pb-1.5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[13px] font-semibold text-purple-300 mt-3 mb-1">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-[13px] text-slate-300 leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => <ul className="my-2 space-y-1 pl-1">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-2 space-y-1 pl-4 list-decimal list-outside">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex gap-2 text-[13px] text-slate-300 leading-relaxed">
      <span className="text-purple-400 mt-0.5 shrink-0">›</span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-[12px] border-collapse rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-purple-900/40 text-purple-200">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-700/50">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-slate-800/40 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold border border-slate-700/50">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-slate-300 border border-slate-700/30">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-purple-500/50 pl-3 my-2 text-slate-400 italic text-[13px]">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-400 hover:text-purple-300 underline underline-offset-2 inline-flex items-center gap-0.5"
    >
      {children}
      <ExternalLink size={10} />
    </a>
  ),
};

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isError = message.isError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mt-0.5 shadow-md
          ${
            isUser
              ? "bg-gradient-to-br from-purple-500 to-indigo-600"
              : isError
              ? "bg-red-900/50 border border-red-500/40"
              : "bg-gradient-to-br from-purple-600 to-violet-700"
          }`}
      >
        {isUser ? (
          <User size={13} className="text-white" />
        ) : isError ? (
          <AlertCircle size={13} className="text-red-400" />
        ) : (
          <Bot size={13} className="text-white" />
        )}
      </div>

      {/* Bubble content */}
      <div
        className={`max-w-[84%] rounded-2xl px-4 py-3 shadow-md
          ${
            isUser
              ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-tr-sm"
              : isError
              ? "bg-red-900/25 border border-red-500/30 rounded-tl-sm"
              : "bg-slate-800/90 border border-slate-700/40 rounded-tl-sm"
          }`}
      >
        {isError ? (
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-300 leading-relaxed">{message.content}</p>
          </div>
        ) : isUser ? (
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-purple-400 rounded-full animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shadow-md">
        <Bot size={13} className="text-white" />
      </div>
      <div className="bg-slate-800/90 border border-slate-700/40 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Chatbot ─────────────────────────────────────────────────────────────

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // ── Scroll-to-bottom button visibility ───────────────────────────────────────
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 120);
  };

  // ── Unread badge ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const assistantMessages = messages.filter((m) => m.role === "assistant" && m.id !== "welcome");
      setUnreadCount(assistantMessages.length);
    } else {
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  // ── Focus on open ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 280);
  }, [isOpen]);

  // ── Cleanup ──────────────────────────────────────────────────────────────────
  useEffect(() => () => abortControllerRef.current?.abort(), []);

  // ─── Send Message ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (queryOverride) => {
      const text = (queryOverride ?? inputValue).trim();
      if (!text || isStreaming) return;

      if (!hasInteracted) {
        setShowChips(false);
        setHasInteracted(true);
      }

      setInputValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      const userMsg = { role: "user", content: text, id: `u-${Date.now()}` };
      const assistantId = `a-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "assistant", content: "", id: assistantId, isStreaming: true },
      ]);
      setIsStreaming(true);

      // Build history for API (exclude system welcome + placeholders)
      const history = messages
        .filter((m) => m.id !== "welcome" && !m.isError && !m.isStreaming)
        .map(({ role, content }) => ({ role, content }));
      history.push({ role: "user", content: text });

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? `Server error ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (!raw) continue;

            let parsed;
            try { parsed = JSON.parse(raw); } catch { continue; }

            if (parsed.type === "delta") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.content }
                    : m
                )
              );
            } else if (parsed.type === "done") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, isStreaming: false } : m
                )
              );
              break;
            } else if (parsed.type === "error") {
              throw new Error(parsed.message);
            }
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        setMessages((prev) =>
          prev
            .filter((m) => m.id !== assistantId)
            .concat({
              role: "assistant",
              content: `⚠️ **Connection error:** ${err.message}.\n\nPlease check your internet connection and try again.`,
              id: `err-${Date.now()}`,
              isError: true,
            })
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [inputValue, isStreaming, messages, hasInteracted]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearChat = () => {
    abortControllerRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setShowChips(true);
    setHasInteracted(false);
    setIsStreaming(false);
  };

  const handleTextareaChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 108) + "px";
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* ── Chat Panel ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{ transformOrigin: "bottom right" }}
            className="w-[380px] sm:w-[420px] h-[620px] flex flex-col rounded-2xl overflow-hidden
              bg-[#0f0f1a] border border-purple-900/40 shadow-2xl shadow-purple-950/60"
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0
                bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900
                border-b border-purple-800/30"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/50">
                  <Bot size={20} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-white">AlgoBot</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-800/60 text-purple-300 border border-purple-700/50 font-medium">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {isStreaming ? (
                    <span className="text-purple-400 flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" /> Thinking…
                    </span>
                  ) : (
                    "AlgoBuddy Guide · DSA Expert"
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="New conversation"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500
                    hover:text-slate-300 hover:bg-slate-800/70 transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500
                    hover:text-white hover:bg-slate-800/70 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50"
              style={{ scrollbarWidth: "thin" }}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isStreaming &&
                messages[messages.length - 1]?.content === "" && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-to-bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-[140px] right-6 w-8 h-8 rounded-full bg-slate-700 border border-slate-600 
                    flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors shadow-lg"
                >
                  <ChevronDown size={16} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Suggestion chips */}
            <AnimatePresence>
              {showChips && !isStreaming && (
                <motion.div
                  key="chips"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden shrink-0"
                >
                  <div className="px-4 pt-3 pb-2 border-t border-slate-800/60 space-y-2.5">
                    {CHIP_CATEGORIES.map((cat) => (
                      <div key={cat.label}>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                          {cat.label}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.chips.map((chip) => (
                            <button
                              key={chip.id}
                              onClick={() => sendMessage(chip.query)}
                              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all duration-150 font-medium
                                ${chipColors[cat.color]}`}
                            >
                              {chip.emoji} {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area */}
            <div className="px-3 py-3 border-t border-slate-800/60 bg-[#0f0f1a] shrink-0">
              <div
                className="flex items-end gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2
                  focus-within:border-purple-500/50 focus-within:bg-slate-800/80 transition-all duration-200"
              >
                <textarea
                  ref={(el) => {
                    inputRef.current = el;
                    textareaRef.current = el;
                  }}
                  rows={1}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about AlgoBuddy or any DSA topic…"
                  disabled={isStreaming}
                  className="flex-1 bg-transparent text-[13px] text-slate-200 placeholder-slate-500
                    resize-none outline-none leading-relaxed min-h-[24px] max-h-[108px]
                    disabled:opacity-50 scrollbar-none"
                  style={{ scrollbarWidth: "none" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isStreaming}
                  className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600
                    flex items-center justify-center text-white shadow-md
                    hover:from-purple-400 hover:to-violet-500 active:scale-95 transition-all duration-150
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-violet-600"
                  aria-label="Send"
                >
                  {isStreaming ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <p className="text-[10px] text-slate-600">
                  ↵ Send &nbsp;·&nbsp; Shift+↵ New line
                </p>
                <a
                  href="https://www.algobuddy.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-purple-600 hover:text-purple-400 transition-colors flex items-center gap-0.5"
                >
                  algobuddy.me <ExternalLink size={8} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Trigger Button ─────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700
          flex items-center justify-center shadow-xl shadow-purple-950/60
          hover:shadow-2xl hover:shadow-purple-900/70 transition-shadow"
        aria-label={isOpen ? "Close AlgoBot" : "Open AlgoBot"}
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 opacity-0"
          whileHover={{ opacity: 0.2 }}
          transition={{ duration: 0.2 }}
        />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkle badge */}
        <motion.div
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500
            border-2 border-[#0f0f1a] flex items-center justify-center shadow-sm"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Sparkles size={9} className="text-white" />
        </motion.div>

        {/* Unread badge */}
        <AnimatePresence>
          {!isOpen && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-red-500
                border-2 border-[#0f0f1a] flex items-center justify-center text-[9px] font-bold text-white shadow"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}