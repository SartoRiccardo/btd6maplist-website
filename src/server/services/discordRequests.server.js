const API_BASE_URL =
  process.env.DISCORD_BASE_URL || "https://discord.com/api/v10";

export async function getAccessToken(code) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.NEXT_PUBLIC_DISC_REDIRECT_URI,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await fetch(`${API_BASE_URL}/oauth2/token`, {
    method: "POST",
    body,
    headers,
  });

  if (response.ok) return await response.json();
  return null;
}

export async function refreshAccessToken(refresh_token) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await fetch(`${API_BASE_URL}/oauth2/token`, {
    method: "POST",
    body,
    headers,
  });

  if (response.status === 200) return await response.json();
  return null;
}

export async function revokeAccessToken(accessToken) {
  const body = new URLSearchParams({
    token_type_hint: "access_token",
    token: accessToken,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await fetch(`${API_BASE_URL}/oauth2/token/revoke`, {
    method: "POST",
    body,
    headers,
  });

  if (response.status === 200) return await response.json();
  return null;
}

export async function getDiscordUserGuilds(accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(`${API_BASE_URL}/users/@me/guilds`, {
    headers,
    next: { revalidate: 60 * 60, tags: ["discord"] },
  });

  if (!response.ok) return [];
  return await response.json();
}
