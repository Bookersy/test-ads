import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deleteExpiredAds } from "@/lib/ads";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
};

export async function GET() {
  await deleteExpiredAds();

  const allApproved = await prisma.ad.findMany({
    where: { status: "approved", approvedAt: { not: null } },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      link: true,
      createdAt: true,
      approvedAt: true,
      durationDays: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const ads = allApproved.filter((ad) => {
    if (!ad.approvedAt) return false;
    const end = new Date(ad.approvedAt);
    end.setDate(end.getDate() + ad.durationDays);
    return now <= end;
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
