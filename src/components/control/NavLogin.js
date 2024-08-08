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
  revokeAuth,
} from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getDiscordUser, revokeAccessToken } from "@/server/discordRequests";
import { getBtd6User } from "@/server/ninjakiwiRequests";
import { useEffect, useState } from "react";
import Collapse from "react-bootstrap/Collapse";

export function NavLogin() {
  const accessToken = useAppSelector(selectDiscordAccessToken);
  const { discordProfile, btd6Profile } = useAppSelector(selectMaplistProfile);
  const dispatch = useAppDispatch();
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  useEffect(() => {
    const fetchMaplistProfile = async () => {
      if (accessToken && accessToken.valid) {
        const discordProfile = await getDiscordUser(accessToken.access_token);
        if (!discordProfile) {
          dispatch(revokeAuth());
          return;
        }
        dispatch(setDiscordProfile({ discordProfile }));

        const maplistProfile = {
          oak: "9ced1583dd95adf04e138c185877e471cd021cbe9613db6e", // Random dude for test purposes
          roles: [],
        }; // Fetch that too...
        dispatch(setMaplistProfile({ maplistProfile }));

        if (maplistProfile.oak) {
          const btd6Profile = await getBtd6User(maplistProfile.oak);
          dispatch(setBtd6Profile({ btd6Profile }));
        }
      }
    };
    fetchMaplistProfile();
  }, [accessToken]);

  const logout = async () => {
    await fetch(`/api/auth/revoke?token=${accessToken.access_token}`, {
      method: "POST",
    });
    dispatch(revokeAuth());
  };

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
      <>
        <li className="d-none d-md-inline-block">
          <a href="#">
            <img className={`${styles.pfp}`} src={btd6Profile.avatarURL} />
            {discordProfile ? discordProfile.username : "..."}
          </a>

          {discordProfile && (
            <ul className={`${stylesNav.submenu} shadow`}>
              <li>
                <Link href={`/profile/${discordProfile.id}`}>Profile</Link>
              </li>
              <li>
                <a href="#" onClick={(_e) => logout()}>
                  Logout
                </a>
              </li>
            </ul>
          )}
        </li>

        <li className={`d-md-none`}>
          <a
            href="#"
            onClick={(_e) => setMobileSubmenuOpen(!mobileSubmenuOpen)}
          >
            <img
              className={`${styles.pfp} ${styles.mobile}`}
              src={btd6Profile.avatarURL}
            />
            {discordProfile ? discordProfile.username : "..."}
          </a>

          {discordProfile && (
            <Collapse in={mobileSubmenuOpen}>
              <div>
                <ul className={`${stylesNav.submenu} ${stylesNav.mobile}`}>
                  <li>
                    <Link href={`/profile/${discordProfile.id}`}>Profile</Link>
                  </li>
                  <li>
                    <a href="#" onClick={(_e) => logout()}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </Collapse>
          )}
        </li>
      </>
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
