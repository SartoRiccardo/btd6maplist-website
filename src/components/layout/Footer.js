import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} px-3`}>
      <hr className={styles.hr} />
      <p>Made by Sarto</p>
    </footer>
  );
}
