import { NextResponse } from "next/server";
import { getExpertMaplist } from "@/server/maplistRequests.js";

export async function GET(request) {
  return NextResponse.json(await getExpertMaplist(), { status: 200 });
}
