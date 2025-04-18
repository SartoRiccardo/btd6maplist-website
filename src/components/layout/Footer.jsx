import Link from "next/link";
import styles from "./footer.module.css";
import { discordInvites } from "@/utils/maplistUtils";

export default function Footer() {
  return (
    <footer className={`${styles.footer} px-3`}>
      <hr className={styles.hr} />
      <p>
        <a target="_blank" href={discordInvites.maplist}>
          <i className="bi bi-discord" />
          &nbsp;BTD6 Maplist
        </a>{" "}
        |{" "}
        <a target="_blank" href={discordInvites.emporium}>
          <i className="bi bi-discord" />
          &nbsp;BTD6 Map Emporium
        </a>{" "}
        | <Link href="/rules">Submission Rules</Link>
      </p>
      <p>&copy; 2024 - {new Date().getFullYear()} Sarto</p>
    </footer>
  );
}
