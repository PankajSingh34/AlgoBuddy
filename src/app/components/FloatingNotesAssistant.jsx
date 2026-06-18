"use client";

import { useEffect, useState } from "react";
import { NotebookPen, X, Trash2 } from "lucide-react";

export default function FloatingNotesAssistant() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  // Load saved notes
  useEffect(() => {
    const savedNote = localStorage.getItem("algobuddy-notes");

    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  // Save notes automatically
  useEffect(() => {
    localStorage.setItem("algobuddy-notes", note);
  }, [note]);

  const clearNotes = () => {
    setNote("");
    localStorage.removeItem("algobuddy-notes");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-24 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-r from-purple-500 to-violet-600
          text-white shadow-lg
          flex items-center justify-center
          hover:scale-110 transition
        "
      >
        <NotebookPen size={24} />
      </button>


      {/* Notes Panel */}
      {open && (
        <div
          className="
          fixed bottom-40 right-6
          w-[320px] max-w-[90vw]
          bg-white dark:bg-neutral-900
          rounded-3xl shadow-2xl
          border border-neutral-200
          dark:border-neutral-700
          p-4 z-50
          "
        >

          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg">
              Algorithm Notes
            </h2>

            <button onClick={() => setOpen(false)}>
              <X size={20}/>
            </button>
          </div>


          {/* Text Area */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your algorithm notes here..."
            className="
              w-full h-48
              p-3 rounded-xl
              border border-neutral-300
              dark:bg-neutral-800
              resize-none outline-none
            "
          />


          {/* Footer */}
          <div className="mt-3 flex justify-between items-center">

            <span className="text-sm text-gray-500">
              Auto saved
            </span>

            <button
              onClick={clearNotes}
              className="
                flex items-center gap-2
                text-red-500 hover:text-red-700
              "
            >
              <Trash2 size={16}/>
              Clear
            </button>

          </div>

        </div>
      )}
    </>
  );
}