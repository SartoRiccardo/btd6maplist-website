import { NextResponse } from "next/server";
import authenticateMiddleware from "./middlewares/authenticate";
import protectRoutesMiddleware from "./middlewares/protectRoutes";

const middlewares = [authenticateMiddleware, protectRoutesMiddleware];

export async function middleware(request) {
  let response = NextResponse.next();
  for (const mw of middlewares) {
    let curResp = await mw(request, response);
    response = curResp || response;
  }
  return response;
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
