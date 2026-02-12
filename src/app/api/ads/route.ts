import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSession();
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

  try {
    const { name, imageUrl, link } = await req.json();
    if (!name || !imageUrl || !link) {
      return NextResponse.json(
        { error: "Name, image URL, and link are required" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.create({
      data: { name, imageUrl, link, ownerId: user.id },
    });
    return NextResponse.json(ad);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}
