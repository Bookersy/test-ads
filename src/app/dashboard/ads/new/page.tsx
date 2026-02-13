"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewAdPage() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl, link, durationDays }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Failed to create ad (${res.status})`);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <Link href="/dashboard" className="mb-6 inline-block text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Back to dashboard
      </Link>
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Create new ad</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Your ad will appear on websites that use our snippet.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Ad name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              placeholder="e.g. Summer Sale"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              placeholder="https://example.com/your-ad-image.jpg"
            />
            {imageUrl && (
              <div className="mt-2">
                <p className="mb-1 text-xs text-slate-500">Preview:</p>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-32 rounded-lg border border-slate-300 object-cover dark:border-slate-700"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">
              Run for (days)
            </label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {Array.from({ length: 100 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Countdown starts when admin approves your ad
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Link URL</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              placeholder="https://example.com/your-site"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 py-3 font-medium text-slate-900 hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create ad"}
          </button>
        </form>
      </div>
    </div>
  );
}
