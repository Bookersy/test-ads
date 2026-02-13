"use client";

import { useState } from "react";

interface Site {
  hostname: string;
}

export default function SiteCountWidget({ initialCount }: { initialCount: number }) {
  const [open, setOpen] = useState(false);
  const [sites, setSites] = useState<Site[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (initialCount === 0) return;
    if (!open) {
      setLoading(true);
      setOpen(true);
      try {
        const res = await fetch("/api/sites");
        const data = await res.json();
        setSites(data);
      } catch {
        setSites([]);
      } finally {
        setLoading(false);
      }
    } else {
      setOpen(false);
    }
  }

  const displayUrl = (hostname: string) => {
    if (hostname === "localhost") return "http://localhost";
    return `https://${hostname}`;
  };

  const faviconUrl = (hostname: string) =>
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`;

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`mt-6 text-lg text-amber-500 transition-colors hover:text-amber-600 hover:underline dark:text-amber-400 dark:hover:text-amber-300 ${initialCount === 0 ? "cursor-default" : "cursor-pointer"}`}
      >
        {initialCount} {initialCount === 1 ? "website" : "websites"} {initialCount === 1 ? "uses" : "use"} AdFlow
      </button>

      {open && initialCount > 0 && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Websites using AdFlow
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <p className="py-4 text-center text-slate-600 dark:text-slate-400">Loading...</p>
              ) : sites && sites.length > 0 ? (
                <ul className="space-y-2">
                  {sites.map((site) => (
                    <li key={site.hostname}>
                      <a
                        href={displayUrl(site.hostname)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                      >
                        <img
                          src={faviconUrl(site.hostname)}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded"
                        />
                        <span className="truncate text-slate-700 dark:text-slate-300">
                          {displayUrl(site.hostname)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-center text-slate-600 dark:text-slate-400">No sites yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
