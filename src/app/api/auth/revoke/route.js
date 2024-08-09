import { revokeAccessToken } from "@/server/discordRequests";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ success: false }, { status: 400 });
  await revokeAccessToken(token);
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function GET(request) {
  const cookieStore = cookies();
  if (cookieStore.has("accessToken")) {
    let accessToken = null;
    try {
      accessToken = JSON.parse(cookieStore.get("accessToken").value);
    } catch (exc) {}

    if (accessToken && accessToken.access_token) {
      await revokeAccessToken(accessToken.access_token);
    }
  }
  cookieStore.delete("accessToken");

  return NextResponse.redirect(`${process.env.HOST}/`);
}
