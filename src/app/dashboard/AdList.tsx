"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Ad {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
  clicks: number;
  status: string;
  durationDays: number;
  approvedAt: Date | null;
  createdAt: Date;
}

export default function AdList({ ads }: { ads: Ad[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleRename(ad: Ad) {
    if (editName.trim() === ad.name) {
      setEditingId(null);
      return;
    }
    try {
      const res = await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        router.refresh();
      }
    } catch {
      setEditingId(null);
    }
  }

  async function handleDelete(ad: Ad) {
    if (!confirm(`Delete "${ad.name}"? This cannot be undone.`)) return;
    setDeletingId(ad.id);
    try {
      const res = await fetch(`/api/ads/${ad.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  function startEditing(ad: Ad) {
    setEditingId(ad.id);
    setEditName(ad.name);
  }

  if (ads.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <p className="text-slate-600 dark:text-slate-400">You haven&apos;t created any ads yet.</p>
        <a
          href="/dashboard/ads/new"
          className="mt-2 inline-block text-amber-500 hover:underline dark:text-amber-400"
        >
          Create your first ad →
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="animate-fade-in-up overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none"
        >
          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={ad.imageUrl}
              alt={ad.name}
              className="h-40 w-full object-cover"
            />
          </a>
          <div className="p-4">
            {editingId === ad.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(ad);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={() => handleRename(ad)}
                  className="rounded bg-amber-500 px-2 py-1 text-sm font-medium text-slate-900 hover:bg-amber-400"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded bg-slate-700 px-2 py-1 text-sm text-slate-300 hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <h3 className="flex-1 font-medium text-slate-900 dark:text-white">{ad.name}</h3>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEditing(ad)}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400"
                    title="Rename"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(ad)}
                    disabled={deletingId === ad.id}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400 disabled:opacity-50"
                    title="Delete"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">{ad.link}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {ad.status === "pending" && (
                <span className="rounded-full bg-yellow-500/20 px-3 py-0.5 text-sm font-medium text-yellow-400">
                  Pending approval
                </span>
              )}
              {ad.status === "approved" &&
                ad.approvedAt &&
                (() => {
                  const end = new Date(ad.approvedAt);
                  end.setDate(end.getDate() + ad.durationDays);
                  const msLeft = end.getTime() - Date.now();
                  if (msLeft <= 0) {
                    return (
                      <span className="rounded-full bg-slate-600/50 px-3 py-0.5 text-sm text-slate-300">
                        Expired
                      </span>
                    );
                  }
                  const days = Math.floor(msLeft / (24 * 60 * 60 * 1000));
                  const hours = Math.floor((msLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                  const minutes = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
                  let text = "";
                  if (days > 0) text = `${days} day${days !== 1 ? "s" : ""} ${hours}h left`;
                  else if (hours > 0) text = `${hours} hour${hours !== 1 ? "s" : ""} ${minutes}m left`;
                  else text = `${minutes} minute${minutes !== 1 ? "s" : ""} left`;
                  return (
                    <span className="rounded-full bg-slate-600/50 px-3 py-0.5 text-sm text-slate-300">
                      {text}
                    </span>
                  );
                })()}
              <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-sm font-medium text-amber-400">
                {ad.clicks} clicks
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
