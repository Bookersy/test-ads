import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(req: Request) {
  try {
    const { adId } = await req.json();
    if (!adId) {
      return NextResponse.json({ error: "adId required" }, { status: 400, headers: corsHeaders });
    }

    await prisma.ad.update({
      where: { id: adId },
      data: { clicks: { increment: 1 } },
    });
    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch (e) {
    return NextResponse.json({ error: "Invalid ad" }, { status: 400, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
