import { getDb } from "./db";

export async function deleteExpiredAds() {
  const prisma = await getDb();
  const now = new Date();
  const ads = await prisma.ad.findMany({
    where: {
      status: "approved",
      approvedAt: { not: null },
    },
    select: { id: true, approvedAt: true, durationDays: true },
  });

  const toDelete: string[] = [];
  for (const ad of ads) {
    if (ad.approvedAt) {
      const endDate = new Date(ad.approvedAt);
      endDate.setDate(endDate.getDate() + ad.durationDays);
      const deleteAfter = new Date(endDate);
      deleteAfter.setDate(deleteAfter.getDate() + 1); // Remove 1 day after expiring
      if (now > deleteAfter) {
        toDelete.push(ad.id);
      }
    }
  }

  if (toDelete.length > 0) {
    await prisma.ad.deleteMany({ where: { id: { in: toDelete } } });
  }
}

export function getDaysRemaining(approvedAt: Date | null, durationDays: number): number | null {
  if (!approvedAt) return null;
  const endDate = new Date(approvedAt);
  endDate.setDate(endDate.getDate() + durationDays);
  const now = new Date();
  if (now > endDate) return 0;
  const ms = endDate.getTime() - now.getTime();
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}
