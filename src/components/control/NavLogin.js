"use client";
import { selectDiscordAccessToken } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";

export function NavLogin() {
  const accessToken = useAppSelector(selectDiscordAccessToken);
  console.log(accessToken);

  const params = {
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    response_type: "code",
    scope: "identify guilds guilds.members.read",
    redirect_uri: process.env.NEXT_PUBLIC_DISC_REDIRECT_URI,
    prompt: "consent",
    integration_type: 0,
    // state: "15773059ghq9183habn",
  };

  return (
    <a
      href={`https://discord.com/oauth2/authorize?${new URLSearchParams(
        params
      ).toString()}`}
    >
      <li>Login</li>
    </a>
  );
}
