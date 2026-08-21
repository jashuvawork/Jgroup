import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import type { BusinessWithTheme } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const businesses = await prisma.business.findMany({
    where: { status: "active" },
    include: { theme: true },
    orderBy: { sortOrder: "asc" },
  });

  return <HomeClient businesses={businesses as BusinessWithTheme[]} />;
}
