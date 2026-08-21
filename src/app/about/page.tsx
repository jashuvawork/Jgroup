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
    <div className="min-h-screen bg-black">
      <MasterNav />

      <section className="flex min-h-[70vh] items-center justify-center px-6 pt-24">
        <div className="max-w-3xl text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40">The J Story</p>
          <h1 className="mt-6 font-[family-name:var(--font-playfair)] text-5xl font-light text-white md:text-6xl">
            One Vision.<br />Many Possibilities.
          </h1>
        </div>
      </section>

      {sections.map((section, i) => (
        <section key={section.title} className={`px-6 py-20 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-light text-white md:text-3xl">
              {section.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/50">{section.content}</p>
          </div>
        </section>
      ))}

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-[family-name:var(--font-playfair)] text-3xl font-light text-white">
            The J Ecosystem
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((biz) => (
              <Link
                key={biz.id}
                href={biz.route}
                className="group rounded-2xl border border-white/5 p-6 transition-all hover:border-white/15 hover:bg-white/5"
              >
                <h3 className="text-lg font-light text-white group-hover:text-white/90">{biz.name}</h3>
                <p className="mt-2 text-sm text-white/40">{biz.tagline}</p>
                <span className="mt-4 inline-block text-xs tracking-wider uppercase text-white/30 group-hover:text-white/60">
                  Explore →
                </span>
              </Link>
            ))}
            <div className="rounded-2xl border border-dashed border-white/10 p-6">
              <h3 className="text-lg font-light text-white/30">Future J Worlds</h3>
              <p className="mt-2 text-sm text-white/20">More ventures coming soon.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
