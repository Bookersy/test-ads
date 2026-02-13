import Link from "next/link";
import Script from "next/script";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-8 dark:bg-slate-900">
      <Script src="/snippet/script.js" strategy="afterInteractive" />
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-6 inline-block text-amber-500 hover:underline dark:text-amber-400">
          ← AdFlow
        </Link>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Preview: Ad snippet in action</h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          This page demonstrates how ads appear when you add our snippet to your website.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow dark:border-slate-700 dark:bg-slate-800/50">
          <p className="mb-4 text-slate-700 dark:text-slate-300">
            Your content goes here. The ad will appear below.
          </p>
          <div data-adflow />
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-500">
            Add <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">data-adflow</code> to control
            where the ad appears. Otherwise it appends to the body.
          </p>
        </div>
      </div>
    </div>
  );
}
