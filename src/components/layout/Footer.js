import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} px-3`}>
      <hr className={styles.hr} />
      <p>
        Join the{" "}
        <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank">
          BTD6 Maplist Discord!
        </a>
      </p>
    </footer>
  );
}
