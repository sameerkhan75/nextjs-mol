"use client";

import React, { useState } from "react";

export default function DiscordContact({ discordId }: { discordId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(discordId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <span className="text-sm text-blue-600 font-medium">Message me on Discord:</span>
      <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{discordId}</span>
      <button
        type="button"
        className="p-1 rounded hover:bg-blue-200 transition"
        onClick={handleCopy}
        aria-label="Copy Discord ID"
      >
        {copied ? (
          <span className="text-xs text-green-600 font-semibold">Copied!</span>
        ) : (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
        )}
      </button>
    </div>
  );
} 