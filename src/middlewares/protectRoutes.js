import { maplistAuthenticate } from "@/server/maplistRequests";
import protectedRoutes from "@/utils/protectedRoutes";
import { NextResponse } from "next/server";

const matcher = [
  "/config.*",
  "/map/add.*",
  "/map/.+?/edit",
  "/completions/.*",
  "/hidden-maps",
  "/map-submissions",
  "/roles",
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

  for (const { matcher, requires } of protectedRoutes) {
    if (RegExp("^" + matcher).test(request.nextUrl.pathname)) {
      if (!request.cookies.has("accessToken")) return resp404;

      const accessToken = JSON.parse(request.cookies.get("accessToken").value);
      const token = accessToken.access_token;
      const userProfile = await maplistAuthenticate(token);

      const hasNecessaryPerms = requires.some((permWant) =>
        userProfile?.permissions?.some((permGroup) =>
          permGroup.permissions.includes(permWant)
        )
      );
      if (hasNecessaryPerms) return;

      return resp404;
    }
  }
}
