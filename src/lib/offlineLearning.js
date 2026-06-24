export const OFFLINE_LEARNING_KEY = "algobuddy_offline_learning_resources";
export const DEFAULT_OFFLINE_RESOURCE_LIMIT = 50;

const parseJson = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const resolveStorage = (storage) => {
  if (storage) return storage;
  if (typeof window !== "undefined") return window.localStorage;
  return null;
};

export function listOfflineResources({ storage } = {}) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) return [];

  const stored = targetStorage.getItem(OFFLINE_LEARNING_KEY);
  const resources = stored ? parseJson(stored, []) : [];
  return Array.isArray(resources) ? resources : [];
}

export function saveOfflineResource(resource, { storage, limit = DEFAULT_OFFLINE_RESOURCE_LIMIT } = {}) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) return null;

  const now = new Date().toISOString();
  const entry = {
    id: resource.id || resource.url,
    type: resource.type || "visualization",
    title: resource.title || "Untitled resource",
    url: resource.url || "",
    synced: Boolean(resource.synced),
    savedAt: resource.savedAt || now,
    lastAccessedAt: resource.lastAccessedAt || now,
  };

  if (!entry.id) {
    throw new Error("Offline resource requires an id or url");
  }

  const existing = listOfflineResources({ storage: targetStorage });
  const nextResources = [
    entry,
    ...existing.filter((item) => item.id !== entry.id),
  ].slice(0, limit);

  targetStorage.setItem(OFFLINE_LEARNING_KEY, JSON.stringify(nextResources));
  return entry;
}

export function markOfflineResourceSynced(id, { storage } = {}) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) return null;

  const resources = listOfflineResources({ storage: targetStorage });
  const nextResources = resources.map((item) =>
    item.id === id ? { ...item, synced: true, syncedAt: new Date().toISOString() } : item,
  );

  targetStorage.setItem(OFFLINE_LEARNING_KEY, JSON.stringify(nextResources));
  return nextResources.find((item) => item.id === id) || null;
}

export function removeOfflineResource(id, { storage } = {}) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) return;

  const resources = listOfflineResources({ storage: targetStorage });
  targetStorage.setItem(
    OFFLINE_LEARNING_KEY,
    JSON.stringify(resources.filter((item) => item.id !== id)),
  );
}
