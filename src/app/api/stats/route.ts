import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const siteCount = await db.site.count();
  return NextResponse.json({ siteCount });
}
