import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken } from "@/server/discordRequests";

export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const accessToken = await getAccessToken(code);
  const expires_at = Math.floor(Date.now() / 1000 + accessToken.expires_in);
  if (accessToken)
    cookies().set(
      "accessToken",
      JSON.stringify({ ...accessToken, expires_at })
    );

  return NextResponse.redirect(`${process.env.HOST}/`);
}
