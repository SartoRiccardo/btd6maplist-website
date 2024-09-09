import { NextResponse } from "next/server";
import { getMaplistRoles } from "@/server/discordRequests";
import { sha256 } from "js-sha256";

export async function GET(request) {
  const token = request.nextUrl.searchParams.get("token");
  const signature = request.nextUrl.searchParams.get("signature");
  if (!token)
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  if (!signature)
    return NextResponse.json(
      { error: "Signature is missing" },
      { status: 400 }
    );
  if (sha256(token + process.env.MW_SALT) !== signature)
    return NextResponse.json(
      { error: "Signature doesn't match token" },
      { status: 400 }
    );
  return NextResponse.json(await getMaplistRoles(token));
}
