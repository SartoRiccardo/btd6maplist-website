import { NextResponse } from "next/server";

const matcher = ["/map/submit", "/map/.+?/submit", "/user/edit", "/my-submissions"];

/**
 * Redirect to Discord Login, if attempting to fetch a resource that requires
 * being logged in, if they're logged out.
 */
export default async function requireLoginMiddleware(request, _rsp) {
  for (const match of matcher) {
    if (!RegExp("^" + match).test(request.nextUrl.pathname)) continue;

    const discOAuth2Params = {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      response_type: "code",
      scope: "identify guilds guilds.members.read",
      redirect_uri: process.env.NEXT_PUBLIC_DISC_REDIRECT_URI,
      prompt: "consent",
      integration_type: 0,
      state: `-${request.nextUrl.pathname}`,
    };
    const respRedirect = {
      response: NextResponse.redirect(
        new URL(
          `https://discord.com/oauth2/authorize?${new URLSearchParams(
            discOAuth2Params
          ).toString()}`
        ),
        307
      ),
      stop: true,
    };

    if (!request.cookies.has("accessToken")) return respRedirect;

    try {
      const accessToken = JSON.parse(request.cookies.get("accessToken").value);
      if (
        !("expires_at" in accessToken) ||
        accessToken.expires_at < Date.now() / 1000
      ) {
        request.cookies.delete("accessToken");
        return respRedirect;
      }
    } catch (exc) {
      return respRedirect;
    }
  }
}
