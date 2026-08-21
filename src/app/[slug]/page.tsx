import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventsWorld } from "@/components/business/EventsWorld";
import { FoodsWorld } from "@/components/business/FoodsWorld";
import { FoundationWorld } from "@/components/business/FoundationWorld";
import type { Metadata } from "next";
import type { ImpactStatItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const WORLD_COMPONENTS: Record<string, React.ComponentType<{ business: never; impactStats?: ImpactStatItem[] }>> = {
  "j-surprise-events": EventsWorld as never,
  "j-foods": FoodsWorld as never,
  "j-foundation": FoundationWorld as never,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return { title: "Not Found" };
  return {
    title: `${business.name} — J`,
    description: business.description,
  };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug, status: "active" },
    include: {
      theme: true,
      services: { where: { status: "active" }, orderBy: { sortOrder: "asc" } },
      products: { where: { status: "active" }, orderBy: { sortOrder: "asc" }, include: { category: true } },
      categories: { orderBy: { sortOrder: "asc" } },
      foundationProjects: { where: { status: "active" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!business) notFound();

  const WorldComponent = WORLD_COMPONENTS[slug];

  if (!WorldComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-light">{business.name}</h1>
          <p className="mt-4 text-white/50">{business.description}</p>
          <p className="mt-8 text-sm text-white/30">This world is being built. Check back soon.</p>
        </div>
      </div>
    );
  }

  if (slug === "j-foundation") {
    const impactStats = await prisma.impactStat.findMany({ orderBy: { key: "asc" } });
    return <FoundationWorld business={business as never} impactStats={impactStats as ImpactStatItem[]} />;
  }

  return <WorldComponent business={business as never} />;
}
