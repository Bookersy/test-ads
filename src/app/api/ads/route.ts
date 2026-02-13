import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteExpiredAds } from "@/lib/ads";

export async function GET() {
  const user = await getSession();
  await deleteExpiredAds();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ads = await prisma.ad.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!user.id) {
    return NextResponse.json(
      { error: "Session invalid: missing user id" },
      { status: 401 }
    );
  }

  try {
    const { name, imageUrl, link, durationDays } = await req.json();
    if (!name || !imageUrl || !link) {
      return NextResponse.json(
        { error: "Name, image URL, and link are required" },
        { status: 400 }
      );
    }
    const days = Math.min(100, Math.max(1, parseInt(durationDays, 10) || 30));

    const ad = await prisma.ad.create({
      data: {
        name,
        imageUrl,
        link,
        ownerId: user.id,
        status: "pending",
        durationDays: days,
      },
    });
    return NextResponse.json(ad);
  } catch (e) {
    console.error("Ad creation error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
