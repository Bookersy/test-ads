import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const sites = await db.site.findMany({
    select: { hostname: true },
    orderBy: { lastSeen: "desc" },
  });
  return NextResponse.json(sites);
}
