export const COMPARISON_HISTORY_KEY = "algobuddy_algorithm_comparison_history";
export const DEFAULT_COMPARISON_HISTORY_LIMIT = 25;

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getStorage = (storage) => {
  if (storage) return storage;
  if (typeof window !== "undefined") return window.localStorage;
  return null;
};

export function listComparisonHistory({ storage } = {}) {
  const targetStorage = getStorage(storage);
  if (!targetStorage) return [];

  const stored = targetStorage.getItem(COMPARISON_HISTORY_KEY);
  const history = stored ? safeParse(stored, []) : [];
  return Array.isArray(history) ? history : [];
}

export function saveComparisonSession(session, { storage, limit = DEFAULT_COMPARISON_HISTORY_LIMIT } = {}) {
  const targetStorage = getStorage(storage);
  if (!targetStorage) return null;

  const now = new Date().toISOString();
  const entry = {
    id: session.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: session.createdAt || now,
    algorithms: Array.isArray(session.algorithms) ? session.algorithms : [],
    inputSize: Number(session.inputSize) || 0,
    executionTimeMs: Number(session.executionTimeMs) || 0,
    complexity: session.complexity || "",
    notes: session.notes || "",
  };

  const history = listComparisonHistory({ storage: targetStorage });
  const deduped = history.filter((item) => item.id !== entry.id);
  const nextHistory = [entry, ...deduped].slice(0, limit);

  targetStorage.setItem(COMPARISON_HISTORY_KEY, JSON.stringify(nextHistory));
  return entry;
}

export function clearComparisonHistory({ storage } = {}) {
  const targetStorage = getStorage(storage);
  if (!targetStorage) return;
  targetStorage.removeItem(COMPARISON_HISTORY_KEY);
}
