import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", "", { maxAge: 0 });
  return res;
}
