"use client";
import { btd6Font, titleFont } from "@/lib/fonts";
import { useIsWindows, useVisibleFormats } from "@/utils/hooks";
import stylesHeader from "./header.module.css";
import stylesNav from "./header/navbar.module.css";
import Link from "next/link";
import { NavbarMobile } from "./header/NavbarMobile";
import NavLogin from "./header/NavLogin";
import ProtectedLinks from "./header/ProtectedLinks";
import SearchTab from "./header/SearchTab";
import { useState } from "react";
import { listRoutes } from "@/utils/routeInfo";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const isWindows = useIsWindows();
  const visibleFormats = useVisibleFormats();

  return (
    <header
      className={`${titleFont.className} font-border ${stylesHeader.header} shadow`}
    >
      <div className="row">
        <div className="col-auto">
          <div className="d-flex flex-column justify-content-center h-100">
            <Link href="/" className={btd6Font.className}>
              <p className="p-relative">
                <img src="/maplist.webp" className={stylesHeader.maplistLogo} />
                <span
                  className={`d-inline-block ${stylesHeader.maplistLogoSpacer}`}
                >
                  &nbsp;
                </span>
                &nbsp;
                <span
                  className={stylesHeader.btd6MaplistTitle}
                  // Luckiest Guy for some reason is perfectly centered on Windows but not anywhere else?
                  style={{ top: isWindows ? "0" : "0.3rem" }}
                >
                  BTD6 Maplist
                </span>
              </p>
            </Link>
          </div>
        </div>
        <div className="col d-flex justify-content-end">
          <nav>
            <div className="d-none d-md-block" data-cy="navbar-desktop">
              <ul className={stylesNav.navbar}>
                <ProtectedLinks
                  className={searchOpen ? stylesNav.hidden : ""}
                />

                <li className={searchOpen ? stylesNav.hidden : ""}>
                  <span tabIndex={0}>Maps</span>

                  <div className={stylesNav.submenu}>
                    <ul className="shadow" tabIndex={0} data-cy="nav-dropdown">
                      {listRoutes
                        .filter(({ dependsOn }) =>
                          dependsOn.some((format) =>
                            visibleFormats.includes(format)
                          )
                        )
                        .map(({ href, name }) => (
                          <li key={href}>
                            <Link href={href}>{name}</Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </li>

                <li className={searchOpen ? stylesNav.hidden : ""}>
                  <Link href="/leaderboard">Leaderboard</Link>
                </li>

                <SearchTab
                  onClick={() => setSearchOpen(!searchOpen)}
                  onHide={() => setSearchOpen(false)}
                  open={searchOpen}
                />

                <NavLogin />
              </ul>
            </div>

            <div className="d-block d-md-none" data-cy="navbar-mobile">
              <NavbarMobile />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
