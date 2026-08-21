import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      theme: true,
      services: { where: { status: "active" }, orderBy: { sortOrder: "asc" } },
      products: { where: { status: "active" }, orderBy: { sortOrder: "asc" }, include: { category: true } },
      categories: { orderBy: { sortOrder: "asc" } },
      foundationProjects: { where: { status: "active" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 10 },
      media: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!business) return errorResponse("Business not found", 404);
  return jsonResponse(business);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();
  const business = await prisma.business.update({
    where: { slug },
    data: body,
    include: { theme: true },
  });
  return jsonResponse(business);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await prisma.business.delete({ where: { slug } });
  return jsonResponse({ success: true });
}
