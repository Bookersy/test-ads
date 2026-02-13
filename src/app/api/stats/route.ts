import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const siteCount = await prisma.site.count();
  return NextResponse.json({ siteCount });
}
