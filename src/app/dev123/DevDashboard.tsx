"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdWithOwner {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
  clicks: number;
  status: string;
  createdAt: Date;
  owner: { email: string | null; name: string | null };
}

export default function DevDashboard({
  initialPending,
  initialApproved,
}: {
  initialPending: AdWithOwner[];
  initialApproved: AdWithOwner[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);

  async function handleApprove(adId: string) {
    const res = await fetch(`/api/admin/ads/${adId}/approve`, {
      method: "POST",
    });
    if (res.ok) {
      const ad = pending.find((a) => a.id === adId);
      if (ad) {
        setPending((p) => p.filter((a) => a.id !== adId));
        setApproved((a) => [{ ...ad, status: "approved" }, ...a]);
      }
      router.refresh();
    }
  }

  async function handleDecline(adId: string) {
    const res = await fetch(`/api/admin/ads/${adId}/decline`, {
      method: "POST",
    });
    if (res.ok) {
      setPending((p) => p.filter((a) => a.id !== adId));
      router.refresh();
    }
  }

  function AdCard({
    ad,
    actions,
  }: {
    ad: AdWithOwner;
    actions?: "approve" | "decline";
  }) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow dark:border-slate-800 dark:bg-slate-900/50">
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
          <h3 className="font-medium text-white">{ad.name}</h3>
          <p className="mt-1 truncate text-sm text-slate-400">{ad.link}</p>
          <p className="mt-1 text-xs text-slate-500">
            by {ad.owner.email || ad.owner.name || "Unknown"}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-sm font-medium text-amber-400">
              {ad.clicks} clicks
            </span>
            {actions === "approve" && (
              <>
                <button
                  onClick={() => handleApprove(ad.id)}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(ad.id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
                >
                  Decline
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Pending ads ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
            No ads awaiting approval.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((ad) => (
              <AdCard key={ad.id} ad={ad} actions="approve" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Approved ads ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
            No approved ads yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
