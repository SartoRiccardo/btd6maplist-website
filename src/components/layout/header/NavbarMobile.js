"use client";
import { titleFont } from "@/lib/fonts";
import styles from "./navbar.module.css";
import { useState } from "react";
import Link from "next/link";
import NavLogin from "../header/NavLogin";
import ProtectedLinks from "./ProtectedLinks";
import LazyOffcanvas from "@/components/transitions/LazyOffcanvas";
import LazyCollapse from "@/components/transitions/LazyCollapse";
import SearchTab from "./SearchTab";

export function NavbarMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState([]);

  const toggleSubmenu = (id, remove) => {
    return (_e) => {
      if (remove)
        setOpenSubmenus(openSubmenus.filter((toRemv) => id !== toRemv));
      else setOpenSubmenus([...openSubmenus, id]);
    };
  };

  return (
    <>
      <p className={styles.hamburgerBtn}>
        <i
          className="bi bi-list"
          tabIndex={0}
          onClick={(_e) => setIsMenuOpen(true)}
          data-cy="navbar-mobile-open"
        />
      </p>

      <LazyOffcanvas
        show={isMenuOpen}
        onHide={(_e) => setIsMenuOpen(false)}
        placement="top"
        className={`${styles.navmobile} ${titleFont.className} font-border h-100`}
        responsive="md"
      >
        <div className="offcanvas-header d-flex justify-content-end pb-0">
          <i
            className={`${styles.closeButton} bi bi-x-lg text-5`}
            onClick={(_e) => setIsMenuOpen(false)}
            data-cy="navbar-mobile-close"
          />
        </div>

        <div className="offcanvas-body" data-cy="navbar-mobile-content">
          <ul className={`${styles.navbar} ${styles.mobile}`}>
            <SearchTab mobile onNavigate={(_e) => setIsMenuOpen(false)} />

            <NavLogin onNavigate={(_e) => setIsMenuOpen(false)} />

            <ProtectedLinks
              openSubmenus={openSubmenus}
              toggleSubmenu={toggleSubmenu}
              onNavigate={(_e) => setIsMenuOpen(false)}
              mobile
            />

            <li>
              <a href="#" onClick={toggleSubmenu(0, openSubmenus.includes(0))}>
                <i
                  className={`bi ${
                    openSubmenus.includes(0)
                      ? "bi-caret-down-fill"
                      : "bi-caret-right-fill"
                  }`}
                />{" "}
                Maps
              </a>

              <LazyCollapse in={openSubmenus.includes(0)}>
                <div>
                  <ul
                    className={`${styles.submenu} ${styles.mobile}`}
                    data-cy="nav-dropdown"
                  >
                    <li>
                      <Link
                        href="/expert-list"
                        onClick={(_e) => setIsMenuOpen(false)}
                      >
                        Expert List
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/maplist"
                        onClick={(_e) => setIsMenuOpen(false)}
                      >
                        The Maplist
                      </Link>
                    </li>
                  </ul>
                </div>
              </LazyCollapse>
            </li>

            <li>
              <Link href="/leaderboard" onClick={(_e) => setIsMenuOpen(false)}>
                Leaderboard
              </Link>
            </li>
          </ul>
        </div>
      </LazyOffcanvas>
    </>
  );
}
