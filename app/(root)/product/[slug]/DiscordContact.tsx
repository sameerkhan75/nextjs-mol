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
    <div className="flex flex-col items-center space-y-2 mt-2">
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition text-sm"
        onClick={handleCopy}
        aria-label="Copy Discord ID"
      >
        {copied ? "Copied!" : "Message me on Discord"}
      </button>
      <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded select-all mt-1">{discordId}</span>
    </div>
  );
} 