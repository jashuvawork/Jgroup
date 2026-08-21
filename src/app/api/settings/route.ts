import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return jsonResponse(map);
}

export async function PUT(request: Request) {
  const body = await request.json();
  for (const [key, value] of Object.entries(body)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: value as string },
      create: { key, value: value as string },
    });
  }
  return jsonResponse({ success: true });
}
