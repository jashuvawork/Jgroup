import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "jgroup.space",
    timestamp: new Date().toISOString(),
  });
}
