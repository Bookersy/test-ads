import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
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

  const db = await getDb();
  await db.ad.update({
    where: { id },
    data: { status: "approved", approvedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
