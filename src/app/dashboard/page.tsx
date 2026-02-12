import Link from "next/link";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdList from "./AdList";
import SnippetCard from "./SnippetCard";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) return null;

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const baseUrl = host.includes("localhost") ? `http://${host}` : `https://${host}`;

  const ads = await prisma.ad.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-slate-400">Create ads and add our snippet to your website</p>
      </div>

      <SnippetCard baseUrl={baseUrl} />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Your ads</h2>
          <Link
            href="/dashboard/ads/new"
            className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400"
          >
            Create ad
          </Link>
        </div>
        <AdList ads={ads} />
      </div>
    </div>
  );
}
