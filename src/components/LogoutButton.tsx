"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    signOut({ redirect: false }).then(() => {
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      Log out
    </button>
  );
}
