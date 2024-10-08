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
            <LinkItem
              href="/config"
              label="List Config"
              onNavigate={onNavigate}
            />
            <LinkItem
              href="/completions/unconfirmed"
              label="Pending Runs"
              onNavigate={onNavigate}
            />
            <LinkItem
              href="/list/legacy"
              label="Legacy List"
              onNavigate={onNavigate}
            />
            <LinkItem
              href="/map-submissions"
              label="Map Submissions"
              onNavigate={onNavigate}
            />
          </ul>
        </li>
      )}

      {mobile && (
        <li>
          <a href="#" onClick={toggleSubmenu(100, openSubmenus.includes(100))}>
            <i
              className={`bi ${
                openSubmenus.includes(100)
                  ? "bi-caret-down-fill"
                  : "bi-caret-right-fill"
              }`}
            />
            &nbsp;Admin
          </a>

          <Collapse in={openSubmenus.includes(100)}>
            <div>
              <ul className={`${styles.submenu} ${styles.mobile}`}>
                <LinkItem
                  href="/config"
                  label="List Config"
                  onNavigate={onNavigate}
                />
                <LinkItem
                  href="/completions/unconfirmed"
                  label="Pending Runs"
                  onNavigate={onNavigate}
                />
                <LinkItem
                  href="/list/legacy"
                  label="Legacy List"
                  onNavigate={onNavigate}
                />
                <LinkItem
                  href="/map-submissions"
                  label="Map Submissions"
                  onNavigate={onNavigate}
                />
              </ul>
            </div>
          </Collapse>
        </li>
      )}
    </>
  );
}

function LinkItem({ href, label, onNavigate }) {
  return (
    <li>
      <Link
        scroll={false}
        href={href}
        onClick={(e) => onNavigate && onNavigate(e)}
      >
        {label}
      </Link>
    </li>
  );
}
