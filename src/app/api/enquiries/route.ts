import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();
  const enquiry = await prisma.enquiry.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      type: body.type || "general",
      businessId: body.businessId || null,
    },
  });
  return jsonResponse(enquiry, 201);
}

export async function GET() {
  const enquiries = await prisma.enquiry.findMany({
    include: { business: true },
    orderBy: { createdAt: "desc" },
  });
  return jsonResponse(enquiries);
}
