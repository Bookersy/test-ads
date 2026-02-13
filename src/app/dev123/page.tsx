import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { deleteExpiredAds } from "@/lib/ads";
import DevDashboard from "./DevDashboard";
import ThemeToggle from "@/components/ThemeToggle";

export default async function DevDashboardPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (!isAdmin(user.email)) redirect("/dashboard");

  await deleteExpiredAds();

  const db = await getDb();
  const [pending, approved] = await Promise.all([
    db.ad.findMany({
      where: { status: "pending" },
      include: { owner: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.ad.findMany({
      where: { status: "approved" },
      include: { owner: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/dashboard"
            className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Back to dashboard
          </a>
          <ThemeToggle />
        </div>
        <h1 className="mb-8 text-2xl font-bold text-amber-500 dark:text-amber-400">
          Developer Dashboard
        </h1>
        <DevDashboard initialPending={pending} initialApproved={approved} />
      </div>
    </div>
  );
}
