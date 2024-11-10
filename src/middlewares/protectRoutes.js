import { maplistAuthenticate } from "@/server/maplistRequests";
import { NextResponse } from "next/server";

const matcher = [
  "/config.*",
  "/map/add.*",
  "/map/.+?/edit",
  "/completions/.*",
  "/hidden-maps",
  "/map-submissions",
];

/**
 * Return 404 if attempting to access one of the routes in matcher
 * without being a Maplist moderator.
 */
export default async function protectRoutesMiddleware(request, _rsp) {
  const resp404 = {
    response: NextResponse.rewrite(new URL("/not-found", request.url)),
    stop: true,
  };

  for (const match of matcher) {
    if (RegExp("^" + match).test(request.nextUrl.pathname)) {
      if (!request.cookies.has("accessToken")) return resp404;

      const accessToken = JSON.parse(request.cookies.get("accessToken").value);
      const token = accessToken.access_token;
      const userProfile = await maplistAuthenticate(token);

      if (userProfile?.roles) {
        for (const { edit_maplist, edit_explist } of userProfile.roles)
          if (edit_explist || edit_maplist) return;
      }

      return resp404;
    }
  }
}
