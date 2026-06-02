"use client";

import { useRef, useState } from "react";
import { useVisualizerSession } from "@/features/collaboration/VisualizerSessionContext";
import { FiDownload, FiUpload } from "react-icons/fi";

export default function VisualizerSessionControls() {
  const fileInputRef = useRef(null);
  const [sessionMessage, setSessionMessage] = useState(null);
  const { hasActiveSession, exportSession, importSession } = useVisualizerSession();

  const handleExport = () => {
    try {
      const session = exportSession();
      if (!session) return;

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);

      const formattedAlgoId = session.metadata.algorithmId.toLowerCase().replace(/\s+/g, "-");
      const fileName = `${formattedAlgoId}-session-${new Date().toISOString().slice(0, 10)}.json`;
      downloadAnchor.setAttribute("download", fileName);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showMsg("Session exported successfully!", "success");
    } catch (err) {
      showMsg("Export failed: " + err.message, "error");
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const sessionData = JSON.parse(event.target.result);
        const success = importSession(sessionData);
        if (success) {
          showMsg("Session imported successfully!", "success");
        }
      } catch (err) {
        showMsg(err.message || "Import failed.", "error");
      }
    };
    reader.onerror = () => {
      showMsg("Failed to read file.", "error");
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset file input
  };

  const showMsg = (text, type) => {
    setSessionMessage({ text, type });
    setTimeout(() => {
      setSessionMessage(null);
    }, 4500);
  };

  if (!hasActiveSession) return null;

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-5 py-3 shadow-sm transition-all duration-300">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Session:</span>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-sm bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold transition shadow-sm cursor-pointer"
        >
          <FiDownload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Export
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-sm bg-[#a435f0] hover:bg-[#8f2cd6] text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm cursor-pointer"
        >
          <FiUpload className="w-4 h-4 text-white" />
          Import
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".json"
          className="hidden"
        />
      </div>

      {sessionMessage && (
        <div
          className={`px-4 py-2 text-sm rounded-lg border transition-all duration-300 animate-fadeIn ${
            sessionMessage.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
          }`}
        >
          {sessionMessage.text}
        </div>
      )}
    </div>
  );
}
