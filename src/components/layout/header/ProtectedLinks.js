"use client";
import { useAuthLevels } from "@/utils/hooks";
import stylesNav from "./navbar.module.css";
import styles from "./navbar.module.css";
import Link from "next/link";
import LazyCollapse from "@/components/transitions/LazyCollapse";

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
        <li data-cy="admin-tab">
          <a href="#" tabIndex={0}>
            Admin <i className="bi bi-caret-down-fill" />
          </a>

          <ul
            className={`${stylesNav.submenu} shadow`}
            tabIndex={0}
            data-cy="nav-dropdown"
          >
            <LinkItem
              href="/config"
              label="List Config"
              onNavigate={onNavigate}
            />
            <LinkItem
              href="/completions/pending"
              label="Pending Runs"
              onNavigate={onNavigate}
            />
            <LinkItem
              href="/hidden-maps"
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
        <li data-cy="admin-tab">
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

          <LazyCollapse in={openSubmenus.includes(100)}>
            <div>
              <ul
                className={`${styles.submenu} ${styles.mobile}`}
                data-cy="nav-dropdown"
              >
                <LinkItem
                  href="/config"
                  label="List Config"
                  onNavigate={onNavigate}
                />
                <LinkItem
                  href="/completions/pending"
                  label="Pending Runs"
                  onNavigate={onNavigate}
                />
                <LinkItem
                  href="/hidden-maps"
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
          </LazyCollapse>
        </li>
      )}
    </>
  );
}

function LinkItem({ href, label, onNavigate }) {
  return (
    <li>
      <Link href={href} onClick={(e) => onNavigate && onNavigate(e)}>
        {label}
      </Link>
    </li>
  );
}
