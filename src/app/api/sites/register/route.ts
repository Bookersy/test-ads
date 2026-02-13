import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(req: Request) {
  try {
    const { hostname } = await req.json();
    if (!hostname || typeof hostname !== "string") {
      return NextResponse.json(
        { error: "hostname required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const clean = hostname.trim().toLowerCase();
    if (!clean) {
      return NextResponse.json({ ok: true }, { headers: corsHeaders });
    }

    const requestHost = req.headers.get("host") || "";
    const adflowHost = requestHost.split(":")[0].toLowerCase();
    if (clean === adflowHost) {
      return NextResponse.json({ ok: true }, { headers: corsHeaders });
    }

    const db = await getDb();
    await db.site.upsert({
      where: { hostname: clean },
      create: { hostname: clean },
      update: { lastSeen: new Date() },
    });

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
