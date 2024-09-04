import { NextResponse } from "next/server";

const matcher = [
  "/config.*",
  "/map/add.*",
  "/map/.+?/edit",
  "/map/.+?/submit",
  "/run/add.*",
  "/lcc/add.*",
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
      const rolesResp = await fetch(
        `${process.env.HOST}/api/mwcache/uroles?token=${accessToken.access_token}`
      );
      const roles = await rolesResp.json();
      if (
        !(
          roles.includes(process.env.NEXT_PUBLIC_LISTMOD_ROLE) ||
          roles.includes(process.env.NEXT_PUBLIC_EXPMOD_ROLE)
        )
      )
        return resp404;
    }
  }
}
