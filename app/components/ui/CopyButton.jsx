const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);

    saveCopiedSnippet({
      id: Date.now().toString(),
      title: title || "Code Snippet",
      language: selectedLanguage,
      code: text,
    });

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
};