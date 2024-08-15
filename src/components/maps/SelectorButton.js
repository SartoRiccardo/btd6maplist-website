import "./difficultyselector.css";
import { btd6Font } from "@/lib/fonts";

export default function SelectorButton({ text, children, active, className }) {
  return (
    <div
      className={`diffsel-imgWrapper shadow ${active ? "diffsel-active" : ""} ${
        className || ""
      }`}
    >
      {children}
      <p className={`${btd6Font.className} font-border text-center`}>{text}</p>
    </div>
  );
}
