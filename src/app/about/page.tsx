import type { Metadata } from "next";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The J Story — J",
  description: "Where we started, what we believe, and where we're going.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const businesses = await prisma.business.findMany({
    where: { status: "active" },
    include: { theme: true },
    orderBy: { sortOrder: "asc" },
  });

  const sections = [
    {
      title: "Where We Started",
      content:
        "J began with a simple belief: that one vision, pursued with passion and integrity, can create extraordinary impact. What started as a local initiative in Hyderabad has grown into a multi-business ecosystem touching lives through celebration, nourishment, and community service.",
    },
    {
      title: "What We Believe",
      content:
        "We believe in creating experiences that matter. Whether it's a surprise birthday that brings tears of joy, a biryani that tastes like home, or a scholarship that changes a child's future — every J venture exists to make life better.",
    },
    {
      title: "What We Create",
      content:
        "From unforgettable events to authentic Andhra cuisine, from community food drives to education initiatives — J creates value across multiple dimensions of human experience.",
    },
    {
      title: "Where We're Going",
      content:
        "J is building toward a future where our ecosystem spans travel, fashion, education, digital services, and more. One brand. Many worlds. Unlimited possibilities.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030303]">
      <MasterNav />

      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-6 pt-24">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-amber-500/6 blur-[100px]" />
        <div className="relative max-w-3xl text-center">
          <p className="text-[10px] tracking-[0.45em] uppercase text-amber-400/50">The J Story</p>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <h1 className="mt-8 font-[family-name:var(--font-cinzel)] text-5xl font-medium leading-tight text-gradient-gold md:text-6xl">
            One Vision.<br />Many Possibilities.
          </h1>
        </div>
      </section>

      {sections.map((section, i) => (
        <section key={section.title} className={`px-6 py-24 ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
          <div className="mx-auto max-w-3xl">
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25">0{i + 1}</p>
            <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-light text-white md:text-4xl">
              {section.title}
            </h2>
            <p className="mt-8 text-lg leading-[1.85] text-white/45">{section.content}</p>
          </div>
        </section>
      ))}

      <section className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">The Ecosystem</p>
            <h2 className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl font-light text-white md:text-4xl">
              The J Ecosystem
            </h2>
          </div>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((biz) => (
              <Link
                key={biz.id}
                href={biz.route}
                className="card-glow group rounded-2xl p-7 transition-all"
              >
                <div
                  className="mb-4 h-1 w-8 rounded-full transition-all group-hover:w-12"
                  style={{ background: biz.theme?.primaryColor || "#c9a227" }}
                />
                <h3 className="font-[family-name:var(--font-cinzel)] text-lg tracking-wide text-white">{biz.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{biz.tagline}</p>
                <span className="mt-5 inline-block text-[10px] tracking-[0.2em] uppercase text-white/25 transition-colors group-hover:text-amber-400/60">
                  Explore →
                </span>
              </Link>
            ))}
            <div className="rounded-2xl border border-dashed border-white/[0.08] p-7">
              <h3 className="font-[family-name:var(--font-cinzel)] text-lg text-white/25">Future J Worlds</h3>
              <p className="mt-2 text-sm text-white/15">More ventures coming soon.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
