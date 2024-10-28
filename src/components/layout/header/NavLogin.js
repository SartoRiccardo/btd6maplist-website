"use client";
import styles from "./navlogin.module.css";
import stylesNav from "./navbar.module.css";
import Link from "next/link";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { useState } from "react";
import { useDiscordToken } from "@/utils/hooks";
import { usePathname } from "next/navigation";
import LazyCollapse from "@/components/transitions/LazyCollapse";

const discOAuth2Params = {
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  response_type: "code",
  scope: "identify guilds guilds.members.read",
  redirect_uri: process.env.NEXT_PUBLIC_DISC_REDIRECT_URI,
  prompt: "consent",
  integration_type: 0,
  // state: "15773059ghq9183habn",
};

export default function NavLogin({ onNavigate }) {
  const accessToken = useDiscordToken();
  const pathname = usePathname();
  const { maplistProfile, btd6Profile } = useAppSelector(selectMaplistProfile);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  const cmpLoggedOut = (
    <li>
      <a
        href={`https://discord.com/oauth2/authorize?${new URLSearchParams({
          state: `-${pathname}`,
          ...discOAuth2Params,
        }).toString()}`}
        style={{ color: "#9fa8da" }}
      >
        <i className="bi bi-discord me-2" />
        Login
      </a>
    </li>
  );
  const cmpLoggedIn = (
    <>
      <li className="d-none d-md-inline-block">
        <a href="#" className={styles.profileContainer} data-cy="user-tab">
          <img className={`${styles.pfp}`} src={btd6Profile.avatarURL} />
          <span>{maplistProfile ? maplistProfile.name : "..."}</span>
        </a>

        {maplistProfile && (
          <ul className={`${stylesNav.submenu} shadow`} data-cy="nav-dropdown">
            <li>
              <Link
                href={`/user/${maplistProfile.id}`}
                onClick={(_e) => onNavigate && onNavigate(_e)}
              >
                Profile
              </Link>
            </li>
            <li>
              <a href={`/api/auth/revoke`}>Logout</a>
            </li>
          </ul>
        )}
      </li>

      <li className={`d-md-none`}>
        <a
          href="#"
          className={`${styles.profileContainer} ${styles.mobile}`}
          onClick={(_e) => setMobileSubmenuOpen(!mobileSubmenuOpen)}
          data-cy="user-tab"
        >
          <img
            className={`${styles.pfp} ${styles.mobile}`}
            src={btd6Profile.avatarURL}
          />
          <span>{maplistProfile ? maplistProfile.name : "..."}</span>
        </a>

        {maplistProfile && (
          <LazyCollapse in={mobileSubmenuOpen}>
            <div>
              <ul
                className={`${stylesNav.submenu} ${stylesNav.mobile}`}
                data-cy="nav-dropdown"
              >
                <li>
                  <Link
                    href={`/user/${maplistProfile.id}`}
                    onClick={(_e) => onNavigate && onNavigate(_e)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <a href="#" onClick={(_e) => logout()}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </LazyCollapse>
        )}
      </li>
    </>
  );

  return accessToken ? cmpLoggedIn : cmpLoggedOut;
}
