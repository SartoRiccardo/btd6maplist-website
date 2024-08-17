"use client";
import { titleFont } from "@/lib/fonts";
import styles from "./navbar.module.css";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Link from "next/link";
import Collapse from "react-bootstrap/Collapse";
import NavLogin from "../header/NavLogin";

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
        />
      </p>

      <Offcanvas
        show={isMenuOpen}
        onHide={(_e) => setIsMenuOpen(false)}
        placement="top"
        className={`${styles.navmobile} ${titleFont.className} font-border h-100`}
        responsive="md"
      >
        <Offcanvas.Header className="d-flex justify-content-end pb-0">
          <i
            className={`${styles.closeButton} bi bi-x-lg text-5`}
            onClick={(_e) => setIsMenuOpen(false)}
          />
        </Offcanvas.Header>

        <Offcanvas.Body>
          <ul className={`${styles.navbar} ${styles.mobile}`}>
            <NavLogin onNavigate={(_e) => setIsMenuOpen(false)} />

            <li>
              <a href="#" onClick={toggleSubmenu(0, openSubmenus.includes(0))}>
                <i
                  className={`bi bi-caret-${
                    openSubmenus.includes(0) ? "down" : "right"
                  }-fill`}
                />{" "}
                Maps
              </a>

              <Collapse in={openSubmenus.includes(0)}>
                <div>
                  <ul className={`${styles.submenu} ${styles.mobile}`}>
                    <li>
                      <Link
                        scroll={false}
                        href="/experts"
                        onClick={(_e) => setIsMenuOpen(false)}
                      >
                        Experts
                      </Link>
                    </li>
                    <li>
                      <Link
                        scroll={false}
                        href="/list"
                        onClick={(_e) => setIsMenuOpen(false)}
                      >
                        The List
                      </Link>
                    </li>
                  </ul>
                </div>
              </Collapse>
            </li>

            <li>
              <Link
                scroll={false}
                href="/list/leaderboard"
                onClick={(_e) => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
            </li>

            {/* <li>
              <a href="#" onClick={toggleSubmenu(1, openSubmenus.includes(1))}>
                <i
                  className={`bi bi-caret-${
                    openSubmenus.includes(1) ? "down" : "right"
                  }-fill`}
                />{" "}
                Leaderboard
              </a>

              <Collapse in={openSubmenus.includes(1)}>
                <div>
                  <ul className={`${styles.submenu} ${styles.mobile}`}>
                    <li>
                      <Link scroll={false} href="/experts">Experts</Link>
                    </li>
                    <li>
                      <Link scroll={false} href="/list">The List</Link>
                    </li>
                  </ul>
                </div>
              </Collapse>
            </li> */}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
