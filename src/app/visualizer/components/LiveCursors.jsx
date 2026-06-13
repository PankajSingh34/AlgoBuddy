"use client";

import React, { useEffect, useRef } from "react";
import { useGlobalCollaboration } from "@/app/components/ui/CollaborationProvider";

// Throttle function for cursor movements
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Generate a random color based on string hash for consistent user cursor colors
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 75%, 50%)`;
  return color;
}

const CursorIcon = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }}
  >
    <path
      d="M5.65376 2.00036C5.03469 1.54347 4.14848 2.05381 4.25055 2.8093L6.96342 22.8872C7.05436 23.5603 7.89311 23.8344 8.41169 23.3611L13.1491 19.0371C13.3857 18.8211 13.6974 18.7231 14.0113 18.7656L19.4674 19.5036C20.1706 19.5988 20.6705 18.8519 20.2796 18.2917L5.65376 2.00036Z"
      fill={color}
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);

export default function LiveCursors() {
  const { session, cursors, sendCursor, clientId } = useGlobalCollaboration();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!session || !sendCursor) return;

    const handlePointerMove = throttle((e) => {
      // Send fractional coordinates relative to the window to handle different screen sizes
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      sendCursor(x, y);
    }, 50);

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [session, sendCursor]);

  if (!session) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {Object.entries(cursors).map(([id, cursor]) => {
        // Don't render our own cursor or stale cursors (> 30 seconds old)
        if (id === clientId || Date.now() - cursor.timestamp > 30000) {
          return null;
        }

        const xPx = cursor.x * window.innerWidth;
        const yPx = cursor.y * window.innerHeight;
        const color = stringToColor(id);

        return (
          <div
            key={id}
            className="absolute top-0 left-0 transition-all duration-75 ease-linear will-change-transform"
            style={{
              transform: `translate(${xPx}px, ${yPx}px)`,
            }}
          >
            <CursorIcon color={color} />
            <div
              className="ml-4 mt-1 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-md"
              style={{ backgroundColor: color }}
            >
              {cursor.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
