import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken } from "@/server/discordRequests";

export async function GET(request) {
  let redirectUrl = `${process.env.HOST}`;
  const state = request.nextUrl.searchParams.get("state");
  if (state && state.includes("-")) {
    redirectUrl += state.split("-")[1];
  } else redirectUrl += "/";

  const error = request.nextUrl.searchParams.get("error");
  if (error) return NextResponse.redirect(redirectUrl);

  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const accessToken = await getAccessToken(code);
  const expires_at = Math.floor(Date.now() / 1000 + accessToken.expires_in);
  if (accessToken)
    cookies().set(
      "accessToken",
      JSON.stringify({ ...accessToken, expires_at }),
      { path: "/" }
    );

  return NextResponse.redirect(redirectUrl);
}
