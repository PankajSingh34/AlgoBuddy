const STORAGE_KEY = "recentCopiedSnippets";
const MAX_SNIPPETS = 10;

export const saveCopiedSnippet = (snippet) => {
  const existing = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  const filtered = existing.filter(
    (item) =>
      !(item.title === snippet.title &&
        item.language === snippet.language)
  );

  const updated = [
    {
      ...snippet,
      copiedAt: new Date().toISOString(),
    },
    ...filtered,
  ].slice(0, MAX_SNIPPETS);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};

export const getCopiedSnippets = () => {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );
};

export const clearCopiedSnippets = () => {
  localStorage.removeItem(STORAGE_KEY);
};