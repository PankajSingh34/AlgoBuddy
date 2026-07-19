"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const NarrationContext = createContext(null);

export const NarrationProvider = ({ children }) => {
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [log, setLog] = useState([]);
  
  const synthRef = useRef(null);

  // Initialize synth only on client side
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Load preference from local storage
    const savedPreference = localStorage.getItem("algoBuddy_ttsEnabled");
    if (savedPreference !== null) {
      setTtsEnabled(savedPreference === "true");
    }
  }, []);

  const toggleTts = useCallback(() => {
    setTtsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("algoBuddy_ttsEnabled", String(next));
      if (!next && synthRef.current) {
        synthRef.current.cancel(); // Stop speaking immediately if turned off
      }
      return next;
    });
  }, []);

  const speak = useCallback((text, rate = 1.0) => {
    return new Promise((resolve) => {
      if (!text) {
        resolve();
        return;
      }
      
      // Always add to log
      setLog((prev) => [...prev, { text, timestamp: Date.now() }]);

      if (!ttsEnabled || !synthRef.current) {
        resolve();
        return;
      }

      // Cancel any ongoing speech to keep up with animations
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      // Adjust speed to match visualizer
      utterance.rate = rate; 
      
      // Resolve promise when done speaking or on error
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      synthRef.current.speak(utterance);
    });
  }, [ttsEnabled]);

  const clearLog = useCallback(() => {
    setLog([]);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  return (
    <NarrationContext.Provider value={{ ttsEnabled, toggleTts, log, speak, clearLog }}>
      {children}
    </NarrationContext.Provider>
  );
};

export const useNarration = () => {
  const context = useContext(NarrationContext);
  if (!context) {
    throw new Error("useNarration must be used within a NarrationProvider");
  }
  return context;
};
