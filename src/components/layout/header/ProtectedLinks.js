"use client";
import { useAuthLevels } from "@/utils/hooks";
import stylesNav from "./navbar.module.css";
import styles from "./navbar.module.css";
import Link from "next/link";
import { Collapse } from "react-bootstrap";

export default function ProtectedLinks({
  onNavigate,
  toggleSubmenu,
  openSubmenus,
  mobile,
}) {
  openSubmenus = openSubmenus || [];
  toggleSubmenu = toggleSubmenu || (() => {});

  const { loaded, hasPerms } = useAuthLevels();
  if (!loaded || !hasPerms) return null;

  return (
    <>
      {!mobile && (
        <li>
          <a href="#" tabIndex={0}>
            Admin <i className="bi bi-caret-down-fill" />
          </a>

          <ul className={`${stylesNav.submenu} shadow`} tabIndex={0}>
            <li>
              <Link
                scroll={false}
                href="/config"
                onClick={(e) => onNavigate && onNavigate(e)}
              >
                List Config
              </Link>
            </li>
            <li>
              <Link
                scroll={false}
                href="/completions/unconfirmed"
                onClick={(e) => onNavigate && onNavigate(e)}
              >
                Pending Runs
              </Link>
            </li>
          </ul>
        </li>
      )}

      {mobile && (
        <li>
          <a href="#" onClick={toggleSubmenu(100, openSubmenus.includes(100))}>
            <i
              className={`bi bi-caret-${
                openSubmenus.includes(100) ? "down" : "right"
              }-fill`}
            />
            &nbsp; Admin
          </a>

          <Collapse in={openSubmenus.includes(100)}>
            <div>
              <ul className={`${styles.submenu} ${styles.mobile}`}>
                <li>
                  <Link
                    scroll={false}
                    href="/config"
                    onClick={(e) => onNavigate && onNavigate(e)}
                  >
                    List Config
                  </Link>
                </li>
                <li>
                  <Link
                    scroll={false}
                    href="/completions/unconfirmed"
                    onClick={(e) => onNavigate && onNavigate(e)}
                  >
                    Pending Runs
                  </Link>
                </li>
              </ul>
            </div>
          </Collapse>
        </li>
      )}
    </>
  );
}
