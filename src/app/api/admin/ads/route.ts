import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const user = await getSession();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const [pending, approved] = await Promise.all([
    db.ad.findMany({
      where: { status: "pending" },
      include: { owner: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.ad.findMany({
      where: { status: "approved" },
      include: { owner: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ pending, approved });
}
