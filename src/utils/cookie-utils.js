import { cookies } from "next/headers";

export const getAccessToken = () => {
  const cookieStore = cookies();
  if (!cookieStore.has("accessToken")) return null;

  let accessToken = null;
  try {
    accessToken = JSON.parse(cookieStore.get("accessToken").value);
  } catch (exc) {
    return null;
  }

  return accessToken && accessToken.access_token
    ? accessToken.access_token
    : null;
};
