"use client";

import { useState } from "react";

export function CopySnippet({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <pre className="bg-surface-2 border border-border rounded-DEFAULT p-4 text-xs text-content-2 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-[10px] font-medium px-2.5 py-1 rounded-sm bg-surface-1 border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold/30 transition-colors"
      >
        {copied ? "✓" : label}
      </button>
    </div>
  );
}
