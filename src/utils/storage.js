export const saveToStorage = (key, value) => {
  if (typeof window !== "undefined" && localStorage) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const loadFromStorage = (key, fallback) => {
  if (typeof window !== "undefined" && localStorage) {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    } catch {
      return fallback;
    }
  }

  return fallback;
};

export const removeFromStorage = (key) => {
  if (typeof window !== "undefined" && localStorage) {
    localStorage.removeItem(key);
  }
};