import { revokeAccessToken } from "@/server/discordRequests";
import { NextResponse } from "next/server";

export async function POST(request) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ success: false }, { status: 400 });
  await revokeAccessToken(token);
  return NextResponse.json({ success: true }, { status: 200 });
}
