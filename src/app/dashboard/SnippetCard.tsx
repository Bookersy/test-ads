"use client";

import { useState } from "react";

export default function SnippetCard({ baseUrl }: { baseUrl: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = `<script src="${baseUrl}/snippet/script.js"></script>`;

  function copySnippet() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="mb-2 text-lg font-semibold text-white">Add ads to your website</h2>
      <p className="mb-4 text-slate-400">
        Copy this code and paste it before the closing <code className="rounded bg-slate-800 px-1">&lt;/body&gt;</code> tag on any page.
      </p>
      <div className="relative">
        <pre className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
          <code>{snippet}</code>
        </pre>
        <button
          onClick={copySnippet}
          className="absolute right-2 top-2 rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-600 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
