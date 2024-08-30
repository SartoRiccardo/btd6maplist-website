import { refreshAccessToken } from "../server/discordRequests";

const REFRESH_BEFORE = 3600 * 24 * 2;

/**
 * Check validity and expiration date of the access token.
 * Refresh and/or delete its cookie if necessary.
 */
export default async function authenticateMiddleware(request, response) {
  if (!request.cookies.has("accessToken")) return;

  let accessToken = null;
  try {
    accessToken = JSON.parse(request.cookies.get("accessToken").value);
  } catch (exc) {
    request.cookies.delete("accessToken");
    return;
  }

  if (
    !("expires_at" in accessToken) ||
    accessToken.expires_at < Date.now() / 1000
  ) {
    request.cookies.delete("accessToken");
    return;
  } else if (accessToken.expires_at - REFRESH_BEFORE < Date.now() / 1000) {
    const newAccessToken = await refreshAccessToken(accessToken.refresh_token);
    if (!newAccessToken) {
      request.cookies.delete("accessToken");
      return;
    }

    response.cookies.set(
      "accessToken",
      JSON.stringify({
        ...newAccessToken,
        expires_at: Math.floor(Date.now() / 1000 + newAccessToken.expires_in),
      })
    );
    return { response, stop: false };
  }
}
