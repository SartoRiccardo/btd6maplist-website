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
            <Link scroll={false} href="/" className={btd6Font.className}>
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
            <div className="d-none d-md-block">
              <ul className={`${stylesNav.navbar}`}>
                <ProtectedLinks />

                <li>
                  <a href="#" tabIndex={0}>
                    Maps <i className="bi bi-caret-down-fill" />
                  </a>

                  <ul className={`${stylesNav.submenu} shadow`} tabIndex={0}>
                    <li>
                      <Link scroll={false} href="/experts">
                        Experts
                      </Link>
                    </li>
                    <li>
                      <Link scroll={false} href="/list">
                        The List
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link scroll={false} href="/list/leaderboard">
                    Leaderboard
                  </Link>
                </li>

                {/* <li>
                  <a href="#">
                    Leaderboard <i className="bi bi-caret-down-fill" />
                  </a>

                  <ul className={`${stylesNav.submenu} shadow`}>
                    <li>
                      <Link scroll={false} href="/experts">Experts</Link>
                    </li>
                    <li>
                      <Link scroll={false} href="/list">The List</Link>
                    </li>
                  </ul>
                </li> */}

                <NavLogin />
              </ul>
            </div>

            <div className="d-block d-md-none">
              <NavbarMobile />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
