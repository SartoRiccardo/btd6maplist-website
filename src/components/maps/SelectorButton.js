import styles from "./difficultyselector.module.css";
import { btd6Font } from "@/lib/fonts";

export default function SelectorButton({ text, children, active, className }) {
  return (
    <div
      className={`${styles.imgWrapper} shadow ${
        active ? styles.active : ""
      } ${className}`}
    >
      {children}
      <p className={`${btd6Font.className} font-border text-center`}>{text}</p>
    </div>
  );
}
