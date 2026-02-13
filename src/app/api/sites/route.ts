import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sites = await prisma.site.findMany({
    select: { hostname: true },
    orderBy: { lastSeen: "desc" },
  });
  return NextResponse.json(sites);
}
