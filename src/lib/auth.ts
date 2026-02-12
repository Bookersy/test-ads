import { cookies } from "next/headers";
import { prisma } from "./db";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  return session?.user ?? null;
}
