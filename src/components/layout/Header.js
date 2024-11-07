import { btd6Font, titleFont } from "@/lib/fonts";
import stylesHeader from "./header.module.css";
import stylesNav from "./header/navbar.module.css";
import Link from "next/link";
import { NavbarMobile } from "./header/NavbarMobile";
import NavLogin from "./header/NavLogin";
import ProtectedLinks from "./header/ProtectedLinks";
import { SiteTitle } from "./Header.client";

export default function Header() {
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
                <SiteTitle />
              </p>
            </Link>
          </div>
        </div>
        <div className="col d-flex justify-content-end">
          <nav>
            <div className="d-none d-md-block" data-cy="navbar-desktop">
              <ul className={`${stylesNav.navbar}`}>
                <ProtectedLinks />

                <li>
                  <a href="#" tabIndex={0}>
                    Maps <i className="bi bi-caret-down-fill" />
                  </a>

                  <ul
                    className={`${stylesNav.submenu} shadow`}
                    tabIndex={0}
                    data-cy="nav-dropdown"
                  >
                    <li>
                      <Link href="/expert-list">Expert List</Link>
                    </li>
                    <li>
                      <Link href="/maplist">The Maplist</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link href="/leaderboard">Leaderboard</Link>
                </li>

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
