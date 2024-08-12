import styles from "./difficultyselector.module.css";
import { btd6Font } from "@/lib/fonts";

export default function SelectorButton({ text, children }) {
  return (
    <div className={`${styles.imgWrapper} shadow`}>
      {children}
      <p className={`${btd6Font.className} font-border text-center`}>{text}</p>
    </div>
  );
}
