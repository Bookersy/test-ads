import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "./auth-config";

export async function getSession() {
  const options = await (authOptions as () => Promise<NextAuthOptions>)();
  const session = await getServerSession(options);
  return session?.user ?? null;
}
