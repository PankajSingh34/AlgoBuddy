"use client";

import React, { useState } from "react";
import { useGlobalCollaboration } from "@/app/components/ui/CollaborationProvider";
import { Copy, Plus, LogIn, Users, LogOut, Download } from "lucide-react";

export default function CollaborationToolbar() {
  const {
    session,
    createSession,
    joinSession,
    leaveSession,
    exportRecording,
    participants,
  } = useGlobalCollaboration();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      await createSession({
        title: "Study Room",
        visibility: "public",
        module: "visualizer",
      });
    } catch (err) {
      setError(err.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      await joinSession({ sessionCode: joinCode });
      setShowJoin(false);
      setJoinCode("");
    } catch (err) {
      setError(err.message || "Failed to join session");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!session?.joinCode) return;
    const url = new URL(window.location.href);
    url.searchParams.set("session", session.joinCode);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    try {
      const traceJson = exportRecording();
      const blob = new Blob([traceJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `algobuddy-session-${new Date()
        .toISOString()
        .slice(0, 19)
        .replaceAll(":", "-")}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  if (session) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 mx-6 mb-6">
        <div className="flex items-center gap-2 border-r pr-4 dark:border-slate-800">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Live Room
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {session.joinCode}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 transition-colors dark:text-violet-400 dark:hover:bg-violet-500/10"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Users className="h-4 w-4" />
            <span>{participants.length}</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleExport}
            title="Export Recording"
            className="flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={leaveSession}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Leave
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-6 mb-6 flex flex-col sm:flex-row items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 mr-auto">
        <Users className="h-5 w-5 text-violet-500" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Collaborative Study Room
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        {error && <span className="text-xs text-red-500">{error}</span>}
        
        {showJoin ? (
          <form onSubmit={handleJoin} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="rounded-md border border-slate-300 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-violet-500 dark:border-slate-700 dark:text-white"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !joinCode}
              className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Joining..." : "Join"}
            </button>
            <button
              type="button"
              onClick={() => setShowJoin(false)}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <button
              onClick={() => setShowJoin(true)}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LogIn className="h-4 w-4" />
              Join Room
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {loading ? "Creating..." : "Create Room"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
