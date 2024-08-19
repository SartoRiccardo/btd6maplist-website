import { NextResponse } from "next/server";
import { getMaplistRoles } from "@/server/discordRequests";

export async function GET(request) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }
  return NextResponse.json(await getMaplistRoles(token));
}
