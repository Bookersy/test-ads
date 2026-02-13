import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "AdFlow - Simple Ad Network",
  description: "Create ads, embed them on your site, track clicks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
