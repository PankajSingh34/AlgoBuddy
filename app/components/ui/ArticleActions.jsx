"use client";
import { useState } from "react";
import { Copy, Share2, Check } from "lucide-react";

export default function ArticleActions() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed: ", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] hover:bg-[hsl(var(--surface-muted))] transition-all duration-200"
      >
        {copied ? (
          <Check className="w-4 h-4 text-[hsl(var(--success))]" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span>{copied ? "Copied!" : "Copy Link"}</span>
      </button>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] hover:bg-[hsl(var(--surface-muted))] transition-all duration-200"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
    </div>
  );
}
