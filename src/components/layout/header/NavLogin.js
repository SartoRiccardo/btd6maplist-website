"use client";
import styles from "./navlogin.module.css";
import stylesNav from "./navbar.module.css";
import Link from "next/link";
import {
  selectDiscordAccessToken,
  selectMaplistProfile,
} from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";

const discOAuth2Params = {
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  response_type: "code",
  scope: "identify guilds guilds.members.read",
  redirect_uri: process.env.NEXT_PUBLIC_DISC_REDIRECT_URI,
  prompt: "consent",
  integration_type: 0,
  // state: "15773059ghq9183habn",
};

export default function NavLogin() {
  const accessToken = useAppSelector(selectDiscordAccessToken);
  const { discordProfile, btd6Profile } = useAppSelector(selectMaplistProfile);
  const dispatch = useAppDispatch();
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  const cmpLoggedOut = (
    <a
      href={`https://discord.com/oauth2/authorize?${new URLSearchParams(
        discOAuth2Params
      ).toString()}`}
    >
      <li>Login</li>
    </a>
  );
  const cmpLoggedIn = (
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
              <a href={`/api/auth/revoke`}>Logout</a>
            </li>
          </ul>
        )}
      </li>

      <li className={`d-md-none`}>
        <a href="#" onClick={(_e) => setMobileSubmenuOpen(!mobileSubmenuOpen)}>
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
  );

  return accessToken ? cmpLoggedIn : cmpLoggedOut;
}
