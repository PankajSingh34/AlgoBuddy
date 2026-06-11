"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useCollaboration as useBaseCollaboration } from "@/app/components/ui/useCollaboration";
import { useUser } from "@/features/user/UserContext";

const CollaborationContext = createContext(null);

export function CollaborationProvider({ children }) {
  const { user } = useUser();
  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Anonymous";

  // We need a way for different components to register their state handlers,
  // since this is a global provider but visualizers have local state.
  const [handlers, setHandlers] = useState({});

  const registerHandler = useCallback((key, handler) => {
    setHandlers((prev) => ({ ...prev, [key]: handler }));
  }, []);

  const unregisterHandler = useCallback((key) => {
    setHandlers((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleRemoteStateDelta = useCallback(
    (delta, envelope) => {
      // Broadcast the delta to all registered handlers
      Object.values(handlers).forEach((handler) => {
        try {
          handler(delta, envelope);
        } catch (err) {
          console.error("Error in collaboration handler:", err);
        }
      });
    },
    [handlers]
  );

  const collaboration = useBaseCollaboration({
    displayName,
    onRemoteStateDelta: handleRemoteStateDelta,
  });

  // Attach a generic "broadcast" helper
  const broadcastEvent = useCallback(
    (eventName, payload) => {
      collaboration.sendEnvelope({ type: "event", eventName, ...payload });
    },
    [collaboration]
  );

  const value = {
    ...collaboration,
    displayName,
    registerHandler,
    unregisterHandler,
    broadcastEvent,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useGlobalCollaboration() {
  const context = useContext(CollaborationContext);
  if (!context) {
    // Return a dummy object if not wrapped in provider, so hooks don't break
    return {
      session: null,
      presenterId: null,
      clientId: null,
      registerHandler: () => {},
      unregisterHandler: () => {},
      broadcastEvent: () => {},
      sendEnvelope: () => {},
    };
  }
  return context;
}
