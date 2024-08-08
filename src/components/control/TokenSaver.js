"use client";
import {
  setDiscordAccessToken,
  setNullDiscordAccessToken,
} from "@/features/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Hacky way to access LocalStorage idk how to do that from a server component
export default function TokenSaver({ accessToken, justFetched }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      if (accessToken !== null && justFetched) {
        window.localStorage.setItem(
          "accessToken",
          JSON.stringify({
            ...accessToken,
            expires_at:
              (Math.floor(new Date().getTime() / 1000) +
                accessToken.expires_in) *
              1000,
          })
        );
        window.history.replaceState(null, document.title, "/");
        dispatch(setDiscordAccessToken({ discordAccessToken: accessToken }));
      } else if (window.localStorage.getItem("accessToken")) {
        let discordAccessToken = JSON.parse(
          window.localStorage.getItem("accessToken")
        );
        if (
          new Date().getTime() >
          discordAccessToken.expires_at - 3600000 * 24
        ) {
          const refreshedToken = await fetch(
            `/api/auth/refresh?refresh_token=${discordAccessToken.refresh_token}`,
            { method: "POST" }
          );
          if (refreshedToken.status !== 200)
            return dispatch(setNullDiscordAccessToken());
          discordAccessToken = await refreshedToken.json();
        }

        dispatch(
          setDiscordAccessToken({
            discordAccessToken,
          })
        );
      } else {
        dispatch(setNullDiscordAccessToken());
      }
    };

    getToken();
  }, []);
  return null;
}
