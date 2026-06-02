"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const VisualizerSessionContext = createContext(null);

export function VisualizerSessionProvider({ children }) {
  const [algorithmId, setAlgorithmId] = useState("");
  const [serializer, setSerializer] = useState(null);
  const [deserializer, setDeserializer] = useState(null);

  const registerCallbacks = useCallback((algoId, serializeFn, deserializeFn) => {
    setAlgorithmId(algoId);
    setSerializer(() => serializeFn);
    setDeserializer(() => deserializeFn);
  }, []);

  const unregisterCallbacks = useCallback((algoId) => {
    if (algorithmId === algoId) {
      setAlgorithmId("");
      setSerializer(null);
      setDeserializer(null);
    }
  }, [algorithmId]);

  const exportSession = useCallback(() => {
    if (!serializer) {
      console.warn("No serializer registered for session export.");
      return null;
    }
    try {
      const stateData = serializer();
      return {
        metadata: {
          appName: "AlgoBuddy",
          algorithmId,
          timestamp: new Date().toISOString(),
          schemaVersion: "1.0",
        },
        state: stateData,
      };
    } catch (error) {
      console.error("Failed to serialize session state:", error);
      throw new Error("Serialization failed: " + error.message);
    }
  }, [serializer, algorithmId]);

  const importSession = useCallback((sessionData) => {
    if (!deserializer) {
      console.warn("No deserializer registered for session import.");
      return false;
    }
    try {
      // Validate structure
      if (!sessionData || typeof sessionData !== "object") {
        throw new Error("Invalid session file format.");
      }

      const { metadata, state } = sessionData;
      if (!metadata || !state) {
        throw new Error("Missing session metadata or state details.");
      }

      if (metadata.appName !== "AlgoBuddy") {
        throw new Error("This file was not created by AlgoBuddy.");
      }

      if (metadata.algorithmId !== algorithmId) {
        throw new Error(
          `Algorithm mismatch. This session is for "${metadata.algorithmId}", but you are on "${algorithmId}".`
        );
      }

      // Invoke visualizer deserializer
      deserializer(state);
      return true;
    } catch (error) {
      console.error("Failed to import session state:", error);
      throw error;
    }
  }, [deserializer, algorithmId]);

  return (
    <VisualizerSessionContext.Provider
      value={{
        algorithmId,
        registerCallbacks,
        unregisterCallbacks,
        exportSession,
        importSession,
        hasActiveSession: !!serializer && !!deserializer,
      }}
    >
      {children}
    </VisualizerSessionContext.Provider>
  );
}

export function useVisualizerSession() {
  const context = useContext(VisualizerSessionContext);
  if (!context) {
    throw new Error("useVisualizerSession must be used within a VisualizerSessionProvider");
  }
  return context;
}
