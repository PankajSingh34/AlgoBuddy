export const saveToStorage = (key: string, value: any): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);

    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch {
        return fallback;
      }
    }
  }

  return fallback;
};

export const removeFromStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
