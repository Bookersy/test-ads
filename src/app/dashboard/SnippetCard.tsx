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
    <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Add ads to your website</h2>
      <p className="mb-4 text-slate-600 dark:text-slate-400">
        Copy this code and paste it before the closing <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">&lt;/body&gt;</code> tag on any page.
      </p>
      <div className="relative">
        <pre className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-100 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <code>{snippet}</code>
        </pre>
        <button
          onClick={copySnippet}
          className="absolute right-2 top-2 rounded-lg bg-slate-200 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
