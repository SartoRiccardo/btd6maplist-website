import { refreshAccessToken } from "@/server/discordRequests";
import { NextResponse } from "next/server";

const fail = NextResponse.json({ success: false }, { status: 400 });
export async function POST(request) {
  const token = request.nextUrl.searchParams.get("refresh_token");
  if (!token) return fail;
  const response = await refreshAccessToken(token);

  return response ? NextResponse.json(response, { status: 200 }) : fail;
}
