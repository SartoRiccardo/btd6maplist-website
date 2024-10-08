import { sha256 } from "js-sha256";
import { NextResponse } from "next/server";

const matcher = [
  "/config.*",
  "/map/add.*",
  "/map/.+?/edit",
  "/completions/.*",
  "/list/legacy",
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
      const signature = sha256(token + process.env.MW_SALT);
      const rolesResp = await fetch(
        `${process.env.HOST}/api/mwcache/uroles?token=${token}&signature=${signature}`
      );
      const roles = await rolesResp.json();
      if (
        !(
          roles.includes(process.env.NEXT_PUBLIC_LISTMOD_ROLE) ||
          roles.includes(process.env.NEXT_PUBLIC_EXPMOD_ROLE) ||
          process.env.NEXT_PUBLIC_ADMIN_ROLES.split(",").some((rl) =>
            roles.includes(rl)
          )
        )
      )
        return resp404;
    }
  }
}
