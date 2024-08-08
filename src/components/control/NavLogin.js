"use client";
import styles from "./navlogin.module.css";
import stylesNav from "../layout/navbar.module.css";
import Link from "next/link";
import {
  selectDiscordAccessToken,
  selectMaplistProfile,
  setBtd6Profile,
  setDiscordProfile,
  setMaplistProfile,
} from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getDiscordUser } from "@/server/discordRequests";
import { getBtd6User } from "@/server/ninjakiwiRequests";
import { useEffect, useState } from "react";

export function NavLogin() {
  const accessToken = useAppSelector(selectDiscordAccessToken);
  const { discordProfile, btd6Profile } = useAppSelector(selectMaplistProfile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMaplistProfile = async () => {
      if (accessToken !== null) {
        const discordProfile = await getDiscordUser(accessToken.access_token);
        dispatch(setDiscordProfile({ discordProfile }));
        const maplistProfile = {
          oak: "9ced1583dd95adf04e138c185877e471cd021cbe9613db6e",
          roles: [],
        }; // Fetch that too...
        dispatch(setMaplistProfile({ maplistProfile }));
        if (maplistProfile.oak) {
          const btd6Profile = await getBtd6User(maplistProfile.oak); // Random dude for test purposes
          dispatch(setBtd6Profile({ btd6Profile }));
        }
      }
    };
    fetchMaplistProfile();
  }, [accessToken]);

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
    accessToken &&
    (accessToken.valid ? (
      <li>
        <a href="#">
          <img className={`${styles.pfp}`} src={btd6Profile.avatarURL} />
          {discordProfile ? discordProfile.username : "..."}
        </a>

        <ul className={`${stylesNav.submenu} shadow`}>
          <li>
            <Link href="/experts">Profile</Link>
          </li>
          <li>
            <Link href="/list">Logout</Link>
          </li>
        </ul>
      </li>
    ) : (
      <a
        href={`https://discord.com/oauth2/authorize?${new URLSearchParams(
          params
        ).toString()}`}
      >
        <li>Login</li>
      </a>
    ))
  );
}
