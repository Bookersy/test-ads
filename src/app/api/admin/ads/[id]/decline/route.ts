import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.ad.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
