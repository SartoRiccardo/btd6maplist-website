import { luckiestGuy } from "@/lib/fonts";
import styles from "./header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className={`${luckiestGuy.className} font-border ${styles.header} shadow`}
    >
      <div className="row">
        <div className="col-auto">
          <div className="d-flex flex-column justify-content-center h-100">
            <Link href="/">
              <p>BTD6 Maplist</p>
            </Link>
          </div>
        </div>
        <div className="col d-flex justify-content-end">
          <nav>
            <div className="d-none d-md-block">
              <ul className={`${styles.navbar}`}>
                <li>
                  <a href="#">
                    Maps <i className="bi bi-caret-down-fill" />
                  </a>

                  <ul className={`${styles.submenu} shadow`}>
                    <li>
                      <Link href="/experts">Experts</Link>
                    </li>
                    <li>
                      <Link href="/list">The List</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#">
                    Leaderboard <i className="bi bi-caret-down-fill" />
                  </a>

                  <ul className={`${styles.submenu} shadow`}>
                    <li>
                      <Link href="/experts">Experts</Link>
                    </li>
                    <li>
                      <Link href="/list">The List</Link>
                    </li>
                  </ul>
                </li>

                <li>Login</li>
              </ul>
            </div>

            <div className="d-block d-md-none">
              <p className={styles.hamburgerBtn}>
                <i className="bi bi-list" />
              </p>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
