"use client";

import { useEffect } from "react";

// Hacky way to access LocalStorage idk how to do that from a server component
export default function TokenSaver({ accessToken }) {
  useEffect(() => {
    if (accessToken !== null)
      window.localStorage.setItem(
        "accessToken",
        JSON.stringify({
          ...accessToken,
          expires_at:
            Math.floor(new Date().getTime() / 1000) + accessToken.expires_in,
        })
      );
  }, []);
  return null;
}
