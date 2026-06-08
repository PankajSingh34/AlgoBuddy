import { useState, useRef, useEffect, useCallback } from "react";
import { useGlobalCollaboration } from "@/app/components/ui/CollaborationProvider";

export default function usePlayback(initialSpeed = 1) {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  const isPausedRef = useRef(false);
  const speedRef = useRef(initialSpeed);

  // Pause resolution for async/await (Sorting algorithms)
  const pausePromiseRef = useRef(null);
  const pauseResolveRef = useRef(null);

  const {
    session,
    presenterId,
    clientId,
    registerHandler,
    unregisterHandler,
    broadcastEvent,
  } = useGlobalCollaboration();

  const isPresenter = !session || (presenterId && presenterId === clientId) || (!presenterId && session);

  // Sync state from remote events
  useEffect(() => {
    const handler = (delta, envelope) => {
      if (envelope?.eventName === "playback:toggle") {
        internalTogglePlayPauseRef.current();
      } else if (envelope?.eventName === "playback:set_pause" && delta?.isPaused !== undefined) {
        internalSetIsPausedRef.current(delta.isPaused);
      } else if (envelope?.eventName === "playback:speed" && delta?.speed !== undefined) {
        setSpeedRef.current(delta.speed);
      }
    };
    registerHandler("usePlayback", handler);
    return () => unregisterHandler("usePlayback");
  }, [registerHandler, unregisterHandler]);

  const internalSetIsPaused = useCallback((nextPaused) => {
    setIsPaused((prev) => {
      const next = typeof nextPaused === "function" ? nextPaused(prev) : nextPaused;
      isPausedRef.current = next;

      if (!next && pauseResolveRef.current && pausePromiseRef.current) {
        pauseResolveRef.current();
        pausePromiseRef.current = null;
        pauseResolveRef.current = null;
      }
      return next;
    });
  }, []);

  const internalSetIsPausedRef = useRef(internalSetIsPaused);
  internalSetIsPausedRef.current = internalSetIsPaused;

  const internalTogglePlayPause = useCallback(() => {
    internalSetIsPaused((prev) => !prev);
  }, [internalSetIsPaused]);

  const internalTogglePlayPauseRef = useRef(internalTogglePlayPause);
  internalTogglePlayPauseRef.current = internalTogglePlayPause;

  const setSpeedRef = useRef(setSpeed);
  setSpeedRef.current = setSpeed;

  const setPausedSync = useCallback((val) => {
    internalSetIsPaused(val);
    if (isPresenter) {
      broadcastEvent("playback:set_pause", { isPaused: val });
    }
  }, [internalSetIsPaused, isPresenter, broadcastEvent]);

  const togglePlayPause = useCallback(() => {
    internalTogglePlayPause();
    if (isPresenter) {
      broadcastEvent("playback:toggle", {});
    }
  }, [internalTogglePlayPause, isPresenter, broadcastEvent]);

  // Async function for sorting algorithms to await between steps
  const checkPause = async () => {
    if (isPausedRef.current) {
      if (!pausePromiseRef.current) {
        pausePromiseRef.current = new Promise((resolve) => {
          pauseResolveRef.current = resolve;
        });
      }
      await pausePromiseRef.current;
    }
  };

  const increaseSpeed = useCallback(() => {
    setSpeed((s) => {
      const next = Math.min(s + 0.5, 5);
      if (isPresenter) broadcastEvent("playback:speed", { speed: next });
      return next;
    });
  }, [isPresenter, broadcastEvent]);

  const decreaseSpeed = useCallback(() => {
    setSpeed((s) => {
      const next = Math.max(s - 0.5, 0.5);
      if (isPresenter) broadcastEvent("playback:speed", { speed: next });
      return next;
    });
  }, [isPresenter, broadcastEvent]);

  const setSpeedSync = useCallback((val) => {
    setSpeed((s) => {
      const next = typeof val === "function" ? val(s) : val;
      if (isPresenter) broadcastEvent("playback:speed", { speed: next });
      return next;
    });
  }, [isPresenter, broadcastEvent]);

  // Ensure speed ref is always synced for setTimeout delays
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return {
    isPaused,
    setIsPaused: setPausedSync,
    isPausedRef,
    speed,
    speedRef,
    setSpeed: setSpeedSync,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  };
}
