import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { name, imageUrl, link } = body;

    const existing = await prisma.ad.findFirst({
      where: { id, ownerId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    const data: { name?: string; imageUrl?: string; link?: string } = {};
    if (name !== undefined) data.name = name;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (link !== undefined) data.link = link;

    const ad = await prisma.ad.update({
      where: { id },
      data,
    });
    return NextResponse.json(ad);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.ad.findFirst({
    where: { id, ownerId: user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Ad not found" }, { status: 404 });
  }

  await prisma.ad.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
