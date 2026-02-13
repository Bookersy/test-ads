import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <nav className="animate-fade-in border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-amber-500 transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300">
            AdFlow
          </Link>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/ads/new"
              className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              New ad
            </Link>
            <span className="text-slate-500">{user.email ?? user.name ?? "Account"}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
