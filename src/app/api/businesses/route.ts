import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api";

export async function GET() {
  const businesses = await prisma.business.findMany({
    where: { status: { in: ["active", "coming_soon"] } },
    include: { theme: true },
    orderBy: { sortOrder: "asc" },
  });
  return jsonResponse(businesses);
}

export async function POST(request: Request) {
  const body = await request.json();
  const business = await prisma.business.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      tagline: body.tagline,
      category: body.category,
      route: body.route || `/${body.slug}`,
      status: body.status || "active",
      sortOrder: body.sortOrder || 0,
      heroImage: body.heroImage,
      theme: body.theme
        ? { create: body.theme }
        : undefined,
    },
    include: { theme: true },
  });
  return jsonResponse(business, 201);
}
