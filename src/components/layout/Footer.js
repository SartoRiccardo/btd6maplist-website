import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} px-3`}>
      <hr className={styles.hr} />
      <p>
        Join the{" "}
        <a href="https://discord.gg/ZgMtM7X2TS" target="_blank">
          BTD6 Maplist Discord!
        </a>
      </p>
    </footer>
  );
}
