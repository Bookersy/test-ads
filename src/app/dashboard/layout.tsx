import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-xl font-bold text-amber-400">
            AdFlow
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/ads/new"
              className="text-slate-300 hover:text-white"
            >
              New ad
            </Link>
            <span className="text-slate-500">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
