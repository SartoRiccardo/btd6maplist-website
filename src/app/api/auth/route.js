import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken } from "@/server/discordRequests";

export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const accessToken = await getAccessToken(code);
  if (accessToken) cookies().set("accessToken", JSON.stringify(accessToken));

  return NextResponse.redirect(`${process.env.HOST}/`);
}
