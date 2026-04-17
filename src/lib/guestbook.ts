import "server-only";

import { prisma } from "@/lib/prisma";

export async function listGuestbookEntries() {
  return prisma.guestbookEntry.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function createGuestbookEntry(input: { name: string; message: string }) {
  return prisma.guestbookEntry.create({
    data: {
      name: input.name.trim(),
      message: input.message.trim(),
      approved: true,
    },
  });
}
