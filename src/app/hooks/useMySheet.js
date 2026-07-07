"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/features/user/UserContext";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/apiClient";

// ─── Constants ───────────────────────────────────────────────────────────────
const LOCAL_KEY = "algobuddy_my_sheet";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocal(data) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch {}
}

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

function isSpringBoot() {
  return typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_SPRING_BOOT_API === "true";
}

function apiBase() {
  return process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || "http://localhost:8080";
}

// ─── Server API ──────────────────────────────────────────────────────────────

async function fetchMySheetFromServer() {
  if (isSpringBoot()) {
    const headers = await getAuthHeader();
    if (!headers.Authorization) {
      console.warn("[useMySheet] fetch skipped: No authorization token");
      return null;
    }
    const res = await fetch(`${apiBase()}/api/v1/mysheet`, { headers });
    if (!res.ok) {
      console.error("[useMySheet] fetch failed with status:", res.status);
      return null;
    }
    const data = await res.json();
    // Expect: { items: [ { problemId, addedAt, note } ] }
    const map = {};
    (data.items || []).forEach((item) => {
      map[item.problemId] = { addedAt: item.addedAt, note: item.note || "" };
    });
    return map;
  }

  // Supabase path via Next.js API route
  try {
    const data = await api.request("/api/mysheet");
    return data.sheet || null;
  } catch {
    console.error("[useMySheet] fetch from NextJS failed");
    return null;
  }
}

async function addToSheetOnServer(problemId, note = "") {
  if (isSpringBoot()) {
    const headers = await getAuthHeader();
    if (!headers.Authorization) return;
    const res = await fetch(`${apiBase()}/api/v1/mysheet`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, note }),
    });
    return;
  }

  try {
    await api.request("/api/mysheet", {
      method: "POST",
      body: { problemId, note },
    });
  } catch {}
}

async function removeFromSheetOnServer(problemId) {
  if (isSpringBoot()) {
    const headers = await getAuthHeader();
    if (!headers.Authorization) return;
    const res = await fetch(`${apiBase()}/api/v1/mysheet?problemId=${problemId}`, {
      method: "DELETE",
      headers,
    });
    return;
  }

  try {
    await api.request(`/api/mysheet?problemId=${encodeURIComponent(problemId)}`, {
      method: "DELETE",
    });
  } catch {}
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useMySheet
 *
 * Manages the user's personal curated problem sheet.
 * - Local-first (instant UI, no flicker)
 * - Syncs from server on mount when logged in
 * - Bulk-syncs local entries to server after login
 *
 * Returns:
 *  sheet         – { [problemId]: { addedAt, note } }
 *  isInSheet(id) – boolean
 *  addToSheet(id)
 *  removeFromSheet(id)
 *  sheetCount    – number of problems in sheet
 *  loading
 */
export function useMySheet() {
  const { user } = useUser();
  const [sheet, setSheet] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      setLoading(true);
      const local = readLocal();
      if (!cancelled) setSheet(prev => Object.keys(prev).length === 0 ? local : prev);

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const serverSheet = await fetchMySheetFromServer();
        if (cancelled) return;

        if (serverSheet) {
          // DB is authoritative for logged-in users.
          // 1. Find local-only items (added offline/before login) → sync them up
          const toSync = Object.entries(local)
            .filter(([id]) => !serverSheet[id])
            .map(([id, entry]) => ({ problemId: id, note: entry.note || "" }));

          for (const item of toSync) {
            await addToSheetOnServer(item.problemId, item.note).catch(() => {});
          }

          // 2. After syncing local-only items up, build the authoritative state:
          //    server data + local-only items that were just synced.
          //    Items deleted in another browser (exist in local but not server) are dropped.
          //    Use a functional updater to preserve any concurrent local mutations.
          const authoritative = { ...serverSheet };
          toSync.forEach(({ problemId }) => {
            if (local[problemId]) authoritative[problemId] = local[problemId];
          });

          writeLocal(authoritative);
          if (!cancelled) setSheet(prev => {
            const merged = { ...authoritative };
            for (const id of Object.keys(prev)) {
              if (!merged[id]) merged[id] = prev[id];
            }
            return merged;
          });
        }
      } catch (err) {
        console.error("[useMySheet] sync failed:", err);
      }

      if (!cancelled) setLoading(false);
    };

    init();
    return () => { cancelled = true; };
  }, [user]);

  const addToSheet = useCallback(
    async (problemId, note = "") => {
      const addedAt = new Date().toISOString();
      const next = { ...sheet, [problemId]: { addedAt, note } };
      setSheet(next);
      writeLocal(next);

      if (user) {
        addToSheetOnServer(problemId, note).catch(() => {});
      }
    },
    [sheet, user]
  );

  const removeFromSheet = useCallback(
    async (problemId) => {
      const next = { ...sheet };
      delete next[problemId];
      setSheet(next);
      writeLocal(next);

      if (user) {
        removeFromSheetOnServer(problemId).catch(() => {});
      }
    },
    [sheet, user]
  );

  const isInSheet = useCallback(
    (problemId) => !!sheet[problemId],
    [sheet]
  );

  const sheetCount = Object.keys(sheet).length;

  return { sheet, isInSheet, addToSheet, removeFromSheet, sheetCount, loading };
}
