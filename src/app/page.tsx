import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import SiteCountWidget from "@/components/SiteCountWidget";
import ThemeToggle from "@/components/ThemeToggle";

export default async function HomePage() {
  const siteCount = await prisma.site.count();
  const user = await getSession();
  return (
    <div className="min-h-screen">
      <nav className="animate-fade-in border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-amber-500 transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300">
            AdFlow
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          {user ? (
            <>
              <span className="text-slate-600 dark:text-slate-300">{user.email}</span>
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Log out
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 transition-colors hover:bg-amber-400"
              >
                Get started
              </Link>
            </>
          )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h1 className="animate-fade-in-up mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white">
            Ads that work for{" "}
            <span className="text-amber-500 dark:text-amber-400">everyone</span>
          </h1>
          <p className="animate-fade-in-up mx-auto mb-12 max-w-2xl text-xl text-slate-600 dark:text-slate-400">
            Create ads, add our snippet to your website, and track how many people
            click. Simple, fast, and free.
          </p>
          <div className="animate-fade-in-up flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-900 transition-transform hover:scale-105 hover:bg-amber-400"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-300 px-8 py-4 text-lg font-medium text-slate-700 transition-transform hover:scale-105 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800"
            >
              I have an account
            </Link>
            <Link
              href="/preview"
              className="rounded-xl border border-slate-300 px-8 py-4 text-lg font-medium text-slate-700 transition-transform hover:scale-105 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800"
            >
              See it in action
            </Link>
          </div>
          <SiteCountWidget initialCount={siteCount} />
          {user && (
            <Link
              href="/dashboard"
              className="mt-4 block text-lg font-medium text-amber-500 transition-colors hover:text-amber-600 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
            <div className="mb-3 text-3xl">📝</div>
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Create ads</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Add your ad with a name, image, and link. Your ads go live instantly.
            </p>
          </div>
          <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
            <div className="mb-3 text-3xl">🔗</div>
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Embed snippet</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Copy one line of code to add ads to any website. No setup required.
            </p>
          </div>
          <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
            <div className="mb-3 text-3xl">📊</div>
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Track clicks</h3>
            <p className="text-slate-600 dark:text-slate-400">
              See exactly how many people clicked each ad. Real-time analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
