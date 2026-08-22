import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
import { WORLD_LAYOUT } from "@/lib/hub-worlds";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Explore J — ${SITE.brand}`,
  description: "Discover every J world — events, food, foundation, and more to come.",
};

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const businesses = await prisma.business.findMany({
    where: { status: "active" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#050504]">
      <MasterNav />

      <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(201,164,92,0.1),transparent)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-[10px] tracking-[0.5em] text-white/40">J SPACE</p>
          <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-5xl font-medium tracking-[0.1em] text-gradient-gold md:text-7xl">
            EXPLORE J
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light text-white/50">
            {SITE.secondaryTagline} One brand. Many worlds.
          </p>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
          {businesses.map((biz) => {
            const layout = WORLD_LAYOUT[biz.slug];
            const photo = biz.heroImage || layout?.photo;
            return (
              <Link
                key={biz.id}
                href={biz.route}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0b]"
              >
                {photo && (
                  <Image
                    src={photo}
                    alt={biz.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p
                    className="font-[family-name:var(--font-cinzel)] text-xl tracking-[0.1em] md:text-2xl"
                    style={{ color: layout?.accent ?? "#C9A45C" }}
                  >
                    {layout?.label ?? biz.name.toUpperCase()}
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    {layout?.tagline ?? biz.tagline}
                  </p>
                  <p className="mt-4 text-[10px] tracking-[0.35em] text-white/0 transition-colors group-hover:text-white/60">
                    ENTER WORLD →
                  </p>
                </div>
              </Link>
            );
          })}

          <div className="relative flex aspect-[4/5] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
            <div className="text-center px-6">
              <p className="text-3xl text-white/20">+</p>
              <p className="mt-4 text-[10px] tracking-[0.35em] text-white/35">MORE J WORLDS</p>
              <p className="mt-2 text-xs text-white/20">Coming soon.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
