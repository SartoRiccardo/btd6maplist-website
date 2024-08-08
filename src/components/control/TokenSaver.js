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
    if (accessToken !== null && justFetched) {
      window.localStorage.setItem(
        "accessToken",
        JSON.stringify({
          ...accessToken,
          expires_at:
            Math.floor(new Date().getTime() / 1000) + accessToken.expires_in,
        })
      );
      dispatch(setDiscordAccessToken({ discordAccessToken: accessToken }));
    } else if (window.localStorage.getItem("accessToken")) {
      dispatch(
        setDiscordAccessToken({
          discordAccessToken: JSON.parse(
            window.localStorage.getItem("accessToken")
          ),
        })
      );
    } else {
      dispatch(setNullDIscordAccessToken());
    }
  }, []);
  return null;
}
