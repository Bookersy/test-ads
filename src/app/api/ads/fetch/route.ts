import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
};

export async function GET() {
  const ads = await prisma.ad.findMany({
    select: { id: true, name: true, imageUrl: true, link: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  if (ads.length === 0) {
    return NextResponse.json([], { headers: corsHeaders });
  }
  // Weight by recency: newest = highest weight (index 0 = N, index N-1 = 1)
  const weights = ads.map((_, i) => ads.length - i);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  let selected = ads[0];
  for (let i = 0; i < ads.length; i++) {
    r -= weights[i];
    if (r <= 0) {
      selected = ads[i];
      break;
    }
  }
  const { createdAt: _, ...ad } = selected;
  return NextResponse.json([ad], { headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
