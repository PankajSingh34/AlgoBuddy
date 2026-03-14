'use client';

import { useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  return hljs.highlight(code, { language: validLanguage }).value;
};

const CodeBlock = ({ code = '', language = 'javascript', title = 'Code' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const languages = ['javascript', 'python', 'java', 'c', 'cpp'];
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = highlightCode(code, selectedLanguage);

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      {/* Mac Window Chrome */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-t-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Traffic Light Dots */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C940]"></div>
          </div>
          {/* Title */}
          <span className="text-[#999] text-sm font-medium ml-2">{title}</span>
        </div>
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="text-xs font-medium px-3 py-1 rounded-full bg-[#a435f0] hover:bg-[#8b2dd4] text-white transition-colors duration-200"
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>

      {/* Language Tabs */}
      <div className="bg-[#0f0f0f] border-b border-[#333] px-4 py-3 flex gap-2 overflow-x-auto">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize whitespace-nowrap ${
              selectedLanguage === lang
                ? 'bg-[#a435f0] text-white'
                : 'bg-[#1a1a1a] text-[#999] hover:bg-[#2a2a2a] border border-[#333]'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Code Block */}
      <div className="bg-[#0f0f0f] p-6 overflow-x-auto">
        <pre className="font-mono text-sm text-[#e8e8e8] leading-relaxed">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightedCode,
            }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;