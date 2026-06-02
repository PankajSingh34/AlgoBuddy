'use client';
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  code: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
      aria-label="Copy code to clipboard"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-300" />}
    </button>
  );
};

export default CopyButton;
