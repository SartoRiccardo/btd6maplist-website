import { NextResponse } from "next/server";
import authenticateMiddleware from "./middlewares/authenticate";
import protectRoutesMiddleware from "./middlewares/protectRoutes";
import requireLoginMiddleware from "./middlewares/requireLogin";

const middlewares = [
  requireLoginMiddleware,
  authenticateMiddleware,
  protectRoutesMiddleware,
];

function setResponseCookies(newCookies, response) {
  for (const ck of Object.keys(newCookies)) {
    if (newCookies[ck] === null)
      response.cookies.set(ck, "", {
        path: "/",
        expires: new Date(0),
      });
    else
      response.cookies.set(ck, newCookies[ck], {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
  }
  return response;
}

export async function middleware(request) {
  let response = NextResponse.next();
  const cookies = {};
  for (const mw of middlewares) {
    let curResp = await mw(request, response);
    response = curResp?.response || response;
    if (curResp?.cookies) {
      for (const ck of Object.keys(curResp.cookies))
        cookies[ck] = curResp.cookies[ck];
    }
    if (curResp?.stop) return setResponseCookies(cookies, response);
  }
  return setResponseCookies(cookies, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*?.webp|.*?.png).*)",
  ],
};
