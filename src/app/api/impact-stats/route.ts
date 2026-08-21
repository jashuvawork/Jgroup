import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api";

export async function GET() {
  const stats = await prisma.impactStat.findMany({
    orderBy: { key: "asc" },
  });
  return jsonResponse(stats);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const stat = await prisma.impactStat.update({
    where: { key: body.key },
    data: { value: body.value, label: body.label },
  });
  return jsonResponse(stat);
}
