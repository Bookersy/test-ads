import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-amber-400">
            AdFlow
          </Link>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Ads that work for{" "}
            <span className="text-amber-400">everyone</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-400">
            Create ads, add our snippet to your website, and track how many people
            click. Simple, fast, and free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-900 hover:bg-amber-400"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-600 px-8 py-4 text-lg font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-800"
            >
              I have an account
            </Link>
            <Link
              href="/preview"
              className="rounded-xl border border-slate-600 px-8 py-4 text-lg font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-800"
            >
              See it in action
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-3 text-3xl">📝</div>
            <h3 className="mb-2 font-semibold text-white">Create ads</h3>
            <p className="text-slate-400">
              Add your ad with a name, image, and link. Your ads go live instantly.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-3 text-3xl">🔗</div>
            <h3 className="mb-2 font-semibold text-white">Embed snippet</h3>
            <p className="text-slate-400">
              Copy one line of code to add ads to any website. No setup required.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-3 text-3xl">📊</div>
            <h3 className="mb-2 font-semibold text-white">Track clicks</h3>
            <p className="text-slate-400">
              See exactly how many people clicked each ad. Real-time analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
