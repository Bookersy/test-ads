import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
