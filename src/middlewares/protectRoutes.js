import { NextResponse } from "next/server";

const matcher = ["/config.*", "/map/add.*", "/run/add.*", "/lcc/add.*"];

export default async function protectRoutesMiddleware(request, response) {
  const resp404 = NextResponse.rewrite(new URL("/not-found", request.url));

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
